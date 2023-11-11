using AutoMapper;
using FRF.API.Dto.FoodRequest;
using FRF.API.Dto.Organization;
using FRF.Domain.Entities;
using FRF.Domain.Enum;
using FRF.Domain.Exceptions;
using FRF.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;

namespace FRF.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoodRequestController : ControllerBase
    {
        // Controller uses services
        private readonly IFoodRequestService _foodRequestService;
        private readonly IOrganizationService _organizationService;
        private readonly IProductService _productService;
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;

        // Dependency Injection (DI).
        public FoodRequestController(
            IFoodRequestService foodRequestService,
            UserManager<User> userManager,
            IOrganizationService organizationService,
            IMapper mapper,
            IProductService productService
            )
        {
            _foodRequestService = foodRequestService;
            _userManager = userManager;
            _organizationService = organizationService;
            _mapper = mapper;
            _productService = productService;
        }

        [HttpPost]
        [Route("ChangeState")]
        [Authorize]
        [SwaggerOperation("ChangeState of foodRequest")]
        [SwaggerResponse(StatusCodes.Status200OK, "FoodRequest state is changed")]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<Object> ChangeState(ChangeStateDto changeStateDto)
        {
            var user = await _userManager.FindByIdAsync(User?.FindFirst("UserId")?.Value);
            if (user.Id == null)
            {
                return NotFound("User not found");
            }

            var organization = await _organizationService.GetOrganizationByUser(user.Id);

            var foodRequest = await _foodRequestService.GetFoodRequestById(changeStateDto.Id);

            await _foodRequestService.ChangeStateFoodRequest(changeStateDto.State, foodRequest, organization);

            var foodRequestDto = _mapper.Map<FoodRequestDto>(foodRequest);

            return Ok(foodRequestDto);
        }


        [HttpGet]
        [Authorize]
        [SwaggerOperation("Get foodRequest")]
        [SwaggerResponse(StatusCodes.Status200OK, "FoodRequest getted")]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<Object> Get()
        {
            var foodRequests = await _foodRequestService.GetAllFoodRequests();

            var foodRequestsDto = _mapper.Map<List<FoodRequestDto>>(foodRequests);

            return Ok(foodRequestsDto);
        }

        [HttpGet]
        [Route("GetByOrganization")]
        [Authorize]
        [SwaggerOperation("Get foodRequest by organization")]
        [SwaggerResponse(StatusCodes.Status200OK, "FoodRequest getted")]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<Object> GetByOrganization(Guid id)
        {
            var organization = await _organizationService.GetOrganizationById(id);

            var foodRequests = await _foodRequestService.GetAllFoodRequestsByOrganization(organization.Id);

            var foodRequestsDto = _mapper.Map<List<FoodRequestDto>>(foodRequests);

            return Ok(foodRequestsDto);
        }

        [HttpGet]
        [Route("GetByCurrentOrganization")]
        [Authorize]
        [SwaggerOperation("Get foodRequest by current organization")]
        [SwaggerResponse(StatusCodes.Status200OK, "FoodRequest getted")]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<Object> GetByCurrentOrganization()
        {
            var user = await _userManager.FindByIdAsync(User?.FindFirst("UserId")?.Value);
            if (user.Id == null)
            {
                return NotFound("User not found");
            }

            var organization = await _organizationService.GetOrganizationByUser(user.Id);

            var foodRequests = await _foodRequestService.GetAllFoodRequestsByOrganization(organization.Id);

            var foodRequestsDto = _mapper.Map<List<FoodRequestDto>>(foodRequests);

            return Ok(foodRequestsDto);
        }

        [HttpGet("{id}")]
        [Authorize]
        [SwaggerOperation("Get foodRequest by id")]
        [SwaggerResponse(StatusCodes.Status200OK, "FoodRequest getted")]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<object> Get(Guid id)
        {
            var foodRequest = await _foodRequestService.GetFoodRequestById(id);

            var foodRequestDto = _mapper.Map<FoodRequestDto>(foodRequest);

            return Ok(foodRequestDto);
        }

        [HttpPost]
        [Authorize]
        [SwaggerOperation("Create foodRequest to current organization")]
        [SwaggerResponse(StatusCodes.Status200OK, "FoodRequest created")]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<Object> Post([FromBody] CreateFoodRequestDto createFoodRequestDto)
        {
            var user = await _userManager.FindByIdAsync(User?.FindFirst("UserId")?.Value);
            if (user.Id == null)
            {
                return NotFound("User not found");
            }

            var organization = await _organizationService.GetOrganizationByUser(user.Id);

            var assignOrganization = await _organizationService.GetOrganizationById(createFoodRequestDto.OrganizationId);

            Organization provider;
            Organization distributor;
            if (organization.Type == OrganizationType.Provider && assignOrganization.Type == OrganizationType.Distributor)
            {
                provider = organization;
                distributor = assignOrganization;
            }
            else if (organization.Type == OrganizationType.Distributor && assignOrganization.Type == OrganizationType.Provider)
            {
                provider = assignOrganization;
                distributor = organization;
            }
            else
            {
                return BadRequest("Error: organizations type");
            }

            var foodRequest = new FoodRequest
            {
                Title = createFoodRequestDto.Title,
                Description = createFoodRequestDto.Description,
                UserId = user.Id,
                EstPickUpTime = createFoodRequestDto.EstPickUpTime,
                ProviderId = provider.Id,
                DistributorId = distributor.Id,
                Delivery = createFoodRequestDto.Delivery
            };

            await _foodRequestService.CreateFoodRequest(foodRequest, provider, distributor);

            var foodRequestDto = _mapper.Map<FoodRequestDto>(foodRequest);

            return Ok(foodRequestDto);
        }


        [HttpPut]
        [Authorize]
        [SwaggerOperation("Update foodRequest in current organization")]
        [SwaggerResponse(StatusCodes.Status200OK, "FoodRequest updated")]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<Object> Put([FromBody] UpdateFoodRequestDto updateFoodRequestDto)
        {
            var user = await _userManager.FindByIdAsync(User?.FindFirst("UserId")?.Value);
            if (user.Id == null)
            {
                return NotFound("User not found");
            }

            var organization = await _organizationService.GetOrganizationByUser(user.Id);

            var foodRequest = await _foodRequestService.GetFoodRequestById(updateFoodRequestDto.Id);

            foodRequest.Title = foodRequest.Title;
            foodRequest.Description = foodRequest.Description;
            foodRequest.Delivery = foodRequest.Delivery;
            foodRequest.EstPickUpTime = foodRequest.EstPickUpTime;

            await _foodRequestService.UpdateFoodRequest(foodRequest, organization);

            var foodRequestDto = _mapper.Map<FoodRequestDto>(foodRequest);

            return Ok(foodRequestDto);
        }


        [HttpPut]
        [Route("AddProduct")]
        [Authorize]
        [SwaggerOperation("Add product to foodRequest")]
        [SwaggerResponse(StatusCodes.Status200OK, "Product added to FoodRequest")]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<Object> AddProduct(Guid foodRequestId, Guid productId)
        {
            var user = await _userManager.FindByIdAsync(User?.FindFirst("UserId")?.Value);
            if (user.Id == null)
            {
                return NotFound("User not found");
            }

            var organization = await _organizationService.GetOrganizationByUser(user.Id);

            var foodRequest = await _foodRequestService.GetFoodRequestById(foodRequestId);

            var product = await _productService.GetProductById(productId);
            foodRequest.Products.Add(product);

            await _foodRequestService.UpdateFoodRequest(foodRequest, organization);

            var foodRequestDto = _mapper.Map<FoodRequestDto>(foodRequest);
            return Ok(foodRequestDto);
        }


        [HttpPut]
        [Route("RemoveProduct")]
        [Authorize]
        [SwaggerOperation("Remove product from foodRequest")]
        [SwaggerResponse(StatusCodes.Status200OK, "Product removed from FoodRequest")]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<Object> RemoveProduct(Guid foodRequestId, Guid productId)
        {
            var user = await _userManager.FindByIdAsync(User?.FindFirst("UserId")?.Value);
            if (user.Id == null)
            {
                return NotFound("User not found");
            }

            var organization = await _organizationService.GetOrganizationByUser(user.Id);

            var foodRequest = await _foodRequestService.GetFoodRequestById(foodRequestId);

            var product = foodRequest.Products.Find(p => p.Id == productId);

            if (product == null)
            {
                throw new NotFoundApiException("No such product in foodRequest");
            }

            foodRequest.Products.Remove(product);

            await _foodRequestService.UpdateFoodRequest(foodRequest, organization);

            var foodRequestDto = _mapper.Map<FoodRequestDto>(foodRequest);

            return Ok(foodRequestDto);
        }

        [HttpDelete]
        [Authorize]
        [SwaggerOperation("Delete foodRequest in current organization")]
        [SwaggerResponse(StatusCodes.Status200OK, "FoodRequest deleted")]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<Object> Delete(Guid id)
        {
            var user = await _userManager.FindByIdAsync(User?.FindFirst("UserId")?.Value);
            if (user.Id == null)
            {
                return NotFound("User not found");
            }

            var organization = await _organizationService.GetOrganizationByUser(user.Id);

            await _foodRequestService.DeleteFoodRequests(id, organization);

            return Ok("Food Request deleted");
        }
    }
}