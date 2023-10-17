using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FRF.DAL.Interfaces
{
    // Define a generic interface IBaseRepository for data access operations.
    // Use it for all new repos like: public class EntityRepository : IBaseRepository<Entity>
    public interface IBaseRepository<T>
    {
        Task Add(T entity);
        IQueryable<T> GetAll();
        Task<T?> GetById(Guid id);
        Task Update(T entity);
        Task Delete(Guid id);
    }
}
