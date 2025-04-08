using CineVerse.Application.Common.Models;
using CineVerse.Application.Movies.Queries.GetMovies;
using Microsoft.AspNetCore.Http.HttpResults;

namespace CineVerse.Web.Endpoints
{
    public class Movie : EndpointGroupBase
    {
        public override void Map(WebApplication app)
        {
            app.MapGroup(this)
            .MapGet(GetMovies);
            // .MapGet(SearchMoviesByName, "searchByName/{query}/{genreID}")
            // .MapGet(GetMovieDetails, "movie/{id}");
        }

        public async Task<Ok<List<SummarizedMovie>>> GetMovies(ISender sender)
        {
            var movies = await sender.Send(new GetMoviesQuery());
            return TypedResults.Ok(movies);
        }
        // public async Task<IResult> SearchMoviesByName(ISender sender, string query, int genreId)
        // {
        //     if (string.IsNullOrWhiteSpace(query) && genreId == 0)
        //         return TypedResults.BadRequest("Query cannot be null or empty.");

        //     var movies = await sender.Send(new GetMoviesByNameQuery { Query = query, GenreId = genreId });
        //     return TypedResults.Ok(movies);
        // }
        // public async Task<Ok<MovieDetails>> GetMovieDetails(ISender sender, int id)
        // {
        //     var movies = await sender.Send(new GetMoviesDetailsQuery { Id = id });
        //     return TypedResults.Ok(movies);
        // }

        // public async Task<Created<int>> AddComment(ISender sender, AddCommentCommand command)
        // {
        //     var id = await sender.Send(command);
        //     return TypedResults.Created($"/{nameof(TheMovieDb)}/comment/{id}", id);
        // }
    }
}