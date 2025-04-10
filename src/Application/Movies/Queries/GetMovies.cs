using System.Text.Json;
using CineVerse.Application.Common.Models;
using CineVerse.Application.Configurations;
using Microsoft.Extensions.Options;
using RestSharp;

namespace CineVerse.Application.Movies.Queries.GetMovies
{

    public record GetMoviesQuery() : IRequest<PaginatedList<SummarizedMovie>>
    {
        public int Page { get; init; } = 1;
    }
    public class GetMoviesQueryHandler : IRequestHandler<GetMoviesQuery, PaginatedList<SummarizedMovie>>
    {
        private readonly TMDBSettings _tmdbSettings;
        public GetMoviesQueryHandler(IOptions<TMDBSettings> tmdbSettings)
        {
            _tmdbSettings = tmdbSettings.Value;
        }

        public async Task<PaginatedList<SummarizedMovie>> Handle(GetMoviesQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var options = new RestClientOptions($"https://api.themoviedb.org/3/movie/popular?page={request.Page}");
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
                        return new PaginatedList<SummarizedMovie>(Array.Empty<SummarizedMovie>(), 0, 0, 0);
                    }

                    return new PaginatedList<SummarizedMovie>
                        (moviesResponse.results, moviesResponse.total_results,
                         moviesResponse.page, moviesResponse.total_pages);
                }
                else
                {
                    // Handle the error response as needed
                    Console.WriteLine($"Response was not successful: {response.StatusCode} - {response.Content}");
                    return new PaginatedList<SummarizedMovie>(Array.Empty<SummarizedMovie>(), 0, 0, 0);
                }
            }
            catch (Exception ex)
            {
                // Log or handle the exception as needed
                Console.WriteLine($"Error fetching movies: {ex.Message}");
                return new PaginatedList<SummarizedMovie>(Array.Empty<SummarizedMovie>(), 0, 0, 0);
            }
        }
    }


}