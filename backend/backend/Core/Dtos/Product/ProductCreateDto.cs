namespace backend.Core.Dtos.Product
{
    public class ProductCreateDto
    {
        public string ProductName { get; set; }
        public string Description { get; set; }
        public double Price { get; set; }
        public string CategoryId { get; set; }

        public string? ImageUrl { get; set; }


    }
}
