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
    public class FoodDonationRepository : IBaseRepository<FoodDonation>
    {
        private readonly DatabaseContext _context;

        // Constructor that takes a DatabaseContext as a dependency.
        public FoodDonationRepository(DatabaseContext context)
        {
            _context = context;
        }

        public async Task Add(FoodDonation entity)
        {
            _context.FoodDonations.Add(entity);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(Guid id)
        {
            // Find the product with the given ID, remove it, and save changes.
            var foodDonation = await _context.FoodDonations.FirstOrDefaultAsync(p => p.Id == id);
            if (foodDonation != null)
            {
                _context.FoodDonations.Remove(foodDonation);
                await _context.SaveChangesAsync();
            }
        }

        public IQueryable<FoodDonation> GetAll()
        {
            return _context.FoodDonations;
        }

        public async Task<FoodDonation?> GetById(Guid id)
        {
            return await _context.FoodDonations.FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task Update(FoodDonation entity)
        {
            _context.FoodDonations.Update(entity);
            await _context.SaveChangesAsync();
        }
    }
}
