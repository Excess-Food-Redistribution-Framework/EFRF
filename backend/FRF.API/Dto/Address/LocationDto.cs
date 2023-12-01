using System.ComponentModel.DataAnnotations;

namespace FRF.API.Dto.Address
{
    public class LocationDto
    {
        [Display(Name = "Longitude")]
        public double Longitude { get; set; }

        [Display(Name = "Latitude")]
        public double Latitude { get; set; }
    }
}
