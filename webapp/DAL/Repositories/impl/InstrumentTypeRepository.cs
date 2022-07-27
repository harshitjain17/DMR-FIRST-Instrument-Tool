using Instool.DAL.Models;
using Instool.DAL.Results;
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

        public async Task<ICollection<InstrumentTypeWithUsage>> LoadHierarchie(int? category = null)
        {
            IQueryable<InstrumentType> query = _context.InstrumentTypes.OrderBy(i => i.InstrumentTypeId);
            if (category != null)
            {
                query = query.Where(i => i.CategoryId == category || i.Category!.CategoryId == category);
            }
            return await query
                            .AsNoTracking()
                            .Select(i => new InstrumentTypeWithUsage { 
                                    InstrumentType = i,
                                    Count = i.Instruments.Count()  
                             }).ToListAsync();
        }
    }
}
