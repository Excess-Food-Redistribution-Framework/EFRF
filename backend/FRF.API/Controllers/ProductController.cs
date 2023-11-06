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
using System.Net;
using FRF.API.Dto.Organization;

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
        private readonly IFoodRequestService _foodRequestService;
        private readonly IMapper _mapper;
        private UserManager<User> _userManager;

        // Dependency Injection (DI).
        public ProductController(
            IProductService productService,
            UserManager<User> userManager,
            IOrganizationService organizationService
,
            IMapper mapper,
            IFoodRequestService foodRequestService)
        {
            _productService = productService;
            _userManager = userManager;
            _organizationService = organizationService;
            _mapper = mapper;
            _foodRequestService = foodRequestService;
        }

        [HttpGet]
        //[Authorize(Roles = OrganizationType.Distributer.ToString())]
        [SwaggerOperation("Get all products")]
        [SwaggerResponse(StatusCodes.Status200OK)]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<List<ProductDto>>> Get(bool unexpired)
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

            if (getResponse.Data == null)
            {
                return NotFound(getResponse.Message);
            }

            var products = new List<ProductDto>();
            foreach (var product in getResponse.Data)
            {
                products.Add(_mapper.Map<ProductDto>(product));
            }
            return Ok(products);
        }
        

        [HttpGet]
        [Route("GetByOrganization")]
        //[Authorize(Roles = OrganizationType.Distributer.ToString())]
        [SwaggerOperation("Get all products by organization")]
        [SwaggerResponse(StatusCodes.Status200OK)]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<List<ProductDto>>> GetByOrganization(Guid id)
        {
            var getOrganizationResponse = await _organizationService.GetOrganizationById(id);

            var organization = getOrganizationResponse.Data;
            if (organization == null)
            {
                return NotFound(getOrganizationResponse);
            }

            var products = organization.Products;

            var productsDto = new List<ProductDto>();
            foreach (var product in products)
            {
                productsDto.Add(_mapper.Map<ProductDto>(product));
            }
            return Ok(productsDto);
        }


        [HttpGet]
        [Route("GetByFoodRequest")]
        //[Authorize(Roles = OrganizationType.Distributer.ToString())]
        [SwaggerOperation("Get all products by FoodRequest")]
        [SwaggerResponse(StatusCodes.Status200OK)]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<List<ProductDto>>> GetByFoodRequest(Guid id)
        {
            var getFodRequestResponse = await _foodRequestService.GetFoodRequestById(id);

            var foodRequest = getFodRequestResponse.Data;
            if (foodRequest == null)
            {
                return NotFound(getFodRequestResponse);
            }

            var products = foodRequest.Products;

            var productsDto = new List<ProductDto>();
            foreach (var product in products)
            {
                productsDto.Add(_mapper.Map<ProductDto>(product));
            }
            return Ok(productsDto);
        }


        [HttpGet("{id}")]
        [SwaggerOperation("Get Product by Id")]
        [SwaggerResponse(StatusCodes.Status200OK)]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductDtoDetailed>> Get(Guid id)
        {
            var product = (await _productService.GetProductById(id)).Data;

            if (product == null)
            {
                return NotFound();
            }

            var productDto = _mapper.Map<ProductDtoDetailed>(product);
            var organizationResponse = await _organizationService.GetOrganizationByProduct(product.Id);
            if (organizationResponse.Data != null)
            {
                productDto.Organization = _mapper.Map<OrganizationDto>(organizationResponse.Data);
            }
            return Ok(productDto);
        }

        [HttpPost]
        //[Authorize(Roles = OrganizationType.Provider.ToString())]
        [SwaggerOperation("Add New Product")]
        [SwaggerResponse(StatusCodes.Status200OK)]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<List<ProductDto>>> Post(CreateProductDto createProductDto)
        {
            var user = await _userManager.FindByIdAsync(User?.FindFirst("UserId")?.Value);
            var getOrganizationResponse = await _organizationService.GetOrganizationByUser(user.Id);

            if (getOrganizationResponse.Data == null)
            {
                return NotFound(getOrganizationResponse.Message);
            }

            var organization = getOrganizationResponse.Data;

            if (organization.Type != OrganizationType.Provider)
            {
                return BadRequest("Not provider");
            }

            var product = _mapper.Map<Product>(createProductDto);
            var createProductResponse = await _productService.AddProduct(product, organization);

            if (createProductResponse.StatusCode != HttpStatusCode.OK)
            {
                return BadRequest(createProductResponse.Message);
            }

            var products = new List<ProductDto>();
            organization?.Products.ForEach(p => products.Add(_mapper.Map<ProductDto>(p)));
            return Ok(products);
        }
        
        [HttpPut("{id}")]
        //[Authorize(Roles = OrganizationType.Provider.ToString())]
        [SwaggerOperation("Update Product")]
        [SwaggerResponse(StatusCodes.Status200OK)]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<List<ProductDto>>> Put(UpdateProductDto updateProductDto)
        {
            var user = await _userManager.FindByIdAsync(User?.FindFirst("UserId")?.Value);
            var getOrganizationResponse = await _organizationService.GetOrganizationByUser(user.Id);
            
            if (getOrganizationResponse.StatusCode != HttpStatusCode.OK)
            {
                return NotFound(getOrganizationResponse.Message);
            }

            var organization = getOrganizationResponse.Data;



            var product = organization?.Products.Find(p => p.Id == updateProductDto.Id);
            if (product == null)
            {
                return NotFound("No such product in your organization");
            }

            product.Name = updateProductDto.Name;
            product.ExpirationDate = updateProductDto.ExpirationDate;
            product.Type = updateProductDto.Type;
            product.Quantity = updateProductDto.Quantity;

            var updateProductResponse = await _productService.UpdateProduct(product);

            if (updateProductResponse.StatusCode != HttpStatusCode.OK)
            {
                return BadRequest(updateProductResponse.Message);
            }

            var products = new List<ProductDto>();
            organization?.Products.ForEach(p => products.Add(_mapper.Map<ProductDto>(p)));
            return Ok(products);
        }

        [HttpDelete("{id}")]
        //[Authorize(Roles = OrganizationType.Provider.ToString())]
        [SwaggerOperation("Delete Product")]
        [SwaggerResponse(StatusCodes.Status200OK)]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<List<ProductDto>>> Delete(Guid id)
        {
            var user = await _userManager.FindByIdAsync(User?.FindFirst("UserId")?.Value);
            var getOrganizationResponse = await _organizationService.GetOrganizationByUser(user.Id);
            var organization = getOrganizationResponse.Data;

            if (organization == null)
            {
                return NotFound("Organization not found");
            }

            if (!organization.Products.Any(p => p.Id == id))
            {
                return NotFound("No such product in your organization");
            }

            var deleteProductResponse = await _productService.DeleteProduct(id);

            if (deleteProductResponse.StatusCode != HttpStatusCode.OK)
            {
                return BadRequest(deleteProductResponse.Message);
            }

            var products = new List<ProductDto>();
            organization?.Products.ForEach(p => products.Add(_mapper.Map<ProductDto>(p)));
            return Ok(products);
        }

        [HttpDelete]
        //[Authorize(Roles = OrganizationType.Provider.ToString())]
        [Route("DeleteAllExpiredProducts")]
        [SwaggerOperation("Delete All Expired Products in organization")]
        [SwaggerResponse(StatusCodes.Status200OK)]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<List<ProductDto>>> DeleteAllExpiredProducts()
        {
            var user = await _userManager.FindByIdAsync(User?.FindFirst("UserId")?.Value);
            var getOrganizationResponse = await _organizationService.GetOrganizationByUser(user.Id);
            
            if (getOrganizationResponse.StatusCode != HttpStatusCode.OK)
            {
                return NotFound(getOrganizationResponse.Message);
            }

            var organization = getOrganizationResponse.Data;
            var products = organization?.Products.FindAll(p => p.ExpirationDate < DateTime.UtcNow);
            if (products == null)
            {
                return NotFound("No such product in your organization");
            }

            foreach (var product in products)
            {
                var deleteProductResponse = await _productService.DeleteProduct(product.Id);

                if (deleteProductResponse.StatusCode != HttpStatusCode.OK)
                {
                    return BadRequest(deleteProductResponse.Message);
                }
            }

            var productsDto = new List<ProductDto>();
            organization?.Products.ForEach(p => productsDto.Add(_mapper.Map<ProductDto>(p)));
            return Ok(productsDto);
        }
    }
}
