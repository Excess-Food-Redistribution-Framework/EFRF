using AutoMapper;
using FRF.API.Dto.FoodRequest;
using FRF.API.Dto.Organization;
using FRF.Domain.Entities;
using FRF.Domain.Enum;
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
        public async Task<object> ChangeState(ChangeStateDto changeStateDto)
        {
            var user = await _userManager.FindByIdAsync(User?.FindFirst("UserId")?.Value);
            if (user.Id == null)
            {
                return NotFound("User not found");
            }

            var getOrganizationResponse = await _organizationService.GetOrganizationByUser(user.Id);
            var organization = getOrganizationResponse.Data;

            if (organization == null)
            {
                return NotFound(getOrganizationResponse);
            }

            var foodRequestsResponse = await _foodRequestService.GetFoodRequestById(changeStateDto.Id);
            var foodRequest = foodRequestsResponse.Data;

            if (foodRequest == null)
            {
                return NotFound(foodRequestsResponse);
            }

            var changeStateResponse = await _foodRequestService.ChangeStateFoodRequest(changeStateDto.State, foodRequest, organization);
            if (changeStateResponse.StatusCode != HttpStatusCode.OK)
            {
                return BadRequest(changeStateResponse);
            }

            return Ok(foodRequest);
        }


        [HttpGet]
        [Authorize]
        [SwaggerOperation("Get foodRequest")]
        [SwaggerResponse(StatusCodes.Status200OK, "FoodRequest getted")]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<object> Get()
        {
            var foodRequestsResponse = await _foodRequestService.GetAllFoodRequests();

            if (foodRequestsResponse.StatusCode != HttpStatusCode.OK)
            {
                return BadRequest(foodRequestsResponse);
            }

            var foodRequests = foodRequestsResponse.Data;

            var foodRequestsDto = new List<FoodRequestDto>();

            if (foodRequests != null)
            {
                foreach (var foodRequest in foodRequests)
                {
                    var foodRequestDto = _mapper.Map<FoodRequestDto>(foodRequest);
                    foodRequestsDto.Add(foodRequestDto);
                }
            }
            return Ok(foodRequestsDto);
        }

        [HttpGet]
        [Route("GetByOrganization")]
        [Authorize]
        [SwaggerOperation("Get foodRequest by organization")]
        [SwaggerResponse(StatusCodes.Status200OK, "FoodRequest getted")]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<object> GetByOrganization(Guid id)
        {
            var getOrganizationResponse = await _organizationService.GetOrganizationById(id);
            var organization = getOrganizationResponse.Data;

            if (organization == null)
            {
                return NotFound(getOrganizationResponse);
            }

            var foodRequestsResponse = await _foodRequestService.GetAllFoodRequestsByOrganization(organization.Id);

            if (foodRequestsResponse.StatusCode != HttpStatusCode.OK)
            {
                return BadRequest(foodRequestsResponse);
            }

            var foodRequests = foodRequestsResponse.Data;

            var foodRequestsDto = new List<FoodRequestDto>();

            if (foodRequests != null)
            {
                foreach (var foodRequest in foodRequests)
                {
                    var foodRequestDto = _mapper.Map<FoodRequestDto>(foodRequest);
                    foodRequestsDto.Add(foodRequestDto);
                }
            }
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

            var getOrganizationResponse = await _organizationService.GetOrganizationByUser(user.Id);
            var organization = getOrganizationResponse.Data;

            if (organization == null)
            {
                return NotFound(getOrganizationResponse);
            }

            var foodRequestsResponse = await _foodRequestService.GetAllFoodRequestsByOrganization(organization.Id);

            if (foodRequestsResponse.StatusCode != HttpStatusCode.OK)
            {
                return BadRequest(foodRequestsResponse);
            }

            var foodRequests = foodRequestsResponse.Data;

            var foodRequestsDto = new List<FoodRequestDto>();

            if (foodRequests != null)
            {
                foreach (var foodRequest in foodRequests)
                {
                    var foodRequestDto = _mapper.Map<FoodRequestDto>(foodRequest);
                    foodRequestsDto.Add(foodRequestDto);
                }
            }
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
            var foodRequestsResponse = await _foodRequestService.GetFoodRequestById(id);
            var foodRequest = foodRequestsResponse.Data;

            if (foodRequest == null)
            {
                return NotFound(foodRequestsResponse);
            }

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

            var getOrganizationResponse = await _organizationService.GetOrganizationByUser(user.Id);
            var organization = getOrganizationResponse.Data;

            var getAssignOrganizationResponse = await _organizationService.GetOrganizationById(createFoodRequestDto.OrganizationId);
            var assignOrganization = getAssignOrganizationResponse.Data;

            if (organization == null || assignOrganization == null)
            {
                return NotFound(getOrganizationResponse);
            }

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

            var createResponse = await _foodRequestService.CreateFoodRequest(foodRequest, provider, distributor);

            if (createResponse.StatusCode != HttpStatusCode.OK)
            {
                return NotFound(createResponse);
            }

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

            var getOrganizationResponse = await _organizationService.GetOrganizationByUser(user.Id);
            var organization = getOrganizationResponse.Data;

            if (organization == null)
            {
                return NotFound(getOrganizationResponse);
            }

            var getFoodRequestResponse = await _foodRequestService.GetFoodRequestById(updateFoodRequestDto.Id);
            var foodRequest = getFoodRequestResponse.Data;

            if (foodRequest == null)
            {
                return NotFound(getFoodRequestResponse);
            }

            foodRequest.Title = foodRequest.Title;
            foodRequest.Description = foodRequest.Description;
            foodRequest.Delivery = foodRequest.Delivery;
            foodRequest.EstPickUpTime = foodRequest.EstPickUpTime;

            var updateResponse = await _foodRequestService.UpdateFoodRequest(foodRequest, organization);

            if (updateResponse.StatusCode != HttpStatusCode.OK)
            {
                return NotFound(updateResponse);
            }

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

            var getOrganizationResponse = await _organizationService.GetOrganizationByUser(user.Id);
            var organization = getOrganizationResponse.Data;

            if (organization == null)
            {
                return NotFound(getOrganizationResponse);
            }

            var getFoodRequestResponse = await _foodRequestService.GetFoodRequestById(foodRequestId);
            var foodRequest = getFoodRequestResponse.Data;

            if (foodRequest == null)
            {
                return NotFound(getFoodRequestResponse);
            }

            var getProductResponse = await _productService.GetProductById(productId);
            var product = getProductResponse.Data;

            if (product == null)
            {
                return NotFound(getProductResponse);
            }

            foodRequest.Products.Add(product);

            var updateResponse = await _foodRequestService.UpdateFoodRequest(foodRequest, organization);

            if (updateResponse.StatusCode != HttpStatusCode.OK)
            {
                return NotFound(updateResponse);
            }

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

            var getOrganizationResponse = await _organizationService.GetOrganizationByUser(user.Id);
            var organization = getOrganizationResponse.Data;

            if (organization == null)
            {
                return NotFound(getOrganizationResponse);
            }

            var getFoodRequestResponse = await _foodRequestService.GetFoodRequestById(foodRequestId);
            var foodRequest = getFoodRequestResponse.Data;

            if (foodRequest == null)
            {
                return NotFound(getFoodRequestResponse);
            }

            var product = foodRequest.Products.Find(p => p.Id == productId);

            if (product == null)
            {
                return NotFound("No such product in foodRequest");
            }

            foodRequest.Products.Remove(product);

            var updateResponse = await _foodRequestService.UpdateFoodRequest(foodRequest, organization);

            if (updateResponse.StatusCode != HttpStatusCode.OK)
            {
                return NotFound(updateResponse);
            }

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

            var getOrganizationResponse = await _organizationService.GetOrganizationByUser(user.Id);
            var organization = getOrganizationResponse.Data;

            if (organization == null)
            {
                return NotFound(getOrganizationResponse);
            }

            var updateResponse = await _foodRequestService.DeleteFoodRequests(id, organization);

            if (updateResponse.StatusCode != HttpStatusCode.OK)
            {
                return NotFound(updateResponse);
            }

            return Ok("Food Request deleted");
        }
    }
}