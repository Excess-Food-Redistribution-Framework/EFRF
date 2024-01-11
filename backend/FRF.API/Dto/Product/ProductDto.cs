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
        public string Name { get; set; } = string.Empty;

        [Required]
        [Display(Name = "Description")]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        [Display(Name = "Type")]
        public ProductType Type { get; set; }

        [Required]
        [Display(Name = "Quantity")]
        public int Quantity { get; set; } = 0;

        [Required]
        [Display(Name = "Distance")]
        public double Distance { get; set; } = 0;

        [Required]
        [Display(Name = "Units")]
        public ProductUnits Units { get; set; } = ProductUnits.Grams;

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

        [DataType(DataType.ImageUrl)]
        [Display(Name = "Image")]
        public string? ImageUrl { get; set; }

        [Required]
        [Display(Name = "AverageRating")]
        public double? AverageRating { get; set; }
    }
}
