
using AutoMapper;
using FRF.API.Dto;
using FRF.DAL.Interfaces;
using FRF.Domain.Entities;
using FRF.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace FRF.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArticleController : ControllerBase
    {
        // private readonly ArticleService _articleService;
        private readonly IMapper _mapper;
        private readonly IBaseRepository<Article> _articleRepository;
        private readonly IArticleService _articleService;
        
        public ArticleController(IArticleService articleService, IMapper mapper, IBaseRepository<Article> articleRepository)
        {
            _articleService = articleService;
            _mapper = mapper;
            _articleRepository = articleRepository;
        }
        
        [HttpGet]
        [SwaggerOperation("Get Articles")]
        public async Task<ActionResult<IEnumerable<Article>>> Get()
        {
            return Ok(await _articleService.GetAll());
        }
        
        
        [HttpGet("{id}")]
        [SwaggerOperation("Get Article by Id")]
        public async Task<ActionResult<Article>> Get(Guid id)
        {
            return Ok(await _articleService.GetById(id));
        }
        
        
        [HttpPost]
        [SwaggerOperation("Create Article")]
        public async Task<ActionResult<Article>> Post([FromBody] CreateUpdateArticleDto articleBody)
        {
            var article = _mapper.Map<Article>(articleBody);
            await _articleService.Add(article);
            return Ok(article);
        }
        
        [HttpPatch("{id}")]
        [SwaggerOperation("Update Article")]
        public async Task<ActionResult<Article>> Patch(Guid id, [FromBody] CreateUpdateArticleDto articleBody)
        {
            var article = await _articleService.GetById(id);
            _mapper.Map(articleBody, article);
            await _articleService.Update(article);
            return Ok(article);
        }

        [HttpDelete("{id}")]
        [SwaggerOperation("Delete Article")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _articleService.Delete(id);
            return Ok();
        }
    }
}
