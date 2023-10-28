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

        // Constructor for the DatabaseContext class.
        public DatabaseContext(DbContextOptions<DatabaseContext> options)
            : base(options)
        {
            // Ensure that the database is created if it doesn't exist.
            //Database.Migrate();
            Database.EnsureCreated();
        }
    }
}
