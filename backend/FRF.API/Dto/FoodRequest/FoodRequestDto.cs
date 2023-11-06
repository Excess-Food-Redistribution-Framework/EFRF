using FRF.API.Dto.Organization;
using FRF.Domain.Enum;

namespace FRF.API.Dto.FoodRequest
{
    public class FoodRequestDto
    {
        public Guid Id { get; set; }

        public string Title { get; set; } = String.Empty;
        public string Description { get; set; } = String.Empty;


        public Guid ProviderId { get; set; }
        public Guid OrganizationId { get; set; }

        public DeliveryType Delivery { get; set; }

        public DateTime EstPickUpTime { get; set; } = DateTime.UtcNow;
        public DateTime CreationTime { get; set; } = DateTime.UtcNow;
    }
}
