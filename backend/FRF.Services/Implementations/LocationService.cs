using FRF.Domain.Entities;
using FRF.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FRF.Services.Implementations
{
    public class LocationService : ILocationService
    {
        public double GetDistanse(Location location1, Location location2)
        {
            const double EarthRadius = 6371;

            double lat1 = ToRadians(location1.Latitude);
            double lon1 = ToRadians(location1.Longitude);
            double lat2 = ToRadians(location2.Latitude);
            double lon2 = ToRadians(location2.Longitude);

            double dLat = lat2 - lat1;
            double dLon = lon2 - lon1;

            double a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                       Math.Cos(lat1) * Math.Cos(lat2) *
                       Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
            double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

            double distance = EarthRadius * c;

            return distance;
        }

        private double ToRadians(double degree)
        {
            return degree * (Math.PI / 180);
        }
    }
}
