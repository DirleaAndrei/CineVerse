using CineVerse.Application.Common.Models;
using CineVerse.Application.Movies.Queries.GetMovies;
using Microsoft.AspNetCore.Http.HttpResults;
using static CineVerse.Application.Movies.Queries.GetMovies.SearchInMovies;

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

        public async Task<Ok<PaginatedList<SummarizedMovie>>> GetMovies(ISender sender, int page)
        {
            var movies = await sender.Send(new GetMoviesQuery { Page = page });
            return TypedResults.Ok(movies);
        }

        public async Task<Results<Ok<PaginatedList<SummarizedMovie>>, BadRequest<string>>>
                 SearchMovies(ISender sender, string query, int genreId, int page)
        {
            if (string.IsNullOrWhiteSpace(query) && genreId == 0)
                return TypedResults.BadRequest("Query cannot be null or empty.");

            var movies = await sender.Send(new SearchInMoviesQuery { Query = query, GenreId = genreId, Page = page });
            return TypedResults.Ok(movies);
        }
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