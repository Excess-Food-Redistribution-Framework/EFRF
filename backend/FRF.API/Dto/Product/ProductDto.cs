using FRF.API.Dto.Organization;
using FRF.Domain.Enum;
using System.ComponentModel.DataAnnotations;

namespace FRF.API.Dto.Product
{
    public class ProductDto
    {

        [Required]
        [Display(Name = "Id")]
        public Guid Id { get; set; }

        [Required]
        [Display(Name = "Name")]
        public string Name { get; set; } = String.Empty;

        [Required]
        [Display(Name = "Description")]
        string Description { get; set; } = String.Empty;

        // IN FUTURE?: Change product type to the database Entity instead of Enum
        [Required]
        [Display(Name = "Type")]
        public ProductType Type { get; set; }

        [Required]
        [Display(Name = "Quantity")]
        public int Quantity { get; set; } = 0;

        [Required]
        [Display(Name = "AvailableQuantity")]
        public int AvailableQuantity { get; set; } = 0;

        [Required]
        [DataType(DataType.Date)]
        [Display(Name = "ExpirationDate")]
        public DateTime ExpirationDate { get; set; } = DateTime.UtcNow;

        [Required]
        [Display(Name = "Organization")]
        public OrganizationDto? Organization { get; set; }
    }
}
