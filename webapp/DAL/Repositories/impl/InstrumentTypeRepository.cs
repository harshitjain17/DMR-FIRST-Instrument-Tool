using Instool.DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace Instool.DAL.Repositories.Impl
{
    internal class InstrumentTypeRepository : IInstrumentTypeRepository
    {
        private readonly InstoolContext _context;

        public InstrumentTypeRepository(InstoolContext context)
        {
            _context = context;
        }

        public Task<InstrumentType?> GetById(int id)
        {
            IQueryable<InstrumentType> query = _context.InstrumentTypes
                                .Where(i => i.InstrumentTypeId == id)
                                .AsNoTracking()
                                .Include(i => i.Instruments);
            query = IncludeHierarchy(query);
            return query.AsSingleQuery().SingleOrDefaultAsync();
        }

        public Task<InstrumentType?> GetByShortname(string name)
        {
            IQueryable<InstrumentType> query = _context.InstrumentTypes
                                .Where(i => i.ShortName == name)
                                .Include(i => i.Instruments)
                                .AsNoTracking();
            query = IncludeHierarchy(query);
            return query.AsSingleQuery().SingleOrDefaultAsync();
        }

        private IQueryable<InstrumentType> IncludeHierarchy(IQueryable<InstrumentType> query)
        {
            return query.Include(i => i.Category)
                               .Include(i => i.InverseCategory);
        }

        public async Task Create(InstrumentType instrumentType)
        {
            _context.InstrumentTypes.Add(instrumentType);
            await _context.SaveChangesAsync();
        }

        public async Task Update(InstrumentType instrumentType)
        {
            _context.InstrumentTypes.Update(instrumentType);
            await _context.SaveChangesAsync();
        }
        public async Task Delete(InstrumentType instrumentType)
        {
            _context.InstrumentTypes.Remove(instrumentType);
            await _context.SaveChangesAsync();
        }


        public async Task<ICollection<InstrumentType>> GetTypes(int? category = null)
        {
            var query = _context.InstrumentTypes.Where(i => i.CategoryId == category);

            query = IncludeHierarchy(query);
            return await query.AsSingleQuery().ToListAsync();
        }

        public async Task<ICollection<InstrumentType>> LoadHierarchie(int? category = null)
        {
            IQueryable<InstrumentType> query = _context.InstrumentTypes.OrderBy(i => i.InstrumentTypeId);
            if (category != null)
            {
                query = query.Where(i => i.CategoryId == category || i.Category!.CategoryId == category);
            }

            var map = new Dictionary<int, InstrumentType>();
            foreach (var type in await query.AsNoTracking().ToListAsync()) {
                map.Add(type.InstrumentTypeId, type);
            };
            var result = new List<InstrumentType>();
            foreach (var type in map.Values)
            {
                if (type.CategoryId == null || type.CategoryId == category)
                {
                    result.Add(type);
                } else
                {
                    map[type.CategoryId.Value].InverseCategory.Add(type);
                }
            }
            return result;
        }
    }
}
