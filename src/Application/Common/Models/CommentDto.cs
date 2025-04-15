namespace CineVerse.Application.Common.Models;

public class CommentDto
{
    public int Id { get; set; }
    public string? Text { get; set; }
    public int? ParentCommentId { get; set; }
    public DateTimeOffset Created { get; set; }
    public required string AuthorName { get; set; }
    public DateTimeOffset LastModified { get; set; }
    public string? ModifierName { get; set; }
}