using System.ComponentModel.DataAnnotations;

namespace backend.Core.Entities
{
    public class Invoice
    {
        [Key]
        public int Id { get; set; }
        public int PaymentId { get; set; }  // Foreign key to Payment
        public decimal Amount { get; set; }
        public DateTime IssueDate { get; set; }
        public string Status { get; set; }
        public Payment Payment { get; set; } // Navigation property
    }

}
