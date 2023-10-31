using FRF.Domain.Enum;
using System.ComponentModel.DataAnnotations;

namespace FRF.API.Dto.Organization
{
    public class OrganizationDto
    {
        [Required]
        [Display(Name = "Id")]
        public Guid Id { get; set; }

        [Required]
        [Display(Name = "Name")]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Display(Name = "Type")]
        public OrganizationType Type { get; set; }

        [Display(Name = "Information")]
        public string Information { get; set; } = string.Empty;
    }
}
