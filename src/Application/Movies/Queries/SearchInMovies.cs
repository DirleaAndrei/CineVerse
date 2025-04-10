using System.Text.Json;
using CineVerse.Application.Common.Models;
using CineVerse.Application.Configurations;
using Microsoft.Extensions.Options;
using RestSharp;

namespace CineVerse.Application.Movies.Queries.GetMovies
{
    public class SearchInMovies
    {
        public record SearchInMoviesQuery : IRequest<PaginatedList<SummarizedMovie>>
        {
            public string? Query { get; init; } = string.Empty;
            public int GenreId { get; set; } = 0;
            public int Page { get; set; } = 1;
        }
        public class SearchInMoviesQueryHandler : IRequestHandler<SearchInMoviesQuery, PaginatedList<SummarizedMovie>>
        {
            private readonly TMDBSettings _tmdbSettings;

            public SearchInMoviesQueryHandler(IOptions<TMDBSettings> tmdbSettings)
            {
                _tmdbSettings = tmdbSettings.Value;
            }

            public async Task<PaginatedList<SummarizedMovie>> Handle(SearchInMoviesQuery request, CancellationToken cancellationToken)
            {
                try
                {
                    // Create Request with the headers
                    var restRequest = new RestRequest("");
                    restRequest.AddHeader("accept", "application/json");
                    restRequest.AddHeader("Authorization", $"Bearer {_tmdbSettings.BearerToken}");

                    return string.IsNullOrWhiteSpace(request.Query ?? string.Empty)
                        ? await SearchMoviesByGenre(restRequest, request.GenreId, request.Page, cancellationToken)
                        : await SearchMoviesByTitleAndGenre(restRequest, request.Query ?? string.Empty, request.Page, request.GenreId, cancellationToken);
                }
                catch (Exception ex)
                {
                    // Log or handle the exception as needed
                    Console.WriteLine($"Error fetching movies: {ex.Message}");
                    return new PaginatedList<SummarizedMovie>(Array.Empty<SummarizedMovie>(), 0, 0, 0); ;
                }
            }

            private static async Task<PaginatedList<SummarizedMovie>> SearchMoviesByTitleAndGenre(RestRequest restRequest, string query, int page, int genreId, CancellationToken cancellationToken)
            {
                //Get the movies by name and genre
                var options = new RestClientOptions($"https://api.themoviedb.org/3/search/movie?query={query}&page={page}");
                var client = new RestClient(options);
                var response = await client.GetAsync(restRequest, cancellationToken);

                if (response.IsSuccessful && response.Content != null)
                {
                    var jsonResponse = response.Content;
                    var summarizedMovies = JsonSerializer.Deserialize<SummarizedMovies>(jsonResponse);

                    if (summarizedMovies == null || summarizedMovies?.results == null)
                        return new PaginatedList<SummarizedMovie>(Array.Empty<SummarizedMovie>(), 0, 0, 0);

                    //return all movies if no genre is selected
                    if (genreId == 0)
                        return new PaginatedList<SummarizedMovie>
                        (summarizedMovies.results, summarizedMovies.total_results,
                         summarizedMovies.page, summarizedMovies.total_pages);

                    // //Filter the movies by genre
                    return FetchMoviesRecursively(
                        restRequest,
                        query,
                        genreId,
                        page,
                        summarizedMovies.total_pages,
                        summarizedMovies.results.ToList(),
                        cancellationToken).Result;
                }
                return new PaginatedList<SummarizedMovie>(Array.Empty<SummarizedMovie>(), 0, 0, 0);
            }

            private static async Task<PaginatedList<SummarizedMovie>> SearchMoviesByGenre(RestRequest restRequest, int genreId, int page, CancellationToken cancellationToken)
            {
                //Get the movies by name and genre
                var options = new RestClientOptions($"https://api.themoviedb.org/3/discover/movie?with_genres={genreId}&page={page}");
                var client = new RestClient(options);
                var response = await client.GetAsync(restRequest, cancellationToken);

                if (response.IsSuccessful && response.Content != null)
                {
                    var jsonResponse = response.Content;
                    var summarizedMovies = JsonSerializer.Deserialize<SummarizedMovies>(jsonResponse);

                    if (summarizedMovies == null || summarizedMovies?.results == null)
                        return new PaginatedList<SummarizedMovie>(Array.Empty<SummarizedMovie>(), 0, 0, 0);

                    return new PaginatedList<SummarizedMovie>
                        (summarizedMovies.results, summarizedMovies.total_results,
                         summarizedMovies.page, summarizedMovies.total_pages);
                }
                return new PaginatedList<SummarizedMovie>(Array.Empty<SummarizedMovie>(), 0, 0, 0);
            }

            private static async Task<PaginatedList<SummarizedMovie>> FetchMoviesRecursively(
                                 RestRequest restRequest, string query, int genreId, int page,
                                 int totalPages, List<SummarizedMovie> accumulatedMovies,
                                 CancellationToken cancellationToken)
            {
                // Base case: If we already have 20 movies or reached the last page, return the result
                if (accumulatedMovies.Count >= 20 || page > totalPages)
                {
                    return new PaginatedList<SummarizedMovie>(
                        accumulatedMovies.Take(20).ToList(), // Return only the first 20 movies
                        accumulatedMovies.Count,
                        page,
                        totalPages
                    );
                }

                // Create the RestClient with the current page
                var options = new RestClientOptions($"https://api.themoviedb.org/3/search/movie?query={query}&page={page}");
                var client = new RestClient(options);

                // Fetch the movies from the API
                var response = await client.GetAsync(restRequest, cancellationToken);

                if (response.IsSuccessful && response.Content != null)
                {
                    var jsonResponse = response.Content;
                    var summarizedMovies = JsonSerializer.Deserialize<SummarizedMovies>(jsonResponse);

                    if (summarizedMovies == null || summarizedMovies.results == null)
                    {
                        return new PaginatedList<SummarizedMovie>(Array.Empty<SummarizedMovie>(), 0, 0, 0);
                    }

                    // Update totalPages from the API response
                    totalPages = summarizedMovies.total_pages;

                    // Filter movies by genre
                    var filteredMovies = genreId == 0
                        ? summarizedMovies.results
                        : summarizedMovies.results.Where(movie => movie.genre_ids?.Contains(genreId) == true).ToList();

                    // Accumulate the filtered movies
                    accumulatedMovies.AddRange(filteredMovies);

                    // Recursively fetch the next page
                    return await FetchMoviesRecursively(
                        restRequest,
                        query,
                        genreId,
                        page + 1,
                        totalPages,
                        accumulatedMovies,
                        cancellationToken
                    );
                }

                // If the response is not successful, return the accumulated movies so far
                return new PaginatedList<SummarizedMovie>(
                    accumulatedMovies.Take(20).ToList(),
                    accumulatedMovies.Count,
                    page,
                    totalPages
                );
            }
        }
    }
}