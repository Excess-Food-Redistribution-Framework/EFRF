namespace FRF.Domain.Entities;

public class Article : BaseEntity
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Teaser { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
}