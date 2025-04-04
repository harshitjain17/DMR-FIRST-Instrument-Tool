﻿using Geocoding;
using Geocoding.Google;
using Instool.Dtos;
using Instool.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace Instool.API
{
    [ApiController]
    [ApiVersion("1")]
    [Route("api/v{version:apiVersion}/locate")]
    public class LocationApiController : ControllerBase
    {
        private readonly GoogleGeocoder geocoder;

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
        public async Task<ActionResult<LocationDto>> Locate([FromQuery] string address)
        {
            try
            {
                IEnumerable<Address> addresses = await geocoder.GeocodeAsync(address);
                var first = addresses.FirstOrDefault();
                if (first == null)
                {
                    return NotFound();
                }
                return Ok(new LocationDto
                {
                    Latitude = first.Coordinates.Latitude,
                    Longitude = first.Coordinates.Longitude,
                });
            }
            catch (GoogleGeocodingException e)
            {
                throw new HttpResponseException(StatusCodes.Status500InternalServerError, e.Status);
            }

        }

        [HttpGet("address")]
        [ApiVersion("1")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<string>> GetAddress([FromQuery] double lng, [FromQuery] double lat)
        {
            try
            {
                var location = new Location(lat, lng);
                IEnumerable<Address> addresses = await geocoder.ReverseGeocodeAsync(location);
                var first = addresses.FirstOrDefault();
                if (first == null)
                {
                    return NotFound();
                }
                return Ok(first.FormattedAddress);
            }
            catch (GoogleGeocodingException e)
            {
                throw new HttpResponseException(StatusCodes.Status500InternalServerError, e.Status);
            }

        }
    }
}
