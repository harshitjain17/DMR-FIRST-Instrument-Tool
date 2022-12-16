using Instool.DAL.Models.Auth;
using Instool.Dtos;
using Instool.Helpers;

namespace Instool.Mapper;
internal static class ApiKeyMapper
{
    public static ApiKeyDto? ConvertToDto(this ApiKey entity) => new()
    {
        ID = entity.ApiKeyId,
        Name = entity.Name,
        RoleId = entity.RoleId,
        Role = entity.Role?.ConvertToDto(withPrivileges: false, used: false),
        AllowInternalApi = entity.AllowInternalApi,
        Created = DateHelper.FormatDate(entity.Created),
        ValidTo = DateHelper.FormatDate(entity.ValidTo)! // returns not null when param is not null
    };


    public static ApiKey ConvertToEntity(this ApiKeyDto dto) => new()
    {
        ApiKeyId = dto.ID,
        Name = dto.Name,
        RoleId = dto.RoleId,
        AllowInternalApi = dto.AllowInternalApi,
        Created = DateHelper.ParseUsDateOrNull(dto.Created),
        ValidTo = DateHelper.ParseUsDate(dto.ValidTo)
    };

}
