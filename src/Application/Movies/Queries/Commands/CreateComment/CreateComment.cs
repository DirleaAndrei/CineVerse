using CineVerse.Application.Common.Interfaces;
using CineVerse.Application.Common.Models;
using CineVerse.Application.Common.Security;
using CineVerse.Domain.Entities;

namespace CineVerse.Application.Movies.Commands.CreateComment;

[Authorize]
public record CreateCommentCommand : IRequest<CommentDto>
{
    public int MovieId { get; init; }

    public required string Text { get; init; }

    public int? ParentCommentId { get; set; }
}

public class CreateCommentCommandHandler : IRequestHandler<CreateCommentCommand, CommentDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IUser _currentUser;
    private readonly IIdentityService _identityService;

    public CreateCommentCommandHandler(IApplicationDbContext context, IUser currentUser,
    IIdentityService identityService)
    {
        _context = context;
        _currentUser = currentUser;
        _identityService = identityService;
    }

    public async Task<CommentDto> Handle(CreateCommentCommand request, CancellationToken cancellationToken)
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

        var savedComment = await _context.Comments
            .FirstOrDefaultAsync(c => c.Id == comment.Id);

        if (savedComment == null)
        {
            throw new NotFoundException(nameof(Comment), comment.Id.ToString());
        }

        return new CommentDto
        {
            Id = savedComment.Id,
            Text = savedComment.Text,
            ParentCommentId = savedComment.ParentCommentId,
            Created = savedComment.Created,
            AuthorName = _identityService.GetUserNameAsync(savedComment.CreatedBy ?? string.Empty).Result ?? "Unknown",
            LastModified = savedComment.LastModified,
            ModifierName = savedComment.LastModifiedBy
        };
    }
}
