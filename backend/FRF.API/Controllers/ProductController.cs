using FRF.Domain.Entities;
using FRF.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FRF.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        // Controller uses services
        private readonly IProductService _productService;

        // Dependency Injection (DI).
        public ProductController(IProductService productService)
        {
            _productService = productService;
        }


        // GET: api/<ProductController>
        [HttpGet]
        public async Task<IEnumerable<Product>> Get()
        {
            return await _productService.GetAllProducts();
        }

        // GET api/<ProductController>/5
        [HttpGet("{id}")]
        public async Task<Product> Get(Guid id)
        {
            return await _productService.GetProductById(id);
        }

        // POST api/<ProductController>
        [HttpPost]
        public async Task Post([FromBody] Product product)
        {
            await _productService.AddProduct(product);
        }

        // PUT api/<ProductController>/5
        [HttpPut("{id}")]
        public async Task Put(Guid id, [FromBody] Product product)
        {
            product.Id = id;
            await _productService.UpdateProduct(product);
        }

        // DELETE api/<ProductController>/5
        [HttpDelete("{id}")]
        public async Task Delete(Guid id)
        {
            await _productService.DeleteProduct(id);
        }
    }
}
