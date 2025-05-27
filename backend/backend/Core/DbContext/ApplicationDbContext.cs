using backend.Core.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;
using static backend.Core.Entities.ProductReview;

namespace backend.Core.DbContext
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Log> Logs { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<ShippingAddress> ShippingAddresses { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<PaymentMethod> PaymentMethods { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Refund> Refunds { get; set; }
        public DbSet<Invoice> Invoices { get; set; } 
        public DbSet<ChatMessage> ChatMessage { get; set; } // This line


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Override default Identity table names
            builder.Entity<ApplicationUser>().ToTable("User");
            builder.Entity<IdentityUserClaim<string>>().ToTable("UserClaims");
            builder.Entity<IdentityUserLogin<string>>().ToTable("UserLogins");
            builder.Entity<IdentityUserToken<string>>().ToTable("UserTokens");
            builder.Entity<IdentityRole>().ToTable("Roles");
            builder.Entity<IdentityRoleClaim<string>>().ToTable("RoleClaims");
            builder.Entity<IdentityUserRole<string>>().ToTable("UserRoles");
            builder.Entity<PaymentMethod>().ToTable("PaymentMethods", t => t.ExcludeFromMigrations());


            builder.Ignore<ProductReview>();




            //1 PaymentMethod -> N:Payment
            builder.Entity<PaymentMethod>()
                .HasMany(pm => pm.Payments)
                .WithOne(p => p.PaymentMethod)
                .HasForeignKey(p => p.PaymentMethodId);

            //1 Order -> N:Payment
            builder.Entity<Order>()
                    .HasMany(o => o.Payments)
                    .WithOne(p => p.Order)
                    .HasForeignKey(p => p.OrderId);


            builder.Entity<Order>()
            .HasOne(o => o.ShippingAddress)
            .WithOne(sa => sa.Order)
            .HasForeignKey<Order>(o => o.ShippingAddressId)
            .OnDelete(DeleteBehavior.Restrict); // Change from Cascade to Restrict

            // 1 User → shumë Orders
            builder.Entity<ApplicationUser>()
                .HasMany(u => u.Orders)
                .WithOne(o => o.User)
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // 1 User → shumë ShippingAddresses
            builder.Entity<ApplicationUser>()
                .HasMany(u => u.ShippingAddresses)
                .WithOne(sa => sa.User)
                .HasForeignKey(sa => sa.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            #region Chat Messages delete logic
            builder.Entity<ChatMessage>()
                .HasOne(cm => cm.Sender)
                .WithMany()
                .HasForeignKey(cm => cm.SenderId)
                .OnDelete(DeleteBehavior.NoAction);
            builder.Entity<ChatMessage>()
                .HasOne(cm => cm.Receiver)
                .WithMany()
                .HasForeignKey(cm => cm.ReceiverId)
                .OnDelete(DeleteBehavior.Cascade);
            #endregion

            {
                builder.Entity<Order>()
                    .Property(o => o.TotalPrice)
                    .HasPrecision(18, 2);
            }

        }

    }
}
