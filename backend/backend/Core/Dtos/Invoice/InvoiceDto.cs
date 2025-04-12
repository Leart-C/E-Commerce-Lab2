namespace backend.Core.Dtos.Invoice
{
    public class InvoiceDto
    {
        public int Id { get; set; }
        public int PaymentId { get; set; }
        public decimal Amount { get; set; }
        public DateTime IssueDate { get; set; }
        public string Status { get; set; }
    }
}
