using Instool.DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace Instool.DAL.Repositories.impl
{
    internal class InvestigatorRepository : IInvestigatorRepository
    {

        private readonly InstoolContext _context;

        public InvestigatorRepository(InstoolContext context)
        {
            _context = context;
        }

        public Task<Investigator?> GetById(int id)
        {
            var query = _context.Investigators
                                .Where(i => i.InvestigatorId == id);
            query = ApplyIncludes(query);
            return query.AsSingleQuery().SingleOrDefaultAsync();
        }

        public Task<Investigator?> GetByEppn(string eppn)
        {
            var query = _context.Investigators
                                .Where(i => i.Eppn == eppn);
            query = ApplyIncludes(query);
            return query.AsSingleQuery().SingleOrDefaultAsync();
        }

        private static IQueryable<Investigator> ApplyIncludes(IQueryable<Investigator> query)
        {
            return query.Include(i => i.InstrumentContacts).ThenInclude(c => c.Instrument)
                        .Include(i => i.InvestigatorsOnAwards).ThenInclude(c => c.Award);
        }

        public async Task<int> Create(Investigator entity)
        {
            _context.Investigators.Add(entity);
            await _context.SaveChangesAsync();
            return entity.InvestigatorId;
        }
    }
}
