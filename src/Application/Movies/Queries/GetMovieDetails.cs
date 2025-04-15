using System.Text.Json;
using CineVerse.Application.Common.Exceptions;
using CineVerse.Application.Common.Models;
using CineVerse.Application.Configurations;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RestSharp;

namespace CineVerse.Application.Movies.Queries;

public record GetMoviesDetailsQuery : IRequest<MovieDetails>
{
    public int Id { get; set; }
}

public class GetMoviesDetailsQueryHandler : IRequestHandler<GetMoviesDetailsQuery, MovieDetails>
{
    private readonly TMDBSettings _tmdbSettings;
    private readonly ILogger<GetMoviesDetailsQueryHandler> _logger;
    public GetMoviesDetailsQueryHandler(IOptions<TMDBSettings> tmdbSettings, ILogger<GetMoviesDetailsQueryHandler> logger)
    {
        _tmdbSettings = tmdbSettings.Value;
        _logger = logger;
    }

    public async Task<MovieDetails> Handle(GetMoviesDetailsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var restRequest = new RestRequest("");
            restRequest.AddHeader("accept", "application/json");
            restRequest.AddHeader("Authorization", $"Bearer {_tmdbSettings.BearerToken}");

            var options = new RestClientOptions($"{_tmdbSettings.BaseUrl}/movie/{request.Id}")
            {
                Timeout = TimeSpan.FromMilliseconds(5000)
            };
            var client = new RestClient(options);
            var response = await client.GetAsync(restRequest, cancellationToken);

            if (!response.IsSuccessful || response.Content == null)
            {
                if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
                    throw new NotFoundException(request.Id.ToString(), nameof(MovieDetails));
                throw new Exception($"Failed to fetch movie details. StatusCode: {response.StatusCode}");
            }

            var jsonResponse = response.Content;
            var movie = JsonSerializer.Deserialize<MovieDetails>(jsonResponse);

            if (movie == null)
                throw new DeserializationException(response,
                        new JsonDeserializationException(jsonResponse, nameof(MovieDetails)));

            return movie;
        }
        catch (TaskCanceledException ex)
        {
            _logger.LogError(ex, "The API request was canceled, possibly due to a timeout.");
            throw;
        }
        catch (NotFoundException ex)
        {
            _logger.LogError(ex, "Movie not found.");
            throw;
        }
        catch (DeserializationException ex)
        {
            _logger.LogError(ex, "Failed to deserialize the JSON response from TMDB API.");
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while fetching movies from TMDB API.");
            throw;
        }
    }
}
