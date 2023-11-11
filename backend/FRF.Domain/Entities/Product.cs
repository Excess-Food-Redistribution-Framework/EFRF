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
        public string Name { get; set; } = String.Empty;
        string Description { get; set; } = String.Empty;

        // IN FUTURE?: Change product type to the database Entity instead of Enum
        public ProductType Type { get; set; }
        public ProductState State { get; set; }

        public int Quantity { get; set; } = 0;
        public DateTime ExpirationDate { get; set; } = DateTime.UtcNow;
    }
}
