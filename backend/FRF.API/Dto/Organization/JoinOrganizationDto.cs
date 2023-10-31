using System.ComponentModel.DataAnnotations;

namespace FRF.API.Dto.Organization
{
    public class JoinOrganizationDto
    {
        [Required]
        [Display(Name = "Title")]
        public Guid OrganizationId { get; set; }

        //[Required]
        //[DataType(DataType.Password)]
        //[Display(Name = "Password")]
        //public string? Password { get; set; }
    }
}
