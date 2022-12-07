using Instool.DAL.Models;
using Instool.DAL.Requests;
using Instool.Dto;
using Instool.Helpers;

namespace Instool.Services
{
    public interface IInstrumentService
    {

        Task<Instrument> CreateInstrument(
            Instrument entity, 
            IEnumerable<InstrumentContact> contacts, 
            IEnumerable<InstrumentType> types,
            IEnumerable<Award> awards);

        Task<Instrument> UpdateInstrument(
            Instrument entity,
            IEnumerable<InstrumentContact> contacts,
            IEnumerable<InstrumentType> types,
            IEnumerable<Award> awards);

        Task<Instrument?> GetByDoi(string v);
        Task<Instrument?> GetById(int numericalId);

        Task<PaginatedList<InstrumentWithDistance>> Search(InstrumentSearchRequest request,
            string? sortColumn, string? sortOrder, int start, int length);
        Task<List<Instrument>> Lookup(InstrumentLookupRequest request);
        Task SetDoi(int id, string doi);
    }
}