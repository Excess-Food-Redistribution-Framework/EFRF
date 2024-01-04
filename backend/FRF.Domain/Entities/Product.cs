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
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        
        public ProductType Type { get; set; } = ProductType.FreshProduce;

        public int Quantity { get; set; } = 0;
        public ProductUnits Units { get; set; } = ProductUnits.Grams;
        public int AvailableQuantity { get; set; } = 0;

        public string ImageUrl { get; set; } = String.Empty;

        public DateTime ExpirationDate { get; set; } = DateTime.UtcNow;
    }
}
