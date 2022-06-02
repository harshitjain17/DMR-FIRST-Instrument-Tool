using Instool.DAL.Models;

namespace Instool.DAL.Repositories
{
    public interface IInstrumentRepository
    {
        public Task<Instrument?> GetById(int id);

        public Task<Instrument?> GetByDoi(string doi);
    }
}
