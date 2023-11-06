using FRF.Domain.Enum;
using System.ComponentModel.DataAnnotations;

namespace FRF.API.Dto.FoodRequest
{
    public class ChangeStateDto
    {
        [Required]
        [Display(Name = "FoodRequestId")]
        public Guid Id { get; set; }

        [Required]
        [Display(Name = "FoodRequestState")]
        public FoodRequestState State { get; set; }
    }
}
