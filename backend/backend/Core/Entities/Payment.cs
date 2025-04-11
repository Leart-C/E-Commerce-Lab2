using System.ComponentModel.DataAnnotations;

namespace backend.Core.Entities
{
    public class Payment
    {
        [Key]
        public int Id { get; set; }
        public int PaymentMethodId { get; set; }
        public int OrderId { get; set; }
        public int Amount { get; set; }
        public DateTime CreatedAt { get; set; }

        //lidhja
        public PaymentMethod PaymentMethod { get; set; }
        public Order Order { get; set; }
    }
}
