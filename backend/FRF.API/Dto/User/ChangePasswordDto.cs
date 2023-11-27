using System.ComponentModel.DataAnnotations;

namespace FRF.API.Dto.User;

public class ChangePasswordDto
{
    [Required]
    [DataType(DataType.Password)]
    [Display(Name = "Current Password")]
    public string? OldPassword { get; set; }
    
    [Required]
    [DataType(DataType.Password)]
    [Display(Name = "New Password")]
    public string? NewPassword { get; set; }
}
