using System.ComponentModel.DataAnnotations;
using System.Transactions;

namespace backend.Core.Dtos.Transaction
{
    public class TransactionDto
    {
        [Key]
        public int Id { get; set; }
        public int PaymentId { get; set; }
        public DateTime TransactionDate { get; set; }
        public string Status { get; set; }
        
    }
}
