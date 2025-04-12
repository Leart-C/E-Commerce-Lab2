using System.ComponentModel.DataAnnotations;
using System.Transactions;

namespace backend.Core.Entities
{
    public class Transaction
    {
        [Key]
        public int Id { get; set; }
        public int PaymentId { get; set; }
        public DateTime TransactionDate { get; set; }
        public string Status { get; set; }
        public Payment Payment { get; set; }
    }
}
