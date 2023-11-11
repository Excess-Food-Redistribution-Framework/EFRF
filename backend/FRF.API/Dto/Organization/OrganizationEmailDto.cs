using System.ComponentModel.DataAnnotations;

namespace FRF.API.Dto.Organization
{
    public class OrganizationEmailDto
    {
        [EmailAddress]
        [Required]
        [Display(Name = "Email")]
        public string Email { get; set; } = string.Empty;
    }
}
