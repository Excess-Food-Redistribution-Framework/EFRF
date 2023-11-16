using System.ComponentModel.DataAnnotations;
using FRF.API.Dto.Organization;

namespace FRF.API.Dto.User
{
    public class RegisterDto
    {
        [Required]
        [Display(Name = "Firstname")]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [Display(Name = "Lastname")]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [Display(Name = "Email")]
        public string? Email { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters")]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string? Password { get; set; }
        
        public CreateOrganizationDto Organization { get; set; } = new CreateOrganizationDto();
    }
}
