using CineVerse.Domain.Entities;

namespace CineVerse.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Comment> Comments { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
