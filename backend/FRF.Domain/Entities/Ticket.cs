namespace FRF.Domain.Entities;

public class Ticket : BaseEntity
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
}