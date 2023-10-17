using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FRF.Domain.Entities
{
    public class Product
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = "";
        public DateTime ExpirationDate { get; set; } = DateTime.Now;
        public int Quantity { get; set; } = 0;
    }
}
