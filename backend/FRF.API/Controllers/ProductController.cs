using FRF.Domain.Entities;
using FRF.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using FRF.Domain.Enum;
using Microsoft.AspNetCore.Identity;
using FRF.API.Dto.Product;
using AutoMapper;
using System.Net;
using FRF.API.Dto.Organization;
using FRF.API.Dto;
using FRF.Domain.Exceptions;

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
        public async Task<ActionResult<List<ProductDto>>> Get(int page, int pageSize, bool notExpired = false, bool notBlocked = true, Guid organizationId = new Guid(), Guid foodRequestId = new Guid())
        {

            var products = await _productService.GetAllProducts();

            if (notExpired)
            {
                products = products.Where(p => p.ExpirationDate >= DateTime.UtcNow);
            }

            if (notBlocked)
            {
                products = products.Where(p => p.State == ProductState.Available);
            }

            if (organizationId != Guid.Empty)
            {
                var organization = await _organizationService.GetOrganizationById(organizationId);
                products = products.Where(p => organization.Products.Contains(p));
            }

            if (foodRequestId != Guid.Empty)
            {
                var foodRequest = await _foodRequestService.GetFoodRequestById(foodRequestId);
                products = products.Where(p => foodRequest.Products.Contains(p));
            }

            var productsDto = new List<ProductDto>();
            foreach (var product in products)
            {
                var productDto = _mapper.Map<ProductDto>(product);
                if (product != null)
                {
                    var organization2 = await _organizationService.GetOrganizationByProduct(product.Id);
                    productDto.Organization = _mapper.Map<OrganizationDto>(organization2);
                }
                productsDto.Add(productDto);
            }
            var pagination = new Pagination<ProductDto>()
            {
                Page = page,
                PageSize = pageSize,
                Count = products.Count(),
                Data = productsDto.Skip((page - 1) * pageSize).Take(pageSize).ToList()
            };

            if (pagination.Data == null)
            {
                throw new BadRequestApiException("No content on this page");
            }

            return Ok(pagination);
        }


        [HttpGet("{id}")]
        [SwaggerOperation("Get Product by Id")]
        [SwaggerResponse(StatusCodes.Status200OK)]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductDto>> Get(Guid id)
        {
            var product = await _productService.GetProductById(id);

            var productDto = _mapper.Map<ProductDto>(product);
            var organization = await _organizationService.GetOrganizationByProduct(product.Id);
            
            productDto.Organization = _mapper.Map<OrganizationDto>(organization);
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
            var organization = await _organizationService.GetOrganizationByUser(user.Id);

            if (organization.Type != OrganizationType.Provider)
            {
                throw new BadRequestApiException("Not provider");
            }

            var product = _mapper.Map<Product>(createProductDto);
            await _productService.AddProduct(product, organization);

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
            var organization = await _organizationService.GetOrganizationByUser(user.Id);

            var product = organization?.Products.Find(p => p.Id == updateProductDto.Id);
            if (product == null)
            {
                throw new NotFoundApiException("No such product in your organization");
            }

            product.Name = updateProductDto.Name;
            product.ExpirationDate = updateProductDto.ExpirationDate;
            product.Type = updateProductDto.Type;
            product.Quantity = updateProductDto.Quantity;

            await _productService.UpdateProduct(product);

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
            var organization = await _organizationService.GetOrganizationByUser(user.Id);

            if (!organization.Products.Any(p => p.Id == id))
            {
                throw new NotFoundApiException("No such product in your organization");
            }

            await _productService.DeleteProduct(id);

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
            var organization = await _organizationService.GetOrganizationByUser(user.Id);

            var products = organization?.Products.FindAll(p => p.ExpirationDate < DateTime.UtcNow);
            if (products == null)
            {
                throw new NotFoundApiException("No such product in your organization");
            }

            foreach (var product in products)
            {
                await _productService.DeleteProduct(product.Id);
            }

            return Ok("Expired products are deleted");
        }
    }
}
