using FRF.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FRF.Domain.Entities
{
    public class Organization
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = String.Empty;
        public OrganizationType Type { get; set; }

        // (PLACEHOLDER) Instead of Information field add other specific fields (f.e. email/address/certification/....)
        public string Information { get; set; } = String.Empty;

        public List<FoodRequest> FoodRequests { get; set; } = new List<FoodRequest>();
        public List<Product> Products { get; set; } = new List<Product>();

        public Guid CreatorId { get; set; }
        public List<User> Users { get; set; } = new List<User>();

        public string Password { get; set; } = String.Empty;
    }
}
