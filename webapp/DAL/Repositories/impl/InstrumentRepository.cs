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
            return query.AsSingleQuery().AsNoTracking().SingleOrDefaultAsync();
        }

        public Task<Instrument?> GetByDoi(string doi)
        {
            var query = _context.Instruments
                                .Where(i => i.Doi == doi);
            query = ApplyIncludes(query);
            return query.AsSingleQuery().AsNoTracking().SingleOrDefaultAsync();
        }

        private IQueryable<Instrument> ApplyIncludes(IQueryable<Instrument> query)
        {
            return query.Include(i => i.Awards)
                               .Include(i => i.Institution)
                               //.Include(i => i.InstrumentCapabilities)
                               .Include(i => i.InstrumentContacts).ThenInclude(c => c.Investigator)
                               .Include(i => i.Location)
                               .Include(i => i.InstrumentTypes).ThenInclude(t => t.Category).ThenInclude(t => t!.Category);
        }

        public async Task Create(Instrument instrument)
        {
            _context.Instruments.Add(instrument);
            await _context.SaveChangesAsync();
        }

        public async Task SetDoi(int id, string doi)
        {
            var instrument = await _context.Instruments
                                .Where(i => i.InstrumentId == id).SingleOrDefaultAsync();
            if (instrument == null) { return; }
            instrument.Doi = doi;
            await _context.SaveChangesAsync();
        }
        public async Task SetType(Instrument instrument, InstrumentType type)
        {
            instrument.InstrumentTypes.Add(type);
            await _context.SaveChangesAsync();
        }

        public async Task SetAward(Instrument instrument, Award award)
        {
            instrument.Awards.Add(award);
            await _context.SaveChangesAsync();
        }

        public async Task<PaginatedList<Instrument>> List(
            InstrumentSearchRequest request,
            string? sortColumn, string? sortOrder, int start, int length)
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
                query = query.Where(i =>
                    i.InstrumentTypes.Any(t => t.InstrumentTypeId == criteria.InstrumentTypeId ||
                                               t.CategoryId == criteria.InstrumentTypeId ||
                                               t!.Category!.CategoryId == criteria.InstrumentTypeId) 
                );
            }
            if (!string.IsNullOrWhiteSpace(criteria.InstrumentType))
            {
                query = query.Where(i =>
                    i.InstrumentTypes.Any(t => t.ShortName == criteria.InstrumentType || t.Uri == criteria.InstrumentType ||
                                              t!.Category!.ShortName == criteria.InstrumentType || t.Category.Uri == criteria.InstrumentType ||
                                              t!.Category!.Category!.ShortName == criteria.InstrumentType || t.Category.Category.Uri == criteria.InstrumentType));
            }
            if (criteria.Keywords.Any())
            {
                var keywordFilter = PredicateBuilder.New<Instrument>();
                foreach (var keyword in criteria.Keywords)
                {
                    keywordFilter = keywordFilter.Or(i => i.Description.Contains(keyword)
                                                       || i.Capabilities!.Contains(keyword)
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

        public async Task<PaginatedList<Instrument>> ListWithinFrame(
            InstrumentSearchRequest request,
            string? sortColumn, string? sortOrder,
            LocationFrame frame)
        {
            IQueryable<Instrument> queryAll = _context.Instruments;

            var query = ApplyCriteria(queryAll, request);
            query = query.Where(i =>
                i.Location.Latitude > frame.minLat && i.Location.Latitude < frame.maxLat &&
                i.Location.Longitude > frame.minLng && i.Location.Longitude < frame.maxLng);

            int countAll = await queryAll.CountAsync();
            int count = await query.CountAsync();
            query = ApplyIncludes(query);
            var data = await query.AsSplitQuery().AsNoTracking().ToListAsync();
            return new PaginatedList<Instrument>(data, countAll, count);
        }
    }
}
