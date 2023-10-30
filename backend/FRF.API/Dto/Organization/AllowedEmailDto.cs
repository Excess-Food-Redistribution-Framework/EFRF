using System.ComponentModel.DataAnnotations;

namespace FRF.API.Dto.Organization
{
    public class AllowedEmailDto
    {
        [EmailAddress]
        [Required]
        [Display(Name = "Email")]
        public string Email { get; set; } = string.Empty;
    }
}
