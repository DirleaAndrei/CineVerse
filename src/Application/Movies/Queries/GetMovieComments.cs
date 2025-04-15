using CineVerse.Application.Common.Interfaces;
using CineVerse.Application.Common.Models;

namespace CineVerse.Application.Movies.Queries;

public record GetMovieCommentsQuery : IRequest<List<CommentDto>>
{
    public int MovieId { get; set; }
}

public class GetMovieCommentsQueryHandler : IRequestHandler<GetMovieCommentsQuery, List<CommentDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IIdentityService _identityService;

    public GetMovieCommentsQueryHandler(IApplicationDbContext context, IIdentityService identityService)
    {
        _context = context;
        _identityService = identityService;
    }

    public async Task<List<CommentDto>> Handle(GetMovieCommentsQuery request, CancellationToken cancellationToken)
    {
        var comments = await _context.Comments
        .Where(c => c.MovieId == request.MovieId)
        .Select(c => new CommentDto
        {
            Id = c.Id,
            Text = c.Text,
            ParentCommentId = c.ParentCommentId,
            Created = c.Created,
            AuthorName = _identityService.GetUserNameAsync(c.CreatedBy ?? string.Empty).Result ?? "Unknown",
            LastModified = c.LastModified,
            ModifierName = c.LastModifiedBy != null ? _identityService.GetUserNameAsync(c.LastModifiedBy).Result : null
        })
        .ToListAsync(cancellationToken);

        return comments.OrderByDescending(c => c.Created).ToList();
    }
}
