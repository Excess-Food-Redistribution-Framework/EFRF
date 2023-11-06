using FRF.API.Dto.Organization;
using System.ComponentModel.DataAnnotations;

namespace FRF.API.Dto.Product
{
    public class ProductDtoDetailed : ProductDto
    {
        [Required]
        [Display(Name = "Organization")]
        public OrganizationDto? Organization { get; set; }
    }
}
