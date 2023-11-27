using System.ComponentModel.DataAnnotations;

namespace FRF.API.Dto.User;

public class EditUserDto
{
    [Required]
    [Display(Name = "Firstname")]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [Display(Name = "Lastname")]
    public string LastName { get; set; } = string.Empty;
}
