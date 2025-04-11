namespace backend.Core.Dtos.Order
{
    public class OrderDto
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public int ShippingAddressId { get; set; }
        public string Status { get; set; }
        public decimal TotalPrice { get; set; }
       
    }
}
