using System.ComponentModel.DataAnnotations;

namespace FRF.API.Dto.Article;

public class CreateUpdateArticleDto
{
    [Required]
    [Display(Name = "Title")]
    public string Title { get; set; } = string.Empty;

    [Required]
    [Display(Name = "Content")]
    public string Content { get; set; } = string.Empty;
}