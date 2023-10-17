using FRF.DAL.Interfaces;
using FRF.Domain;
using FRF.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FRF.DAL.Repositories
{
    public class ProductRepository : IBaseRepository<Product>
    {
        private readonly DatabaseContext _context;

        // Constructor that takes a DatabaseContext as a dependency.
        public ProductRepository(DatabaseContext context)
        {
            _context = context;
        }

        public async Task Add(Product entity)
        {
            _context.Products.Add(entity);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(Guid id)
        {
            // Find the product with the given ID, remove it, and save changes.
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
            if (product != null)
            {
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
            }
        }

        public IQueryable<Product> GetAll()
        {
            return _context.Products;
        }

        public async Task<Product?> GetById(Guid id)
        {
            return await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task Update(Product entity)
        {
            _context.Products.Update(entity);
            await _context.SaveChangesAsync();
        }
    }
}
