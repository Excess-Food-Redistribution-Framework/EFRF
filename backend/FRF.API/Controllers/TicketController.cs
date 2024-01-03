using AutoMapper;
using FRF.API.Dto;
using FRF.API.Dto.Article;
using FRF.Domain.Entities;
using FRF.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using FRF.Domain.Exceptions;
using Newtonsoft.Json;

namespace FRF.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly ITicketService _ticketService;

        public TicketController(IMapper mapper, ITicketService ticketService)
        {
            _mapper = mapper;
            _ticketService = ticketService;
        }

        [HttpGet]
        [SwaggerOperation("Get Support Tickets")]
        public async Task<ActionResult<Pagination<Ticket>>> Get(int page = 1, int pageSize = 10)
        {
            var queryable = await _ticketService.GetAll();

            return Ok(new Pagination<Ticket>()
            {
                Page = page,
                PageSize = pageSize,
                Count = queryable.Count(),
                Data = queryable.Skip((page - 1) * pageSize).Take(pageSize).ToList()
            });
        }

        [HttpGet("{id}")]
        [SwaggerOperation("Get Support Ticket by Id")]
        public async Task<ActionResult<Ticket>> Get(Guid id)
        {
            return Ok(await _ticketService.GetById(id));
        }
        
        [HttpPost]
        [SwaggerOperation("Create Support Ticket")]
        [SwaggerResponse(200)]
        [SwaggerResponse(400, "Invalid request body", typeof(ValidationProblemDetails))]
        public async Task<ActionResult<Ticket>> Post([FromBody] CreateTicketDto body)
        {
            var ticket = _mapper.Map<Ticket>(body);
            await _ticketService.Add(ticket);
            return Ok(ticket);
        }
        
        [HttpDelete("{id}")]
        [SwaggerOperation("Delete Support Ticket")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _ticketService.Delete(id);
            return Ok();
        }
    }
    
}
