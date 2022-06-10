using Instool.DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace Instool.DAL.Repositories.Impl
{
    internal class InstrumentRepository : IInstrumentRepository
    {
        private readonly InstoolContext _context;

        public InstrumentRepository(InstoolContext context)
        {
            _context = context;
        }

        public Task<Instrument?> GetById(int id)
        {
            var query = _context.Instruments
                                .Where(i => i.InstrumentId == id);
            query = ApplyIncludes(query);
            return query.AsSingleQuery().SingleOrDefaultAsync();
        }

        public Task<Instrument?> GetByDoi(string doi)
        {
            var query = _context.Instruments
                                .Where(i => i.Doi == doi);
            query = ApplyIncludes(query);
            return query.AsSingleQuery().SingleOrDefaultAsync();
        }

        private IQueryable<Instrument> ApplyIncludes(IQueryable<Instrument> query)
        {
            return query.Include(i => i.Awards)
                               .Include(i => i.Institution)
                               //.Include(i => i.InstrumentCapabilities)
                               .Include(i => i.InstrumentContacts)
                               .Include(i => i.Location)
                               .Include(i => i.InstrumentTypes);
        }

        public async Task Create(Instrument instrument)
        {
            _context.Instruments.Add(instrument);
            await _context.SaveChangesAsync();
        }
    
        public async Task SetDoi(int id, string doi)
        {
            var instrument = await GetById(id);
            if (instrument == null) { return; }
            instrument.Doi = doi;
            await _context.SaveChangesAsync();
        }
    }
}
