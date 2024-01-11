using FRF.API.Dto.Address;
using FRF.API.Dto.User;
using FRF.Domain.Enum;
using System.ComponentModel.DataAnnotations;

namespace FRF.API.Dto.Organization
{
    public class OrganizationDto
    {
        [Required]
        [Display(Name = "Id")]
        public Guid Id { get; set; }

        [Required]
        [Display(Name = "Name")]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Display(Name = "Type")]
        public OrganizationType Type { get; set; }

        [Display(Name = "Information")]
        public string Information { get; set; } = string.Empty;

        [Required]
        [Display(Name = "Users")]
        public List<UserDto> Users { get; set; } = new List<UserDto>();

        [Required]
        [Display(Name = "Comments")]
        public List<CommentDto> Comments { get; set; } = new List<CommentDto>();


        [Display(Name = "Address")]
        public AddressDto? Address { get; set; }

        [Display(Name = "Location")]
        public LocationDto? Location { get; set; }

        [Display(Name = "Coins")]
        public int CoinsSum { get; set; }

        [Display(Name = "AverageEvaulation")]
        public double? AverageEvaulation { get; set; } = 0;
    }
}
