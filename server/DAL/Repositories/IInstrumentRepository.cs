using Instool.DAL.Models;

namespace Instool.DAL.Repositories
{
    public interface IInstrumentRepository
    {
        public Task<Instrument?> Get(int id);
    }
}
