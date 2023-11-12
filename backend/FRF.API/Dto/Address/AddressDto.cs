using System.ComponentModel.DataAnnotations;

namespace FRF.API.Dto.Address
{
    public class AddressDto
    {
        [Required]
        [Display(Name = "State")]
        public string State { get; set; } = String.Empty;

        [Required]
        [Display(Name = "City")]
        public string City { get; set; } = String.Empty;

        [Required]
        [Display(Name = "Street")]
        public string Street { get; set; } = String.Empty;

        [Required]
        [Display(Name = "Street")]
        public string Number { get; set; } = String.Empty;


        [Required]
        [Display(Name = "ZipCode")]
        public string ZipCode { get; set; } = String.Empty;
    }
}
