using Geocoding;
using Geocoding.Google;
using Instool.Dtos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace Instool.RestAPI.API
{
    [ApiController]
    [ApiVersion("1")]
    [Route("api/v{version:apiVersion}/locate")]
    public class LocationApiController : ControllerBase
    {
        private GoogleGeocoder geocoder;

        public LocationApiController(IConfiguration config)
        {
            var section = config.GetSection("Google");
            var apiKey = section.GetValue("ApiKey", "");
            geocoder = new GoogleGeocoder() { ApiKey = apiKey };
        }


        [HttpGet]
        [ApiVersion("1")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<IEnumerable<LocationDTO>>> Locate([FromQuery] string address)
        {
            IEnumerable<Address> addresses = await geocoder.GeocodeAsync(address);
            var first = addresses.FirstOrDefault();
            if (first == null)
            {
                return NotFound();
            }
            return Ok(new LocationDTO
            {
                Latitude = first.Coordinates.Latitude,
                Longitude = first.Coordinates.Longitude,
            });
        }
    }
}
