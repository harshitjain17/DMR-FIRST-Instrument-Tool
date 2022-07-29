using Instool.DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace Instool.DAL.Repositories.Impl
{
    internal class AwardRepository : IAwardRepository
    {
        private readonly InstoolContext _context;

        public AwardRepository(InstoolContext context)
        {
            _context = context;

        }
        public async Task<Award?> GetByAwardNumber(string awardNumber)
        {
            return await _context.Awards.Where(l => l.AwardNumber == awardNumber).SingleOrDefaultAsync();
        }
    }
}
