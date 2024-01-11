using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FRF.Domain.Entities
{
    public class Coin
    {
        public Guid Id { get; set; }
        public int Value { get; set; } = 5;

        public DateTime Date { get; set; } = DateTime.UtcNow;
    }
}
