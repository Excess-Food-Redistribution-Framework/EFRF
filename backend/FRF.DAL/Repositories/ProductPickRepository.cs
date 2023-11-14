using FRF.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FRF.DAL.Repositories
{
    public class ProductPickRepository : BaseRepository<ProductPick>
    {
        public ProductPickRepository(DatabaseContext context) : base(context)
        {
        }
    }
}
