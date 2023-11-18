using System.ComponentModel.DataAnnotations;
using FRF.API.Dto.Organization;

namespace FRF.API.Dto.User
{
    public class UserWithOrganizationDto : UserDto
    {
        public OrganizationDto? Organization { get; set; }
    }
}
