using System.ComponentModel.DataAnnotations;

namespace FRF.API.Dto.Organization
{
    public class UpdateCommentDto
    {
        [Display(Name = "Text")]
        public string Text { get; set; } = String.Empty;

        [Display(Name = "Evaluation")]
        public int Evaluation { get; set; } = -1;
    }
}
