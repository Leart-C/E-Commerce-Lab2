using System.ComponentModel.DataAnnotations;
using System.Transactions;

namespace backend.Core.Entities
{
    public class Refund
    {
        [Key]
        public int Id { get; set; }
        public int PaymentId { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public Payment Payment { get; set; }
    }
}
