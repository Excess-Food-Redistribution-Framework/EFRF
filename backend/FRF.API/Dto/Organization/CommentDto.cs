using FRF.API.Dto.User;
using System.ComponentModel.DataAnnotations;

namespace FRF.API.Dto.Organization
{
    public class CommentDto
    {
        [Required]
        [Display(Name = "Id")]
        public Guid Id { get; set; }

        [Required]
        [Display(Name = "User")]
        public UserDto? User { get; set; }

        [Required]
        [Display(Name = "Organization")]
        public OrganizationDto? Organization { get; set; }

        [Display(Name = "Text")]
        public string Text { get; set; } = String.Empty;

        [Required]
        [Display(Name = "Evaluation")]
        public int Evaluation { get; set; }
    }
}
