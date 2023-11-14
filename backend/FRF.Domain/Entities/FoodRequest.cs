using FRF.Domain.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FRF.Domain.Entities
{
    public class FoodRequest
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = String.Empty;
        public string Description { get; set; } = String.Empty;

        public List<ProductPick> ProductPicks { get; set; } = new List<ProductPick>();

        public Guid ProviderId { get; set; }
        public Guid DistributorId { get; set; } = Guid.Empty;

        public string UserId { get; set; } = String.Empty;

        public DeliveryType Delivery { get; set; } = DeliveryType.DistributorNeedsToTakeAway;
        public FoodRequestState State { get; set; } = FoodRequestState.NotAccepted;

        public DateTime EstPickUpTime { get; set; } = DateTime.UtcNow;
        public DateTime CreationTime { get; set; } = DateTime.UtcNow;
    }
}
