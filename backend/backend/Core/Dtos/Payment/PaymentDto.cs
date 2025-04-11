namespace backend.Core.Dtos.Payment
{
    public class PaymentDto
    {
        public int PaymentMethodId { get; set; }
        public int OrderId { get; set; }
        public int Amount { get; set; }
    }
}
