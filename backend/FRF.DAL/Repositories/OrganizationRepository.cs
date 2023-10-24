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
    public class OrganizationRepository : IBaseRepository<Organization>
    {
        private readonly DatabaseContext _context;

        // Constructor that takes a DatabaseContext as a dependency.
        public OrganizationRepository(DatabaseContext context)
        {
            _context = context;
        }

        public async Task Add(Organization entity)
        {
            _context.Organizations.Add(entity);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(Guid id)
        {
            // Find the product with the given ID, remove it, and save changes.
            var organization = await _context.Organizations.FirstOrDefaultAsync(p => p.Id == id);
            if (organization != null)
            {
                _context.Organizations.Remove(organization);
                await _context.SaveChangesAsync();
            }
        }

        public IQueryable<Organization> GetAll()
        {
            return _context.Organizations;
        }

        public async Task<Organization?> GetById(Guid id)
        {
            return await _context.Organizations.FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task Update(Organization entity)
        {
            _context.Organizations.Update(entity);
            await _context.SaveChangesAsync();
        }
    }
}
