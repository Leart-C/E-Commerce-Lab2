namespace backend.Core.Dtos.Refund
{
    public class RefundDto
    {
        public int Id { get; set; }
        public int PaymentId { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; }
    }
}
