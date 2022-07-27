using Instool.Authorization.PolicyCode;
using Instool.Authorization.Privileges;
using Instool.DAL.Models;
using Instool.DAL.Repositories;
using Instool.DAL.Requests;
using Instool.DAL.Results;
using Instool.Dtos;
using Instool.RestAPI.Exceptions;
using Instool.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Instool.API
{
    [ApiController]
    [ApiVersion("1")]
    [Route("api/v{version:apiVersion}/instrument-types")]
    public class InstrumentTypeApiController : ControllerBase
    {
        private readonly IAuthorizationService _authService;
        private readonly IInstrumentTypeRepository _repo;
        private readonly IInstrumentService _instrumentService;

        public InstrumentTypeApiController(IAuthorizationService authService, IInstrumentTypeRepository repo, IInstrumentService instrumentService)
        {
            _authService = authService;
            _repo = repo;
            _instrumentService = instrumentService;
        }

        [HttpGet("{idOrShortName}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        [HasPrivilege(PrivilegeEnum.InstrumentType)]
        public async Task<ActionResult<InstrumentTypeDTO>> GetInstrumentType(string idOrShortName)
        {
            var type = await LoadType(idOrShortName);
            return Ok(InstrumentTypeDTO.WithCategory(type));
        }


        [HttpDelete("{idOrShortName}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(void), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        [HasPrivilege(PrivilegeEnum.InstrumentType, OperationEnum.Delete)]
        public async Task<ActionResult<InstrumentTypeDTO>> DeleteType(string idOrShortName)
        {
            var type = await LoadType(idOrShortName);
            var instruments = await _instrumentService.Search(
                new InstrumentSearchRequest
                {
                    InstrumentTypeId = type.InstrumentTypeId
                },
                null, null, 0, 1
            );
            if (instruments.Any())
            {
                throw new HttpResponseException(StatusCodes.Status412PreconditionFailed, "Cannot delete instrument type, there are instruments for that type.");
            }
            await _repo.Delete(type);
            return NoContent();
        }

        [HttpPut("{idOrShortName}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        [HasPrivilege(PrivilegeEnum.InstrumentType, OperationEnum.Update)]
        public async Task<ActionResult<InstrumentTypeDTO>> Rename(string idOrShortName, string label)
        {
            var type = await LoadType(idOrShortName);
            type.Label = label;
            await _repo.Update(type);
            return Ok(InstrumentTypeDTO.WithCategory(type));
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        [HasPrivilege(PrivilegeEnum.InstrumentType, OperationEnum.Create)]
        public async Task<ActionResult<InstrumentTypeDTO>> CreateInstrumentType([FromBody] InstrumentTypeDTO dto)
        {
            if (dto.InstrumentTypeId != 0)
            {
                return BadRequest("InstrumentTypeID is set automatically and has to be empty");
            }
            var entity = dto.GetEntity();
            if (dto.Category != null && dto.Category.InstrumentTypeId <= 0)
            {
                var category = await LoadType(dto.Category.Name);
                entity.CategoryId = category.InstrumentTypeId;
            }

            await _repo.Create(entity);

            return InstrumentTypeDTO.WithCategory(entity);
        }



        [HttpGet("{idOrShortName}/instruments")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        [HasPrivilege(PrivilegeEnum.Instrument)]
        public async Task<ActionResult<InstrumentSearchResult>> GetInstrumentsByType(
            [FromQuery] string idOrShortName,
            [FromQuery] string? sortColumn, [FromQuery] string? sortOrder,
            [FromQuery] int start, [FromQuery] int length, [FromQuery] int draw)
        {
            var type = await LoadType(idOrShortName);

            var instruments = await _instrumentService.Search(
                new InstrumentSearchRequest
                {
                    InstrumentTypeId = type.InstrumentTypeId
                },
                sortColumn, sortOrder, start, length
            );
            return Ok(new InstrumentSearchResult(instruments, draw));
        }

        [HttpGet("{idOrShortName}/types")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        [HasPrivilege(PrivilegeEnum.InstrumentType)]
        public async Task<ActionResult<ICollection<InstrumentDTO>>> GetSubtypes(string idOrShortName)
        {
            var type = await LoadType(idOrShortName);
            var types = await _repo.GetTypes(type.InstrumentTypeId);
            return Ok(types.Select(i => InstrumentTypeDTO.WithSubTypes(i)));
        }

        [HttpGet("{idOrShortName}/dropdown")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        [HasPrivilege(PrivilegeEnum.InstrumentType)]
        public async Task<ActionResult<ICollection<InstrumentTypeDropdownEntry>>> GetDropDownEntries(string idOrShortName)
        {
            var type = await LoadType(idOrShortName);
            var types = await _repo.LoadHierarchie(type.InstrumentTypeId);
            return Ok(
                    ToHierarchie(types, category: type.InstrumentTypeId)
                    .Select((t, index) => InstrumentTypeDropdownEntry.FromEntity(
                        t, 
                        t.Category.InstrumentType, 
                        index)
                    )
            );
        }

        [HttpGet("dropdown")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        [HasPrivilege(PrivilegeEnum.InstrumentType)]
        public async Task<ActionResult<ICollection<InstrumentTypeDropdownEntry>>> GetDropDownEntries()
        {
            var types = await _repo.LoadHierarchie();
            var withCategory = ToHierarchie(types, category: null);
            var dtos = withCategory.Where(t => t.Category.Category != null)
                                   .Select((t, index) => 
                                        InstrumentTypeDropdownEntry.FromEntity(
                                            t,
                                            t.Category.Category.InstrumentType,
                                            t.Category.InstrumentType,
                                            index));
            return Ok(dtos);
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        [HasPrivilege(PrivilegeEnum.InstrumentType)]
        public async Task<ActionResult<ICollection<InstrumentTypeDTO>>> GetInstrumentTypes()
        {
            var types = await _repo.GetTypes();
            return Ok(types.Select(i => InstrumentTypeDTO.WithCategory(i)));
        }


        /// <summary>
        ///     Load the entity or throw an 404 if not in the DB.
        /// </summary>
        /// <param name="idOrName">internal (numeric) ID or shrot name</param>
        /// <returns></returns>
        private async Task<InstrumentType> LoadType(string idOrName)
        {
            var entity = int.TryParse(idOrName, out int id) ?
                        await _repo.GetById(id) :
                        await LoadTypeByShortName(idOrName);
            if (entity == null)
            {
                throw HttpResponseException.NotFound();
            }
            return entity;
        }

        /// <summary>
        ///     Frontend needs unique shortnames, so we add a number with #dd.
        ///     That has to be stripped away before querying the DB.
        /// </summary>
        /// <param name="shortName"></param>
        /// <returns></returns>
        private Task<InstrumentType?> LoadTypeByShortName(string shortName)
        {
            return _repo.GetByShortname(shortName.Split("#")[0]);
        }


        private List<InstrumentTypeWithUsage> ToHierarchie(ICollection<InstrumentTypeWithUsage> types, int? category = null)
        {
            var map = new Dictionary<int, InstrumentTypeWithUsage>();
            foreach (var type in types)
            {
                map.Add(type.Id, type);
            };
            var result = new List<InstrumentTypeWithUsage>();
            foreach (var type in map.Values)
            {
                if (type.CategoryId.HasValue && type.CategoryId != category)
                {
                    type.Category = map[type.CategoryId.Value];
                    result.Add(type);
                }
            }
            return result;
        }
    }
}