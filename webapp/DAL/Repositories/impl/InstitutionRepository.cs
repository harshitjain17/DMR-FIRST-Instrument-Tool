using Instool.DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace Instool.DAL.Repositories.Impl
{
    internal class InstitutionRepository : IInstitutionRepository
    {
        private readonly InstoolContext _context;

        public InstitutionRepository(InstoolContext context)
        {
            _context = context;

        }
        public async Task<Institution?> Lookup(string facility)
        {
            var found = await _context.Institutions.Where(l => l.Facility == facility).Take(2).ToListAsync();
            return found.Count == 1 ? found[0] : null;  
        }
    }
}
