using FRF.API.Dto.User;
using System.ComponentModel.DataAnnotations;

namespace FRF.API.Dto.Organization
{
    public class ParticipantsDto
    {
        [Display(Name = "CreatorId")]
        public Guid CreatorId { get; set; }

        [Display(Name = "Participants")]
        public List<UserDto> Users { get; set; } = new List<UserDto>();
    }
}
