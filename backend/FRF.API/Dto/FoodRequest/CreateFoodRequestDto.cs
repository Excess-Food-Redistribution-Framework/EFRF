using FRF.Domain.Enum;
using System.ComponentModel.DataAnnotations;

namespace FRF.API.Dto.FoodRequest
{
    public class CreateFoodRequestDto
    {
        [Required]
        [Display(Name = "Title")]
        public string Title { get; set; } = String.Empty;

        [Display(Name = "Description")]
        public string Description { get; set; } = String.Empty;

        [Display(Name = "Estimated pickup time")]
        public DateTime EstPickUpTime { get; set; } = DateTime.UtcNow;

        [Required]
        [Display(Name = "Delivery type")]
        public DeliveryType Delivery { get; set; }


        [Required]
        [Display(Name = "Assigned organization")]
        public Guid OrganizationId { get; set; } 
    }
}
