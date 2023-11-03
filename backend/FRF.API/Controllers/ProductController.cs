using FRF.Domain.Entities;
using FRF.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using FRF.Domain.Enum;
using Microsoft.AspNetCore.Identity;
using FRF.Domain.Responses;
using FRF.API.Dto.Product;
using AutoMapper;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FRF.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        // Controller uses services
        private readonly IProductService _productService;
        private readonly IOrganizationService _organizationService;
        private readonly IMapper _mapper;
        private UserManager<User> _userManager;

        // Dependency Injection (DI).
        public ProductController(
            IProductService productService,
            UserManager<User> userManager,
            IOrganizationService organizationService
,
            IMapper mapper)
        {
            _productService = productService;
            _userManager = userManager;
            _organizationService = organizationService;
            _mapper = mapper;
        }


        [HttpGet]
        //[Authorize(Roles = OrganizationType.Distributer.ToString())]
        [SwaggerOperation("Get all products")]
        public async Task<Object> Get(bool unexpired)
        {

            BaseResponse<IEnumerable<Product>> getResponse;
            if (unexpired)
            {
                getResponse = await _productService.GetAllUnexpiredProducts();
            }
            else
            {
                getResponse = await _productService.GetAllProducts();
            }

            if (getResponse.StatusCode != Domain.Enum.StatusCode.Ok)
            {
                return BadRequest(getResponse.Message);
            }

            return Ok(getResponse.Data);
        }

        [HttpPost]
        //[Authorize(Roles = OrganizationType.Provider.ToString())]
        [SwaggerOperation("Add New Product")]
        public async Task<ActionResult<Product>> Post(ProductDto productDto)
        {
            var user = await _userManager.FindByIdAsync(User?.FindFirst("UserId")?.Value);
            var getOrganizationResponse = await _organizationService.GetOrganizationByUser(user.Id);

            if (getOrganizationResponse.StatusCode != Domain.Enum.StatusCode.Ok)
            {
                return BadRequest(getOrganizationResponse.Message);
            }

            var organization = getOrganizationResponse.Data;
            var product = _mapper.Map<Product>(productDto);
            var createProductResponse = await _productService.AddProduct(product, organization);

            if (createProductResponse.StatusCode != Domain.Enum.StatusCode.Ok)
            {
                return BadRequest(createProductResponse.Message);
            }

            return Ok(organization?.Products);
        }
        
        [HttpGet("{id}")]
        [SwaggerOperation("Get Product by Id")]
        [SwaggerResponse(StatusCodes.Status200OK)]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Product>> Get(Guid id)
        {
            var product = (await _productService.GetProductById(id)).Data;

            if (product == null)
            {
                return NotFound();
            }
            
            return Ok(product);
        }
        
        [HttpPut("{id}")]
        //[Authorize(Roles = OrganizationType.Provider.ToString())]
        [SwaggerOperation("Update Product")]
        public async Task<ActionResult<Product>> Put(Guid id, ProductDto productDto)
        {
            var user = await _userManager.FindByIdAsync(User?.FindFirst("UserId")?.Value);
            var getOrganizationResponse = await _organizationService.GetOrganizationByUser(user.Id);
            
            if (getOrganizationResponse.StatusCode != Domain.Enum.StatusCode.Ok)
            {
                return BadRequest(getOrganizationResponse.Message);
            }

            var organization = getOrganizationResponse.Data;
            var product = organization?.Products.Find(p => p.Id == id);
            if (product == null)
            {
                return BadRequest("No such product in your organization");
            }

            product.Name = productDto.Name;
            product.ExpirationDate = productDto.ExpirationDate;
            product.Type = productDto.Type;
            product.Quantity = productDto.Quantity;

            var updateProductResponse = await _productService.UpdateProduct(product);

            if (updateProductResponse.StatusCode != Domain.Enum.StatusCode.Ok)
            {
                return BadRequest(updateProductResponse.Message);
            }

            return Ok(organization.Products);
        }

        [HttpDelete("{id}")]
        //[Authorize(Roles = OrganizationType.Provider.ToString())]
        [SwaggerOperation("Delete Product")]
        public async Task<Object> Delete(Guid id)
        {
            var user = await _userManager.FindByIdAsync(User?.FindFirst("UserId")?.Value);
            var getOrganizationResponse = await _organizationService.GetOrganizationByUser(user.Id);
            
            if (getOrganizationResponse.StatusCode != Domain.Enum.StatusCode.Ok)
            {
                return BadRequest(getOrganizationResponse.Message);
            }

            var organization = getOrganizationResponse.Data;
            if (!organization.Products.Any(p => p.Id == id))
            {
                return BadRequest("No such product in your organization");
            }

            var deleteProductResponse = await _productService.DeleteProduct(id);

            if (deleteProductResponse.StatusCode != Domain.Enum.StatusCode.Ok)
            {
                return BadRequest(deleteProductResponse.Message);
            }

            return Ok(organization.Products);
        }

        [HttpDelete]
        //[Authorize(Roles = OrganizationType.Provider.ToString())]
        [Route("DeleteAllExpiredProducts")]
        [SwaggerOperation("Delete All Expired Products in organization")]
        public async Task<Object> DeleteAllExpiredProducts()
        {
            var user = await _userManager.FindByIdAsync(User?.FindFirst("UserId")?.Value);
            var getOrganizationResponse = await _organizationService.GetOrganizationByUser(user.Id);
            
            if (getOrganizationResponse.StatusCode != Domain.Enum.StatusCode.Ok)
            {
                return BadRequest(getOrganizationResponse.Message);
            }

            var organization = getOrganizationResponse.Data;
            var products = organization?.Products.FindAll(p => p.ExpirationDate < DateTime.UtcNow);
            if (products == null)
            {
                return BadRequest("No such product in your organization");
            }

            foreach (var product in products)
            {
                var deleteProductResponse = await _productService.DeleteProduct(product.Id);

                if (deleteProductResponse.StatusCode != Domain.Enum.StatusCode.Ok)
                {
                    return BadRequest(deleteProductResponse.Message);
                }
            }

            return Ok(organization?.Products);
        }
    }
}
