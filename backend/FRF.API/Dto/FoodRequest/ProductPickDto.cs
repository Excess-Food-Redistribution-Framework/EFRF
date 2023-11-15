using FRF.API.Dto.Organization;
using FRF.API.Dto.Product;

namespace FRF.API.Dto.FoodRequest
{
    public class ProductPickDto
    {
        public Guid Id { get; set; }
        public ProductDto? Product { get; set; }
        public OrganizationDto? Organization { get; set; }
        public int Quantity { get; set; }
    }
}
