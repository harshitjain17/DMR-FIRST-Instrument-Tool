using Instool.DAL.Helpers;
using Instool.DAL.Models;
using Instool.DAL.Models.Auth;
using Instool.Helpers;
using Instool.DAL.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Instool.DAL.Repositories.Impl
{
    internal class RoleRepository : IRoleRepository
    {

        private readonly InstoolContext _context;
        private readonly ITransactionSupport _transaction;
        private readonly ILogger _logger;

        public RoleRepository(InstoolContext context, ITransactionSupport t)
        {
            _context = context;
            _transaction = t;
            _logger = ApplicationLogging.CreateLogger<RoleRepository>();
        }

        public async Task<int> Create(Role role)
        {
            _context.Roles.Add(role);
            await _context.SaveChangesAsync();
            return role.RoleId;
        }

        public Task Delete(Role role)
        {
            _context.Roles.Remove(_context.Roles.Single(r => r.RoleId == role.RoleId));
            return _context.SaveChangesAsync();
        }

        public Task<Role?> Get(int id)
        {
            return _context.Roles
                        .Where(r => r.RoleId == id)
                        .Include(r => r.Privileges)
                        .AsNoTracking()
                        .SingleOrDefaultAsync();
        }

        public Task<List<Role>> List(bool includePrivileges = false)
        {
            IQueryable<Role> query = _context.Roles;   
            if (includePrivileges)
            {
                query = query.Include(r => r.Privileges);
            }
            return query.AsNoTracking().ToListAsync();
        }

        public async Task<IEnumerable<(Role, bool)>> ListWithUsage()
        {
            var roles = await _context.Roles
                        .Include(r => r.Privileges)
                        .Select(r => new
                        {
                            Role = r,
                            Used = false
                        })
                        .AsNoTracking()
                        .ToListAsync();
            return roles.Select(r => (r.Role, r.Used));
        }

        public Task Update(Role role)
        {
            return _transaction.ExecuteInTransaction(async () =>
            {
                _context.Privileges.RemoveRange(_context.Privileges.Where(p => p.RoleID == role.RoleId).ToList());
                await _context.SaveChangesAsync();
                _context.Update(role);
                await _context.SaveChangesAsync();
            });

        }
    }
}
