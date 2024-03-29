﻿using FRF.Domain.Enum;
using System.ComponentModel.DataAnnotations;

namespace FRF.API.Dto.Product
{
    public class UpdateProductDto
    {
        [Required]
        [Display(Name = "Id")]
        public Guid Id { get; set; }

        [Required]
        [Display(Name = "Name")]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Display(Name = "Description")]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        [Display(Name = "Type")]
        public ProductType Type { get; set; }

        [Required]
        [Display(Name = "Quantity")]
        public int Quantity { get; set; } = 0;

        [Required]
        [Display(Name = "Units")]
        public ProductUnits Units { get; set; } = ProductUnits.Grams;

        [Required]
        [DataType(DataType.Date)]
        [Display(Name = "ExpirationDate")]
        public DateTime ExpirationDate { get; set; } = DateTime.UtcNow;


        [DataType(DataType.Upload)]
        [Display(Name = "Image")]
        public IFormFile? Image { get; set; }
    }
}
