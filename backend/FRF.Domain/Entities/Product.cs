using FRF.Domain.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FRF.Domain.Entities
{
    public class Product
    {
        public Guid Id { get; set; }
        public ProductType Type { get; set; }
        public DateTime ExpirationDate { get; set; } = DateTime.Now;
        public int Quantity { get; set; } = 0;
        [ForeignKey("FoodDonationId")]
        public Guid? FoodDonationId { get; set; }
    }
}
