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
        public async Task<ActionResult<List<ProductDto>>> Get(ProductFilter productFilter)
        {

            var getResponse = await _productService.GetAllProducts();
            var products = getResponse.Data;
            if (products == null)
            {
                return NotFound(getResponse.Message);
            }

            if (productFilter.NotExpired)
            {
                products = products.Where(p => p.ExpirationDate >= DateTime.UtcNow);
            }

            if (productFilter.NotBlocked)
            {
                products = products.Where(p => p.State == ProductState.Available);
            }

            if (productFilter.OrganizationId != Guid.Empty)
            {
                var getOrganizationResponse = await _organizationService.GetOrganizationById(productFilter.OrganizationId);

                var organization = getOrganizationResponse.Data;
                if (organization == null)
                {
                    return NotFound(getOrganizationResponse);
                }
                products = products.Where(p => organization.Products.Contains(p));
            }

            if (productFilter.FoodRequestId != Guid.Empty)
            {
                var getFoodRequestResponse = await _foodRequestService.GetFoodRequestById(productFilter.FoodRequestId);

                var foodRequest = getFoodRequestResponse.Data;
                if (foodRequest == null)
                {
                    return NotFound(getFoodRequestResponse);
                }
                products = products.Where(p => foodRequest.Products.Contains(p));
            }

            var productsDto = new List<ProductDto>();
            foreach (var product in products)
            {
                var productDto = _mapper.Map<ProductDto>(product);
                if (product != null)
                {
                    productDto.Organization = _mapper.Map<OrganizationDto>(product);
                }
                productsDto.Add(productDto);
            }
            return Ok(productsDto);
        }


        [HttpGet("{id}")]
        [SwaggerOperation("Get Product by Id")]
        [SwaggerResponse(StatusCodes.Status200OK)]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductDto>> Get(Guid id)
        {
            var product = (await _productService.GetProductById(id)).Data;

            if (product == null)
            {
                return NotFound();
            }

            var productDto = _mapper.Map<ProductDto>(product);
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


            var productDto = _mapper.Map<ProductDto>(product);
            productDto.Organization = _mapper.Map<OrganizationDto>(organization);
            return Ok(productDto);
        }
        
        [HttpPut("{id}")]
        //[Authorize(Roles = OrganizationType.Provider.ToString())]
        [SwaggerOperation("Update Product")]
        [SwaggerResponse(StatusCodes.Status200OK)]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductDto>> Put(UpdateProductDto updateProductDto)
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

            var productDto = _mapper.Map<ProductDto>(product);
            productDto.Organization = _mapper.Map<OrganizationDto>(organization);
            return Ok(productDto);
        }

        [HttpDelete("{id}")]
        //[Authorize(Roles = OrganizationType.Provider.ToString())]
        [SwaggerOperation("Delete Product")]
        [SwaggerResponse(StatusCodes.Status200OK)]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<bool>> Delete(Guid id)
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

            return Ok("Product deleted");
        }

        [HttpDelete]
        //[Authorize(Roles = OrganizationType.Provider.ToString())]
        [Route("DeleteAllExpiredProducts")]
        [SwaggerOperation("Delete All Expired Products in organization")]
        [SwaggerResponse(StatusCodes.Status200OK)]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<bool>> DeleteAllExpiredProducts()
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

            return Ok("Expired products are deleted");
        }
    }
}
