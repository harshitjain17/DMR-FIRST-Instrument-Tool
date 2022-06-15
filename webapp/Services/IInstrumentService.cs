using Instool.DAL.Models;
using Instool.DAL.Requests;
using Instool.Helpers;

namespace Instool.Services
{
    public interface IInstrumentService
    {

        Task<Instrument> CreateInstrument(Instrument entity, IEnumerable<InstrumentContact> contacts);
        Task<Instrument?> GetByDoi(string v);
        Task<Instrument?> GetById(int numericalId);

        Task<PaginatedList<Instrument>> Search(InstrumentSearchRequest request,
            string? sortColumn, string? sortOrder, int start, int length);
        Task SetDoi(int id, string doi);
    }
}