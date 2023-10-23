using FRF.Domain.Entities;
using FRF.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FRF.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoodDonationController : ControllerBase
    {
        // Controller uses services
        private readonly IFoodDonationService _foodDonationService;

        // Dependency Injection (DI).
        public FoodDonationController(IFoodDonationService foodDonationService)
        {
            _foodDonationService = foodDonationService;
        }


        // GET: api/<FoodDonationController>
        [HttpGet]
        public async Task<IEnumerable<FoodDonation>> Get()
        {
            return await _foodDonationService.GetAllFoodDonations();
        }

        // GET api/<FoodDonationController>/5
        [HttpGet("{id}")]
        public async Task<FoodDonation> Get(Guid id)
        {
            return await _foodDonationService.GetFoodDonationById(id);
        }

        // POST api/<FoodDonationController>
        [HttpPost]
        public async Task Post([FromBody] FoodDonation foodDonation)
        {
            await _foodDonationService.AddFoodDonation(foodDonation);
        }


        // PUT api/<FoodDonationController>/5
        [HttpPut("{id}")]
        public async Task Put(Guid id, [FromBody] FoodDonation foodDonation)
        {
            await _foodDonationService.AddFoodDonation(foodDonation);
        }

        // DELETE api/<FoodDonationController>/5
        [HttpDelete("{id}")]
        public async Task Delete(Guid id)
        {
            await _foodDonationService.DeleteFoodDonation(id);
        }
    }
}

