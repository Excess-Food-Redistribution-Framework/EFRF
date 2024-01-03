using FRF.Domain.Entities;

namespace FRF.DAL.Repositories
{
    public class TicketRepository : BaseRepository<Ticket>
    {
        public TicketRepository(DatabaseContext context) : base(context)
        {
        }
    }
}