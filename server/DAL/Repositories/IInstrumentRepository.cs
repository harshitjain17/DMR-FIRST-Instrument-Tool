using Instool.DAL.Models;
using Instool.DAL.Requests;
using Instool.Helpers;

namespace Instool.DAL.Repositories
{
    public interface IInstrumentRepository
    {
        
        Task Create(Instrument instrument);
        
        Task<Instrument?> GetById(int id);

        Task<Instrument?> GetByDoi(string doi);
        Task SetDoi(int id, string doi);
        Task<PaginatedList<Instrument>> InstrumentSearchRequest(
            InstrumentSearchRequest request,
            string sortColumn, string sortOrder, int start, int length);
    }
}
