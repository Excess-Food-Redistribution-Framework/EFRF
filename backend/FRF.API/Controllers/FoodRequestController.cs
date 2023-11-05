using FRF.Domain.Entities;
using FRF.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FRF.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoodRequestController : ControllerBase
    {
        // Controller uses services
        private readonly IFoodRequestService _foodRequestService;

        // Dependency Injection (DI).
        public FoodRequestController(IFoodRequestService foodRequestService)
        {
            _foodRequestService = foodRequestService;
        }


        // GET: api/<FoodDonationController>
        [HttpGet]
        public async Task<IEnumerable<FoodRequest>> Get()
        {
            var response = await _foodRequestService.GetAllFoodRequests();
            return response.Data;
        }

        // GET api/<FoodDonationController>/5
        [HttpGet("{id}")]
        public async Task<FoodRequest> Get(Guid id)
        {
            var response = await _foodRequestService.GetFoodRequestById(id);
            return response.Data;
        }

        // POST api/<FoodDonationController>
        [HttpPost]
        public async Task Post([FromBody] FoodRequest foodDonation)
        {
            //await _foodRequestService.CreateFoodRequest(foodDonation);
        }


        // PUT api/<FoodDonationController>/5
        [HttpPut("{id}")]
        public async Task Put(Guid id, [FromBody] FoodRequest foodDonation)
        {
            foodDonation.Id = id;
            await _foodRequestService.UpdateFoodRequest(foodDonation);
        }

        // DELETE api/<FoodDonationController>/5
        [HttpDelete("{id}")]
        public async Task Delete(Guid id)
        {
            await _foodRequestService.DeleteFoodRequests(id);
        }
    }
}

