using System.ComponentModel.DataAnnotations;

namespace FRF.API.ViewModels
{
    public class RegisterViewModel
    {
        [Required]
        public string? UserName { get; set; }

        [Required]
        [EmailAddress]
        [Display(Name = "Email")]
        public string? Email { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters")]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string? Password { get; set; }
    }
}
