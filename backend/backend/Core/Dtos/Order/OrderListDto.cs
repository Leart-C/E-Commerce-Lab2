namespace backend.Core.Dtos.Order
{
    public class OrderListDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public int ShippingAddressId { get; set; }
        public string Status { get; set; }
        public decimal TotalPrice { get; set; }
    }
}
