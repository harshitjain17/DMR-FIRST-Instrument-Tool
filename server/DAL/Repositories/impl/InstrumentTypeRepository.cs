using Instool.DAL.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Instool.DAL.Repositories.impl
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
                                .Include(i => i.Instruments);
            query = IncludeHierarchy(query);
            return query.AsSingleQuery().SingleOrDefaultAsync();
        }

        private IQueryable<InstrumentType> IncludeHierarchy(IQueryable<InstrumentType> query)
        {
            return query.Include(i => i.Category)
                               .Include(i => i.InverseCategory);
        }

        public async Task<ICollection<InstrumentType>> GetTypes(int? category = null)
        {
            var query = _context.InstrumentTypes.Where(i => i.CategoryId == category);

            query = IncludeHierarchy(query);
            return await query.AsSingleQuery().ToListAsync();
        }
    }
}
