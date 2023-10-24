using FRF.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
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
