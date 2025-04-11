using System.ComponentModel.DataAnnotations;

namespace backend.Core.Entities
{
    public class PaymentMethod
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }

        //nav
        public ICollection<Payment> Payments { get; set; }
    }
}
