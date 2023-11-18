using FRF.API.Dto.Address;
using FRF.Domain.Enum;
using System.ComponentModel.DataAnnotations;

namespace FRF.API.Dto.Organization
{
    public class CreateOrganizationDto
    {
        [Required]
        [Display(Name = "Name")]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Display(Name = "Type")]
        public OrganizationType Type { get; set; }

        [Display(Name = "Information")]
        public string Information { get; set; } = string.Empty;


        [Display(Name = "Address")]
        public AddressDto? Address { get; set; }

        [Display(Name = "Location")]
        public LocationDto? Location { get; set; }

        //[Required]
        //[Display(Name = "Password")]
        //public string Password { get; set; } = string.Empty;
    }
}
