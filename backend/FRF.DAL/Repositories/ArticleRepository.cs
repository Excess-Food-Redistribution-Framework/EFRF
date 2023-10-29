using FRF.Domain.Entities;

namespace FRF.DAL.Repositories
{
    public class ArticleRepository : BaseRepository<Article>
    {
        public ArticleRepository(DatabaseContext context) : base(context)
        {
        }
    }
}