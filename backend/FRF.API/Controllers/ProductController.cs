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
using FRF.API.Dto.Address;

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
        private readonly ILocationService _locationService;

        private readonly IMapper _mapper;
        private UserManager<User> _userManager;

        private readonly string _uploadFolderPath = "wwwroot/products";

        private readonly string[] allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
        private readonly int maxFileSizeInBytes = 5 * 1024 * 1024; // 5 MB

        // Dependency Injection (DI).
        public ProductController(
            IProductService productService,
            UserManager<User> userManager,
            IOrganizationService organizationService
,
            IMapper mapper,
            IFoodRequestService foodRequestService,
            ILocationService locationService)
        {
            _productService = productService;
            _userManager = userManager;
            _organizationService = organizationService;
            _mapper = mapper;
            _foodRequestService = foodRequestService;
            _locationService = locationService;
        }

        [HttpGet]
        //[Authorize(Roles = OrganizationType.Distributer.ToString())]
        [SwaggerOperation("Get all products")]
        [SwaggerResponse(StatusCodes.Status200OK)]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<List<ProductDto>>> Get(
            
            [FromQuery] List<Guid>? organizationIds,
            [FromQuery] List<Guid>? foodRequestIds,

            [FromQuery] List<string>? names,
            [FromQuery] List<ProductType>? types,

            [FromQuery] int? minQuantity,
            [FromQuery] int? minRating,
            [FromQuery] DateTime? minExpirationDate,

            [FromQuery] int? maxDistanceKm,
            [FromQuery] LocationDto? location,

            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,

            [FromQuery] bool notExpired = false
            )
        {

            var products = await _productService.GetAllProducts();

            if (notExpired)
            {
                products = products.Where(p => DateTime.UtcNow <= p.ExpirationDate);
            }

            if (minExpirationDate.HasValue)
            {
                products = products.Where(p => p.ExpirationDate >= minExpirationDate.Value);
            }

            if (maxDistanceKm.HasValue && location != null)
            {
                // Implementation of looking for current organization's location:

                //var user = await _userManager.FindByIdAsync(User?.FindFirst("UserId")?.Value);
                //if (user == null)
                //{
                //    throw new NotFoundApiException("User not found");
                //}

                //var organization = await _organizationService.GetOrganizationByUser(user.Id);
                //if (organization == null)
                //{
                //    throw new NotFoundApiException("Organization not found");
                //}
                //if (organization.Location == null)
                //{
                //    throw new BadRequestApiException("Location not found");
                //}

                //organizations = organizations.Where(o => _locationService.GetDistanse(organization.Location, o.Location) <= maxDistanceKm.Value);
                var organizations = await _organizationService.GetAllOrganizations();
                organizations = organizations.Where(o => _locationService.GetDistanse(_mapper.Map<Location>(location), o.Location) <= maxDistanceKm.Value);

                products = products.Where(p => organizations.Any(o => o.Products.Contains(p)));
            }

            if (minQuantity.HasValue)
            {
                products = products.Where(p => p.AvailableQuantity >= minQuantity.Value);
            }

            if (minRating.HasValue)
            {
                var organizations = await _organizationService.GetAllOrganizations();
                organizations = organizations.Where(o => o.AverageEvaulation >= minRating);
                products = products.Where(p => organizations.Any(o => o.Products.Contains(p)));
            }

            if (names?.Count > 0)
            {
                products = products.Where(p => names.Any(n => p.Name.Contains(n)));
            }

            if (types?.Count > 0)
            {
                products = products.Where(p => types.Contains(p.Type));
            }

            if (organizationIds?.Count > 0)
            {
                var organizations = await _organizationService.GetAllOrganizations();
                organizations = organizations.Where(o => organizationIds.Contains(o.Id));
                
                products = products.Where(p => organizations.Any(o => o.Products.Contains(p)));
            }

            if (foodRequestIds?.Count > 0)
            {
                var foodRequests = await _foodRequestService.GetAllFoodRequests();
                foodRequests = foodRequests.Where(f => foodRequestIds.Contains(f.Id));

                products = products.Where(p => foodRequests.Any(f => f.ProductPicks.Any(pp => pp.Product == p)));
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
        public async Task<ActionResult<List<ProductDto>>> Post([FromForm] CreateProductDto createProductDto)
        {
            //CreateProductDto createProductDto = new CreateProductDto();
            var user = await _userManager.FindByIdAsync(User?.FindFirst("UserId")?.Value);
            var organization = await _organizationService.GetOrganizationByUser(user.Id);

            if (organization.Type != OrganizationType.Provider)
            {
                throw new BadRequestApiException("Not provider");
            }

            var product = _mapper.Map<Product>(createProductDto);
            product.AvailableQuantity = createProductDto.Quantity;

            if (createProductDto.Image != null)
            {
                var fileExtension = Path.GetExtension(createProductDto.Image.FileName).ToLowerInvariant();
                if (!allowedExtensions.Contains(fileExtension))
                {
                    throw new BadRequestApiException("Bad image extention");
                }

                if (createProductDto.Image.Length > maxFileSizeInBytes)
                {
                    throw new BadRequestApiException("Image is too large (>5 MB).");
                }

                var fileName = Path.GetExtension(createProductDto.Image.FileName);
                var filePath = Path.Combine(_uploadFolderPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await createProductDto.Image.CopyToAsync(stream);
                }

                product.ImageUrl = Path.Combine(_uploadFolderPath, fileName);
            }

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
        public async Task<ActionResult<ProductDto>> Put([FromForm] UpdateProductDto updateProductDto)
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

            if (updateProductDto.Image != null)
            {
                if (System.IO.File.Exists(product.ImageUrl))
                {
                    System.IO.File.Delete(product.ImageUrl);
                }

                var fileExtension = Path.GetExtension(updateProductDto.Image.FileName).ToLowerInvariant();
                if (!allowedExtensions.Contains(fileExtension))
                {
                    throw new BadRequestApiException("Bad image extention");
                }

                if (updateProductDto.Image.Length > maxFileSizeInBytes)
                {
                    throw new BadRequestApiException("Image is too large (>5 MB).");
                }

                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(updateProductDto.Image.FileName);
                var filePath = Path.Combine(_uploadFolderPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await updateProductDto.Image.CopyToAsync(stream);
                }

                product.ImageUrl = Path.Combine(_uploadFolderPath, fileName);
            }
            
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

            var product = organization?.Products.Find(p => p.Id == id);
            if (product == null)
            {
                throw new NotFoundApiException("No such product in your organization");
            }

            if (product.ImageUrl != String.Empty)
            {
                var filePath = Path.Combine(product.ImageUrl);

                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
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
                if (product.ImageUrl != String.Empty)
                {
                    var filePath = Path.Combine(product.ImageUrl);

                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }
                await _productService.DeleteProduct(product.Id);
            }

            return Ok("Expired products are deleted");
        }
    }
}
