using FRF.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace FRF.DAL
{
    // Define a class named DatabaseContext that inherits from DbContext.
    public class DatabaseContext : IdentityDbContext<User>
    {
        // DbSet represents a table in the database for entities:
        public DbSet<Product> Products { get; set; }
        public DbSet<Organization> Organizations { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<FoodRequest> FoodRequests { get; set; }
        public DbSet<Article> Articles { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<AllowedEmail> AllowedEmails { get; set; }
        public DbSet<InvitedOrganization> InvitedOrganizations { get; set; }
        public DbSet<ProductPick> ProductPick { get; set; }
        public DbSet<Comment> Comments { get; set; }


        // Constructor for the DatabaseContext class.
        public DatabaseContext(DbContextOptions<DatabaseContext> options)
            : base(options)
        {
            // Ensure that the database is created if it doesn't exist.
            //Database.Migrate();
            Database.EnsureCreated();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            AddTimestamps();
            return base.SaveChangesAsync(cancellationToken);
        }

        private void AddTimestamps()
        {
            var entities = ChangeTracker.Entries()
                .Where(x => x is { Entity: BaseEntity, State: EntityState.Added or EntityState.Modified });

            foreach (var entity in entities)
            {
                var now = DateTime.UtcNow; // current datetime

                if (entity.State == EntityState.Added)
                {
                    ((BaseEntity)entity.Entity).CreatedAt = now;
                }
                ((BaseEntity)entity.Entity).UpdatedAt = now;
            }
        }
    }
}
