using Instool.DAL.Models;

namespace Instool.DAL.Repositories
{
    public interface IInstrumentRepository
    {
        
        Task Create(Instrument instrument);
        
        Task<Instrument?> GetById(int id);

        Task<Instrument?> GetByDoi(string doi);
        Task SetDoi(int id, string doi);

    }
}
