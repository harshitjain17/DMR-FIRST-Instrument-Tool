using Instool.DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace Instool.DAL.Repositories.Impl
{
    internal class FileRepository : IFileRepository
    {
        private readonly InstoolContext _context;

        public FileRepository(InstoolContext context)
        {
            _context = context;
        }

        public Task<Models.File?> Get(int fileId)
        {
            return _context.Files.Where(f => f.FileId == fileId).AsNoTracking().SingleOrDefaultAsync();
        }
    }
}
