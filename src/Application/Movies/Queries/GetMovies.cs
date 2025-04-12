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
            var options = new RestClientOptions($"{_tmdbSettings.BaseUrl}/movie/popular?page={request.Page}");
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
                    _logger.LogWarning("Movies response is null or empty.");
                    return new PaginatedList<SummarizedMovie>(Array.Empty<SummarizedMovie>(), 0, 0, 0);
                }

                return new PaginatedList<SummarizedMovie>
                    (moviesResponse.results, moviesResponse.total_results,
                     moviesResponse.page, moviesResponse.total_pages);
            }
            else
            {
                _logger.LogError("Failed to fetch movies. StatusCode: {StatusCode}, Content: {Content}",
                    response.StatusCode, response.Content);
                throw new Exception("Failed to fetch movies from TMDB API.");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while fetching movies from TMDB API.");
            throw new Exception("An internal server error occurred. Please try again later.", ex);
        }
    }
}
