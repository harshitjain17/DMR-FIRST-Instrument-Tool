using Instool.DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace Instool.DAL.Repositories.impl
{
    internal class InstrumentRepository : IInstrumentRepository
    {
        private readonly InstoolContext _context;

        public InstrumentRepository(InstoolContext context)
        {
            _context = context;
        }

        public Task<Instrument?> Get(int id)
        {
            return _context.Instruments
                               .Where(i => i.InstrumentId == id)
                               .Include(i => i.Awards)
                               .Include(i => i.Institution)
                               .Include(i => i.InstrumentCapabilities)
                               .Include(i => i.InstrumentContacts)
                               .Include(i => i.Location)
                               .AsSingleQuery()
                               .SingleOrDefaultAsync();
        }
    }
}
