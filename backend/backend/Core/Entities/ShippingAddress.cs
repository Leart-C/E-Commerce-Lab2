using System.ComponentModel.DataAnnotations;

namespace backend.Core.Entities
{
    public class ShippingAddress
    {
        [Key]
        public int Id { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string PostalCode { get; set; }
        public string Country { get; set; }

        public string UserId { get; set; }
        public ApplicationUser User { get; set; }

        public Order Order { get; set; }
    }
}
