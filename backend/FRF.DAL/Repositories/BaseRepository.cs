using FRF.DAL.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FRF.DAL.Repositories;

public abstract class BaseRepository<T> : IBaseRepository<T> where T : class
{
    private readonly DatabaseContext _context;
    private readonly DbSet<T> _entities;

    protected BaseRepository(DatabaseContext context)
    {
        _context = context;
        _entities = context.Set<T>();
    }

    public async Task Add(T entity)
    {
        await _entities.AddAsync(entity);
        await _context.SaveChangesAsync();
    }

    public IQueryable<T> GetAll()
    {
        return _entities.AsQueryable();
    }

    public async Task<T?> GetById(Guid id)
    {
        return await _entities.FirstOrDefaultAsync(t => 
            EF.Property<Guid>(t, "Id") == id);
    }

    public async Task Update(T entity)
    {
        _entities.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task Delete(Guid id)
    {
        var entity = await GetById(id);
        if (entity != null)
        {
            _entities.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}