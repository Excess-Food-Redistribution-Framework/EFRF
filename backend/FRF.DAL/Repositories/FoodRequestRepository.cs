using FRF.DAL.Interfaces;
using FRF.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FRF.DAL.Repositories
{
    public class FoodRequestRepository : IBaseRepository<FoodRequest>
    {
        private readonly DatabaseContext _context;

        // Constructor that takes a DatabaseContext as a dependency.
        public FoodRequestRepository(DatabaseContext context)
        {
            _context = context;
        }

        public async Task Add(FoodRequest entity)
        {
            _context.FoodRequests.Add(entity);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(Guid id)
        {
            // Find the product with the given ID, remove it, and save changes.
            var foodDonation = await _context.FoodRequests.FirstOrDefaultAsync(p => p.Id == id);
            if (foodDonation != null)
            {
                _context.FoodRequests.Remove(foodDonation);
                await _context.SaveChangesAsync();
            }
        }

        public IQueryable<FoodRequest> GetAll()
        {
            return _context.FoodRequests;
        }

        public async Task<FoodRequest?> GetById(Guid id)
        {
            return await _context.FoodRequests.FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task Update(FoodRequest entity)
        {
            _context.FoodRequests.Update(entity);
            await _context.SaveChangesAsync();
        }
    }
}
