using FRF.DAL.Interfaces;
using FRF.Domain.Entities;
using FRF.Services.Interfaces;

namespace FRF.Services.Implementations;

public class TicketService: ITicketService
{
    private readonly IBaseRepository<Ticket> _ticketRepository;
    
    public TicketService(IBaseRepository<Ticket>ticketRepository)
    {
        _ticketRepository = ticketRepository;
    }

    public async Task Add(Ticket item)
    {
        await _ticketRepository.Add(item);
    }
    
    public async Task Delete(Guid id)
    {
        await _ticketRepository.Delete(id);
    }
    
    public async Task<IQueryable<Ticket>> GetAll()
    {
        return _ticketRepository.GetAll();
    }
    
    public async Task<Ticket> GetById(Guid id)
    {
        return await _ticketRepository.GetById(id);
    }
    
    public async Task Update(Ticket item)
    {
        await _ticketRepository.Update(item);
    }
}