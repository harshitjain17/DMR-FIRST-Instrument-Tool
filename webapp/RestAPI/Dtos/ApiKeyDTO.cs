
using Instool.DAL.Models.Auth;
using Instool.Dtos;
using Instool.Helpers;
using System.ComponentModel.DataAnnotations;

namespace Instool.RestAPI.Dtos
{
    public class ApiKeyDTO
    {
        public int ID { get; set; }

        [Required]
        public string Name { get; set; } = null!;

        public int RoleId { get; set; }

        public RoleDTO? Role { get; set; }

        public string? Created { get; set; }


        [Required]
        public string ValidTo { get; set; } = null!;

        public bool AllowInternalApi { get; set; }

        public string? Key { get; set; }

        public string GetLabelForErrorMessages()
        {
            return "ApiKey";
        }

        public ApiKey GetEntity()
        {
            return new ApiKey
            {
                ApiKeyId = ID,
                Name = Name,
                RoleId = RoleId,
                AllowInternalApi = AllowInternalApi,
                Created = DateHelper.ParseUsDateOrNull(Created),
                ValidTo = DateHelper.ParseUsDate(ValidTo)
            };
        }

        public static ApiKeyDTO FromEntity(ApiKey entity)
        {
            return new ApiKeyDTO
            {
                ID = entity.ApiKeyId,
                Name = entity.Name,
                RoleId = entity.RoleId,
                Role = entity.Role != null ? RoleDTO.FromEntity(entity.Role, withPrivileges: false, used: false) : null,
                AllowInternalApi = entity.AllowInternalApi,
                Created = DateHelper.FormatDate(entity.Created),
                ValidTo = DateHelper.FormatDate(entity.ValidTo)! // return not null when param is not null
            };
        }
    }
}
