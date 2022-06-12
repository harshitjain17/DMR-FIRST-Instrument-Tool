using Instool.DAL.Models;
using Instool.DAL.Requests;
using Instool.Enums;
using Instool.Helpers;
using LinqKit;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

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

        public async Task<PaginatedList<Instrument>> InstrumentSearchRequest(
            InstrumentSearchRequest request,
            string sortColumn, string sortOrder, int start, int length)
        {
            IQueryable<Instrument> queryAll = _context.Instruments;

            var query = ApplyCriteria(queryAll, request);

            int countAll = await queryAll.CountAsync();
            int count = await query.CountAsync();
            query = ApplyIncludes(query);
            if (length > 0)
            {
                query = query.Skip(start).Take(length);
            }
            var data = await query.AsSplitQuery().AsNoTracking().ToListAsync();
            return new PaginatedList<Instrument>(data, countAll, count);
        }

        private IQueryable<Instrument> ApplyCriteria(IQueryable<Instrument> query, InstrumentSearchRequest criteria)
        {
            if (criteria.IncludeRetired != true)
            {
                query = query.Where(i => i.Status == Status.Active.ID);
            }
            if (criteria.InstrumentTypeId != null)
            {
                query = query.Where(i => i.InstrumentTypes.Any(t => t.InstrumentTypeId == criteria.InstrumentTypeId));  
            }
            if (!string.IsNullOrWhiteSpace(criteria.InstrumentType))
            {
                query = query.Where(i => i.InstrumentTypes.Any(t => t.Uri == criteria.InstrumentType));
            }
            if (!string.IsNullOrWhiteSpace(criteria.Keywords)) {
                var keywords = criteria.Keywords
                                       .Split(new char[] { ' ', ',' })
                                       .Select(k => k.Trim());
                var keywordFilter = PredicateBuilder.New<Instrument>();
                foreach (var keyword in keywords)
                {
                    keywordFilter = keywordFilter.Or(i => i.Description.Contains(keyword)
                         //|| i.Capabilities.Contains(keyword)
                    );
                }
                query = query.Where(keywordFilter);
            }
            if (criteria.AwardId != null)
            {
                query = query.Where(i => i.Awards.Any(a => a.AwardId == criteria.AwardId));
            }
            if (!string.IsNullOrWhiteSpace(criteria.AwardNumber))
            {
                query = query.Where(i => i.Awards.Any(a => a.AwardNumber == criteria.AwardNumber));
            }
            if (!string.IsNullOrWhiteSpace(criteria.Manufacturer))
            {
                query = query.Where(i => i.Manufacturer == criteria.Manufacturer);
            }
            return query;
        }
    }
}
