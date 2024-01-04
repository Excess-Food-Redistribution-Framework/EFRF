using System.ComponentModel.DataAnnotations;

namespace FRF.API.Dto.Article;

public class CreateTicketDto
{
    [Required]
    [Display(Name = "Full Name")]
    public string FullName { get; set; } = null!;
    
    [Required]
    [Display(Name = "Email")]
    public string Email { get; set; } = null!;
    
    [Required]
    [Display(Name = "Category")]
    public string Category { get; set; } = null!;
    
    [Required]
    [Display(Name = "Text")]
    public string Text { get; set; } = null!;
}
