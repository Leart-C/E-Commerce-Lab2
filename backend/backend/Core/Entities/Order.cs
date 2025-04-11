using backend.Core.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Order
{
    [Key]
    public int Id { get; set; }
    public int ShippingAddressId { get; set; }
    public ShippingAddress ShippingAddress { get; set; }

    public string UserId { get; set; }
    public ApplicationUser User { get; set; }

    public string Status { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalPrice { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool OrderStatus { get; set; }

    public ICollection<Payment> Payments { get; set; }


}
