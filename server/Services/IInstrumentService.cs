using Instool.DAL.Models;

namespace Instool.Services
{
    public interface IInstrumentService
    {

        Task<Instrument> CreateInstrument(Instrument entity, IEnumerable<InstrumentContact> contacts);
        Task<Instrument?> GetByDoi(string v);
        Task<Instrument?> GetById(int numericalId);
        Task SetDoi(int id, string doi);
    }
}