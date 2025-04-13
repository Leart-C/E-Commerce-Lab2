namespace backend.Core.Dtos.OrderItem
{
    public class OrderItemDto
    {
            public int OrderId { get; set; } // MSSQL
        public string ProductId { get; set; } // MongoDB
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}
