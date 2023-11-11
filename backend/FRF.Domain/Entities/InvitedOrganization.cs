using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FRF.Domain.Entities
{
    public class InvitedOrganization
    {
        public Guid Id { get; set; }
        public Organization? Organization { get; set; }
        public DateTime Created { get; set; } = DateTime.UtcNow;
    }
}
