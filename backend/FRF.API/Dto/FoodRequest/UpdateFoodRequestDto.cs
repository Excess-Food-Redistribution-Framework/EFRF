using FRF.Domain.Enum;
using System.ComponentModel.DataAnnotations;

namespace FRF.API.Dto.FoodRequest
{
    public class UpdateFoodRequestDto
    {
        [Required]
        public Guid Id { get; set; }

        public string Title { get; set; } = String.Empty;
        public string Description { get; set; } = String.Empty;

        public DeliveryType Delivery { get; set; }

        public DateTime EstPickUpTime { get; set; } = DateTime.UtcNow;
    }
}
