using FRF.Domain.Entities;

namespace FRF.Services.Interfaces;

public interface ITicketService
{
    Task<IQueryable<Ticket>> GetAll();
    Task<Ticket> GetById(Guid id);
    Task Add(Ticket item);
    Task Update(Ticket item);
    Task Delete(Guid id);
}