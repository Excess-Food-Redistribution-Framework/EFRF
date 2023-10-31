using FRF.Domain.Enum;
using System.ComponentModel.DataAnnotations;

namespace FRF.API.Dto.Organization
{
    public class UpdateOrganizationDto
    {
        [Display(Name = "Name")]
        public string Name { get; set; } = string.Empty;

        [Display(Name = "Information")]
        public string Information { get; set; } = string.Empty;

        //[Display(Name = "Password")]
        //public string Password { get; set; } = string.Empty;
    }
}
