using System.Data;
using CineVerse.Application.Movies.Commands.CreateComment;

namespace CineVerse.Application.Movies.Queries.Commands.CreateComment;

public class CommentCommandValidator : AbstractValidator<CreateCommentCommand>
{
    public CommentCommandValidator()
    {
        RuleFor(c => c.Text)
            .NotEmpty()
            .WithMessage("Movie ID is required.");
    }
}