using FRF.DAL.Interfaces;
using FRF.Domain.Entities;
using FRF.Services.Interfaces;

namespace FRF.Services.Implementations;

public class ArticleService: IArticleService
{
    private readonly IBaseRepository<Article> _articleRepository;
    
    public ArticleService(IBaseRepository<Article> articleRepository)
    {
        _articleRepository = articleRepository;
    }

    public async Task<IQueryable<Article>> GetAll()
    {
        return _articleRepository.GetAll().OrderByDescending(x => x.CreatedAt);
    }

    public async Task<Article> GetById(Guid id)
    {
        var article = await _articleRepository.GetById(id);
        
        if (article is null)
        {
            throw new Exception("Article not found");
        }
        
        return article;
    }

    public async Task Add(Article item)
    {
        await _articleRepository.Add(item);
    }

    public async Task Update(Article item)
    {
        await _articleRepository.Update(item);
    }

    public async Task Delete(Guid id)
    {
        await _articleRepository.Delete(id);
    }
}