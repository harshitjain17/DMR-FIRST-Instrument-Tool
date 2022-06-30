using Instool.DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace Instool.DAL.Repositories.Impl
{
    internal class LocationRepository : ILocationRepository
    {
        private readonly InstoolContext _context;

        public LocationRepository(InstoolContext context)
        {
            _context = context;

        }
        public async Task<Location?> Lookup(string building)
        {
            var found = await _context.Locations.Where(l => l.Building == building).Take(2).ToListAsync();
            return found.Count == 1 ? found[0] : null;  
        }
    }
}
