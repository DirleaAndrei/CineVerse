using CineVerse.Application.Common.Models;
using CineVerse.Application.Movies.Queries;
using Microsoft.AspNetCore.Http.HttpResults;

namespace CineVerse.Web.Endpoints
{
    public class Movie : EndpointGroupBase
    {
        public override void Map(WebApplication app)
        {
            app.MapGroup(this)
            .MapGet(GetMovies, "{page}")
            .MapGet(SearchMovies, "searchMovies/{query}/{genreID}/{page}");
            // .MapGet(GetMovieDetails, "movie/{id}");
        }

        public async Task<Results<Ok<PaginatedList<SummarizedMovie>>, StatusCodeHttpResult>>
                GetMovies(ISender sender, int page)
        {
            try
            {
                var movies = await sender.Send(new GetMoviesQuery { Page = page });
                return TypedResults.Ok(movies);
            }
            catch (Exception)
            {
                return TypedResults.StatusCode(500);
            }
        }

        public async Task<Results<Ok<PaginatedList<SummarizedMovie>>, BadRequest<string>>>
                 SearchMovies(ISender sender, string query, int genreId, int page)
        {
            if (string.IsNullOrWhiteSpace(query) && genreId == 0)
                return TypedResults.BadRequest("Query cannot be null or empty.");

            var movies = await sender.Send(new SearchMoviesQuery { Query = query, GenreId = genreId, Page = page });
            return TypedResults.Ok(movies);
        }

        // public async Task<Results<Ok<MovieDetails>, NotFound<string>>>
        //          GetMovieDetails(ISender sender, int id)
        // {
        //     var movie = await sender.Send(new GetMoviesDetailsQuery { Id = id });
        //     return TypedResults.Ok(movie);
        // }

        // public async Task<Created<int>> AddComment(ISender sender, AddCommentCommand command)
        // {
        //     var id = await sender.Send(command);
        //     return TypedResults.Created($"/{nameof(TheMovieDb)}/comment/{id}", id);
        // }
    }
}