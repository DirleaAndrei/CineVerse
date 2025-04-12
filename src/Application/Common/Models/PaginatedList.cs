namespace CineVerse.Application.Common.Models;

public class PaginatedList<T>
{
    public IReadOnlyCollection<T> Items { get; }
    public int PageNumber { get; }
    public int TotalPages { get; }
    public int TotalCount { get; }

    public PaginatedList(IReadOnlyCollection<T> items, int count, int pageNumber, int totalPages)
    {
        PageNumber = pageNumber;
        TotalPages = totalPages;
        TotalCount = count;
        Items = items;
    }
}
