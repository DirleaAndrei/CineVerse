using System.Text.Json;
using CineVerse.Application.Common.Models;
using CineVerse.Application.Configurations;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RestSharp;

namespace CineVerse.Application.Movies.Queries;
public record SearchMoviesQuery : IRequest<PaginatedList<SummarizedMovie>>
{
    public string? Query { get; init; } = string.Empty;
    public int GenreId { get; set; } = 0;
    public int Page { get; set; } = 1;
}

public class SearchMoviesQueryHandler : IRequestHandler<SearchMoviesQuery, PaginatedList<SummarizedMovie>>
{
    private readonly TMDBSettings _tmdbSettings;
    private readonly ILogger<SearchMoviesQueryHandler> _logger;

    public SearchMoviesQueryHandler(IOptions<TMDBSettings> tmdbSettings, ILogger<SearchMoviesQueryHandler> logger)
    {
        _tmdbSettings = tmdbSettings.Value;
        _logger = logger;
    }

    public async Task<PaginatedList<SummarizedMovie>> Handle(SearchMoviesQuery request, CancellationToken cancellationToken)
    {
        var endpoint = string.IsNullOrWhiteSpace(request.Query)
            ? $"{_tmdbSettings.BaseUrl}/discover/movie?with_genres={request.GenreId}&page={request.Page}"
            : $"{_tmdbSettings.BaseUrl}/search/movie?query={request.Query}&page={request.Page}";

        return await FetchMovies(endpoint, request.GenreId, cancellationToken);
    }

    private async Task<PaginatedList<SummarizedMovie>> FetchMovies(string endpoint, int genreId, CancellationToken cancellationToken)
    {
        try
        {
            var summarizedMovies = await SendApiRequest<SummarizedMovies>(endpoint, cancellationToken);

            if (summarizedMovies == null || summarizedMovies.results == null)
            {
                _logger.LogWarning("No movies found for the given criteria.");
                return new PaginatedList<SummarizedMovie>(Array.Empty<SummarizedMovie>(), 0, 0);
            }

            // Filter movies by genre if applicable
            var filteredMovies = genreId == 0
                ? summarizedMovies.results
                : summarizedMovies.results.Where(movie => movie.genre_ids?.Contains(genreId) == true).ToList();

            return new PaginatedList<SummarizedMovie>(
                filteredMovies,
                summarizedMovies.page,
                summarizedMovies.total_pages
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while fetching movies.");
            throw;
        }
    }

    private async Task<T?> SendApiRequest<T>(string endpoint, CancellationToken cancellationToken)
    {
        try
        {
            var options = new RestClientOptions(endpoint)
            {
                Timeout = TimeSpan.FromMilliseconds(5000)
            };
            var client = new RestClient(options);
            var restRequest = new RestRequest("");
            restRequest.AddHeader("accept", "application/json");
            restRequest.AddHeader("Authorization", $"Bearer {_tmdbSettings.BearerToken}");

            var response = await client.GetAsync(restRequest, cancellationToken);

            if (response.IsSuccessful && response.Content != null)
            {
                return JsonSerializer.Deserialize<T>(response.Content);
            }

            _logger.LogError("Failed to fetch data. StatusCode: {StatusCode}, Content: {Content}", response.StatusCode, response.Content);
            throw new Exception("Failed to fetch data from TMDB API.");
        }
        catch (TaskCanceledException ex)
        {
            _logger.LogError(ex, "The API request was canceled, possibly due to a timeout.");
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while sending the API request.");
            throw;
        }
    }
}