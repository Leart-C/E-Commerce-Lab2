using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Core.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public List<RefreshToken> RefreshTokens { get; set; } = new();

        [NotMapped]
        public IList<string> Roles { get; set; }
        public List<ProductReview> ProductReviews { get; set; } // Lidhje manuale me MongoDB
        public ICollection<ShippingAddress> ShippingAddresses { get; set; }
        public ICollection<Order> Orders { get; set; }
    }
}
