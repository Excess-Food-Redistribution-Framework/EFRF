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

        public List<Product> Products { get; set; } = new List<Product>();

        public Guid ProviderId { get; set; }
        public Guid DistributerId { get; set; }

        public DeliveryType Delivery { get; set; } = DeliveryType.WaitForTakeDonate;
        public FoodRequestState State { get; set; } = FoodRequestState.Waiting;

        public DateTime CreationTime { get; set; } = DateTime.UtcNow;
    }
}
