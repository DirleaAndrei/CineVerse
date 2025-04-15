using CineVerse.Application.Common.Interfaces;
using CineVerse.Application.Common.Security;
using CineVerse.Domain.Entities;

namespace CineVerse.Application.Movies.Commands.CreateComment;

[Authorize]
public record CreateCommentCommand : IRequest<int>
{
    public int MovieId { get; init; }

    public required string Text { get; init; }

    public int? ParentCommentId { get; set; }
}

public class CreateCommentCommandHandler : IRequestHandler<CreateCommentCommand, int>
{
    private readonly IApplicationDbContext _context;
    private readonly IUser _currentUser;

    public CreateCommentCommandHandler(IApplicationDbContext context, IUser currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<int> Handle(CreateCommentCommand request, CancellationToken cancellationToken)
    {
        var comment = new Comment
        {
            MovieId = request.MovieId,
            Text = request.Text,
            CreatedBy = _currentUser.Id,
            Created = DateTime.UtcNow,
            ParentCommentId = request.ParentCommentId,
        };

        _context.Comments.Add(comment);
        await _context.SaveChangesAsync(cancellationToken);

        return comment.Id;
    }
}
