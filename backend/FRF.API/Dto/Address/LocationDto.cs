using System.ComponentModel.DataAnnotations;

namespace FRF.API.Dto.Address
{
    public class LocationDto
    {
        [Required]
        [Display(Name = "Longitude")]
        public double Longitude { get; set; }

        [Required]
        [Display(Name = "Latitude")]
        public double Latitude { get; set; }
    }
}
