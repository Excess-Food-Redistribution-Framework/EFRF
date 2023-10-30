using FRF.Domain.Enum;
using System.ComponentModel.DataAnnotations;

namespace FRF.API.Dto.Organization
{
    public class CreateOrganizationDto : OrganizationDto
    {
        [Required]
        [Display(Name = "Password")]
        public string Password { get; set; } = string.Empty;
    }
}
