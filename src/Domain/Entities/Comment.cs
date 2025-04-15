using System.ComponentModel.DataAnnotations.Schema;

namespace CineVerse.Domain.Entities
{
    public class Comment : BaseAuditableEntity
    {
        public int MovieId { get; set; }

        public int? ParentCommentId { get; set; }

        public string? Text { get; set; }

        [ForeignKey("ParentCommentId")]
        public virtual Comment? ParentComment { get; set; }
    }

}