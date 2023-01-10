using Instool.DAL.Models;
using Instool.Dtos;

namespace Instool.Mapper;

internal static class PublicationMapper
{
    public static PublicationDTO ConvertToDto(this Publication p) => new()
    {
        Doi = p.Doi,
        Title = p.Title,
        Authors = p.Authors,
        Journal = p.Journal,
        Year = p.Year,
        PublicationId = p.PublicationId,
    };
}
