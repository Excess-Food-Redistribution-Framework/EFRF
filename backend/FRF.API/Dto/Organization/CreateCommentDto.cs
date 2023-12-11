using System.ComponentModel.DataAnnotations;

namespace FRF.API.Dto.Organization
{
    public class CreateCommentDto
    {
        [Required]
        [Display(Name = "OrganizationId")]
        public Guid OrganizationId { get; set; }

        [Display(Name = "Text")]
        public string Text { get; set; } = String.Empty;

        [Required]
        [Display(Name = "Evaluation")]
        public int Evaluation { get; set; }
    }
}
