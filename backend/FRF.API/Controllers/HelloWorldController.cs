using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HelloWorldController : ControllerBase
    {
        /// <summary>
        /// Hello world!
        /// </summary>
        
        [HttpGet(Name = "GetHelloWorld")]
        [Authorize]
        public ActionResult<HelloWorldMessage> Get()
        {
            var userId = User.FindFirst("Name")?.Value;
            var m = new HelloWorldMessage();
            m.Message += userId + ")";
            return Ok(m);
        }
    }

    public class HelloWorldMessage
    {
        public string Message { get; set; } = "Hello world! (From other user ";
    }
}
