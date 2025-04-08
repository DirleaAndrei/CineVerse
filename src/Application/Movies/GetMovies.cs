using System.Text.Json;
using CineVerse.Application.Common.Models;
using RestSharp;

namespace CineVerse.Application.Movies.Queries.GetMovies
{
    public record GetMoviesQuery : IRequest<List<SummarizedMovie>>;
    public class GetMoviesQueryHandler() : IRequestHandler<GetMoviesQuery, List<SummarizedMovie>>
    {

        public async Task<List<SummarizedMovie>> Handle(GetMoviesQuery request, CancellationToken cancellationToken)
        {
            using var httpClient = new HttpClient();
            try
            {
                var options = new RestClientOptions("https://api.themoviedb.org/3/movie/popular");
                var client = new RestClient(options);
                var restRequest = new RestRequest("");
                restRequest.AddHeader("accept", "application/json");
                restRequest.AddHeader("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MmE1YWM0ODRhMDIyZmE0NTI4ZDI2NTI1NmQ0MDZiMiIsIm5iZiI6MTc0Mzg2NDYyMi41Nzc5OTk4LCJzdWIiOiI2N2YxNDMyZWUxZDVjMjNjNmVkOTExNzQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.22jYKXIj_wjEImbPuJft4MsLjWSffQtiiTLc_3TWUvQ");
                var response = await client.GetAsync(restRequest, cancellationToken);
                // Check if the response is successful
                if (response.IsSuccessful && response.Content != null)
                {
                    var jsonResponse = response.Content;
                    var movieResponse = JsonSerializer.Deserialize<SummarizedMovies>(jsonResponse, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                    return movieResponse?.Results != null
                        ? movieResponse.Results
                        : [];
                }
                return [];
            }
            catch (Exception ex)
            {
                // Log or handle the exception as needed
                Console.WriteLine($"Error fetching movies: {ex.Message}");
                return [];
            }
        }
    }


}