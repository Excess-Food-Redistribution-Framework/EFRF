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
        public ActionResult<HelloWorldMessage> Get()
        {
            return Ok(new HelloWorldMessage());
        }
    }

    public class HelloWorldMessage
    {
        public string Message { get; set; } = "Hello world! (From other user)";
    }
}
