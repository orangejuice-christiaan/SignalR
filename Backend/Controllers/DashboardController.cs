using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]/[action]")]
    public class DashboardController : Controller
    {
        [HttpGet]
        public IActionResult Data()
        {
            return Ok();
        }
    }
}
