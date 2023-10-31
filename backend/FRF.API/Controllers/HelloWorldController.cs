using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace FRF.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HelloWorldController : ControllerBase
    {
        [HttpGet(Name = "GetHelloWorld")]
        [SwaggerOperation("Hello World", "Returns a hello world message")]
        [Authorize]
        public ActionResult<HelloWorldMessage> Get()
        {
            var userId = User.FindFirst("UserId")?.Value;
            var m = new HelloWorldMessage();
            m.Message += userId + ")";
            return Ok(m);
        }
    }

    // TODO: DTO class needs to be moved to a separate file
    public class HelloWorldMessage
    {
        public string Message { get; set; } = "Hello world! (From other user ";
    }
}
