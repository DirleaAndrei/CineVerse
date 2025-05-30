using System.Text.Json;
using CineVerse.Application.Common.Models;
using CineVerse.Application.Configurations;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RestSharp;

namespace CineVerse.Application.Movies.Queries;

public record GetMoviesQuery() : IRequest<PaginatedList<SummarizedMovie>>
{
    public int Page { get; init; } = 1;
}

public class GetMoviesQueryHandler : IRequestHandler<GetMoviesQuery, PaginatedList<SummarizedMovie>>
{
    private readonly TMDBSettings _tmdbSettings;
    private readonly ILogger<GetMoviesQueryHandler> _logger;

    public GetMoviesQueryHandler(IOptions<TMDBSettings> tmdbSettings, ILogger<GetMoviesQueryHandler> logger)
    {
        _tmdbSettings = tmdbSettings.Value;
        _logger = logger;
    }

    public async Task<PaginatedList<SummarizedMovie>> Handle(GetMoviesQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var options = new RestClientOptions($"{_tmdbSettings.BaseUrl}/movie/popular?page={request.Page}")
            {
                Timeout = TimeSpan.FromMilliseconds(5000)
            };
            var client = new RestClient(options);
            var restRequest = new RestRequest("");
            restRequest.AddHeader("accept", "application/json");
            restRequest.AddHeader("Authorization", $"Bearer {_tmdbSettings.BearerToken}");

            var response = await client.GetAsync(restRequest, cancellationToken);

            // Check if the response is successful
            if (response.IsSuccessful && response.Content != null)
            {
                var jsonResponse = response.Content;
                var moviesResponse = JsonSerializer.Deserialize<SummarizedMovies>(jsonResponse);

                if (moviesResponse == null || moviesResponse?.results == null)
                {
                    _logger.LogError("There was an issue deserializing the response. Response: {Response}", jsonResponse);
                    throw new Exception("Failed to deserialize the response from TMDB API.");
                }

                return new PaginatedList<SummarizedMovie>
                    (moviesResponse.results, moviesResponse.page, moviesResponse.total_pages);
            }
            else
            {
                _logger.LogError("Failed to fetch movies. StatusCode: {StatusCode}, Content: {Content}",
                    response.StatusCode, response.Content);
                throw new Exception("Failed to fetch movies from TMDB API.");
            }
        }
        catch (TaskCanceledException ex)
        {
            _logger.LogError(ex, "The API request was canceled, possibly due to a timeout.");
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while fetching movies from TMDB API.");
            throw;
        }
    }
}
