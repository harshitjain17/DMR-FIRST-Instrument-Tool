using Instool.DAL.Models;
using Instool.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Instool.Mapper
{
    internal static class AwardMapper
    {
        public static AwardDto ConvertToDto(this Award entity) => new()
        {
            AwardId = entity.AwardId,
            AwardNumber = entity.AwardNumber,
            StartDate = entity.StartDate,
            EndDate = entity.EndDate,
            Title = entity.Title,
            Investigators = entity.InvestigatorOnAwards.Select(i => i.Investigator.ConvertToDto(i.Role)).ToList()
        };

        public static IEnumerable<AwardDto> ConvertToDtos(this IEnumerable<Award> entities) =>
            entities.Select(e => e.ConvertToDto());

        public static Award ConvertToEntity(this AwardDto dto) => new Award
        {
            AwardId = dto.AwardId,
            AwardNumber = dto.AwardNumber,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            Title = dto.Title,
        };
    }
}
