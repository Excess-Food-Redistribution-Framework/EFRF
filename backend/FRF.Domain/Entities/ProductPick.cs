using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FRF.Domain.Entities
{
    public class ProductPick
    {
        public Guid Id { get; set; }
        public Product Product { get; set; } = new Product();
        public Organization? Organization { get; set; }
        public int Quantity { get; set; }
    }
}
