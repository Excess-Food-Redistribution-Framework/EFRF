using FRF.Domain.Entities;

namespace FRF.Services.Interfaces;

public interface IArticleService
{
    Task<IQueryable<Article>> GetAll();
    Task<Article> GetById(Guid id);
    Task Add(Article item);
    Task Update(Article item);
    Task Delete(Guid id);
}