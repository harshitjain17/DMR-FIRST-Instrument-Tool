using Instool.DAL.Models;
using Instool.Dtos;

namespace Instool.Mapper
{
    internal static class LocationMapper
    {
        public static LocationDto? ConvertToDto(this Location entity)
        {
            if (entity == null) { return null; }

            return new LocationDto
            {
                LocationId = entity.LocationId,
                Building = entity.Building,
                Street = entity.Street,
                City = entity.City,
                State = entity.State,
                Zip = entity.Zip,
                Country = entity.Country,
                Latitude = entity.Latitude,
                Longitude = entity.Longitude
            };
        }

        public static Location ConvertToEntity(this LocationDto dto)
        {
            if (dto.Street == null ||
                dto.City == null ||
                dto.Zip == null ||
                dto.Country == null)
            {
                throw new IncompleteDataException("Cannot process location, data is incomplete");
            }

            return new Location
            {
                LocationId = dto.LocationId ?? 0,
                Building = dto.Building,
                Street = dto.Street,
                City = dto.City,
                State = dto.State,
                Zip = dto.Zip,
                Country = dto.Country,
                Latitude = dto.Latitude,
                Longitude = dto.Longitude
            };
        }
    }
}
