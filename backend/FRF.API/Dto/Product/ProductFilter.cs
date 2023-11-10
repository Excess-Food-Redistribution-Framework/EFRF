using System.ComponentModel.DataAnnotations;

namespace FRF.API.Dto.Product
{
    public class ProductFilter
    {
        [Display(Name = "Only not expired products")]
        public bool NotExpired { get; set; } = false;

        [Display(Name = "Only not blocked products")]
        public bool NotBlocked { get; set; } = true;

        [Display(Name = "OrganizationId")]
        public Guid OrganizationId { get; set; } = Guid.Empty;

        [Display(Name = "FoodRequestId")]
        public Guid FoodRequestId { get; set; } = Guid.Empty;
    }
}
