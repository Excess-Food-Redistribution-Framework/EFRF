using FRF.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FRF.Services.Interfaces
{
    public interface ILocationService
    {
        double GetDistanse(Location location1, Location location2);
    }
}
