namespace FRF.API.Dto.FoodRequest
{
    public class CreateProductPickDto
    {
        public Guid ProductId { get; set; }
        public Guid FoodRequestId { get; set; }
        public int Quantity { get; set; }
    }
}
