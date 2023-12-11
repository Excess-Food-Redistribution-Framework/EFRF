using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FRF.Domain.Entities
{
    public class Comment
    {
        public Guid Id { get; set; }
        public User? User { get; set; }
        public int Evaluation { get; set; }
        public string Text { get; set; } = String.Empty;
        public DateTime Created { get; set; } = DateTime.UtcNow;
    }
}
