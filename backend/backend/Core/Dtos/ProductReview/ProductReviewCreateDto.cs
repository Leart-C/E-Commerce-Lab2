namespace backend.Core.Dtos.ProductReview
{
    public class ProductReviewCreateDto
    {
        public string ProductId { get; set; }
        public string ReviewText { get; set; }
        public int Rating { get; set; }
    }
}
