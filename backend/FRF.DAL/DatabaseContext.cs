﻿using FRF.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FRF.DAL
{
    // Define a class named DatabaseContext that inherits from DbContext.
    public class DatabaseContext : DbContext
    {
        // DbSet represents a table in the database for entities:
        public DbSet<Product> Products { get; set; }
        // ......OTHER ENTITIES......

        // Constructor for the DatabaseContext class.
        public DatabaseContext(DbContextOptions<DatabaseContext> options)
            : base(options)
        {
            // Ensure that the database is created if it doesn't exist.
            Database.EnsureCreated();
        }
    }
}
