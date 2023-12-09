using AutoMapper;
using FRF.API.Dto;
using FRF.API.Dto.Article;
using FRF.Domain.Entities;
using FRF.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using FRF.Domain.Exceptions;
using Newtonsoft.Json;

namespace FRF.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArticleController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IArticleService _articleService;

        public ArticleController(IArticleService articleService, IMapper mapper)
        {
            _articleService = articleService;
            _mapper = mapper;
        }

        [HttpGet]
        [SwaggerOperation("Get Articles")]
        public async Task<ActionResult<Pagination<Article>>> Get(int page = 1, int pageSize = 10)
        {
            var queryable = await _articleService.GetAll();

            return Ok(new Pagination<Article>()
            {
                Page = page,
                PageSize = pageSize,
                Count = queryable.Count(),
                Data = queryable.Skip((page - 1) * pageSize).Take(pageSize).ToList()
            });
        }

        [HttpGet("{id}")]
        [SwaggerOperation("Get Article by Id")]
        public async Task<ActionResult<Article>> Get(Guid id)
        {
            return Ok(await _articleService.GetById(id));
        }
        
        [HttpPost("Import")]
        [SwaggerOperation("Import Articles from JSON file")]
        [SwaggerResponse(200, "Articles successfully uploaded")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadArticlesFromJson([FromForm] FileDto jsonFile)
        {
            try
            {
                using (var streamReader = new StreamReader(jsonFile.File.OpenReadStream()))
                {
                    var jsonContent = await streamReader.ReadToEndAsync();

                    // Deserialize JSON content into a list of CreateUpdateArticleDto
                    var articlesData = JsonConvert.DeserializeObject<List<CreateUpdateArticleDto>>(jsonContent);

                    // Map DTOs to Article entities and add to the database
                    var articleEntities = _mapper.Map<List<Article>>(articlesData);
                    
                    foreach (var article in articleEntities)
                    {
                        await _articleService.Add(article);
                    }
                    
                    streamReader.Close();

                    return Ok("Articles successfully uploaded");
                }
            }
            catch (Exception ex)
            {
                throw new BadRequestApiException(ex.Message);
            }
        }

        // [HttpPost]
        // [SwaggerOperation("Create Article")]
        // [SwaggerResponse(200)]
        // [SwaggerResponse(400, "Invalid request body", typeof(ValidationProblemDetails))]
        // public async Task<ActionResult<Article>> Post([FromBody] CreateUpdateArticleDto articleBody)
        // {
        //     var article = _mapper.Map<Article>(articleBody);
        //     await _articleService.Add(article);
        //     return Ok(article);
        // }
        //
        // [HttpPut("{id}")]
        // [SwaggerOperation("Update Article")]
        // [SwaggerResponse(200)]
        // [SwaggerResponse(400, "Invalid request body", typeof(ValidationProblemDetails))]
        // public async Task<ActionResult<Article>> Put(Guid id, [FromBody] CreateUpdateArticleDto articleBody)
        // {
        //     var article = await _articleService.GetById(id);
        //     _mapper.Map(articleBody, article);
        //     await _articleService.Update(article);
        //     return Ok(article);
        // }
        //
        // [HttpDelete("{id}")]
        // [SwaggerOperation("Delete Article")]
        // public async Task<IActionResult> Delete(Guid id)
        // {
        //     await _articleService.Delete(id);
        //     return Ok();
        // }
    }
    
}
