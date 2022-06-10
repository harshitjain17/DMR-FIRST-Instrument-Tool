using Instool.DAL.Helpers;
using Instool.DAL.Models;
using Instool.DAL.Models.Auth;
using Instool.Helpers;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Text;

namespace Instool.DAL.Repositories.Impl
{
    internal class ApiKeyRepository : IApiKeyRepository
    {
        private readonly InstoolContext _context;
        private readonly ILogger _logger;

        private readonly ITransactionSupport _transactionSupport;

        public ApiKeyRepository(InstoolContext context, ITransactionSupport transactionSupport)
        {
            _context = context;
            _logger = ApplicationLogging.CreateLogger<ApiKeyRepository>();
            _transactionSupport = transactionSupport;
        }

        public async Task<int> Create(ApiKey entity, string keyToHash)
        {
            entity.Hash = GetHash(keyToHash);
            entity.Created = DateTime.Now;
            entity.ApiKeyId = 0;
            _context.ApiKeys.Add(entity);
            await _context.SaveChangesAsync();
            return entity.ApiKeyId;
        }

        public Task Delete(ApiKey apiKey)
        {
            _context.ApiKeys.Remove(_context.ApiKeys.Single(r => r.ApiKeyId == apiKey.ApiKeyId));
            return _context.SaveChangesAsync();
        }

        public Task<List<ApiKey>> List(bool includeExpired)
        {
            IQueryable<ApiKey> query = _context.ApiKeys;
            if (!includeExpired)
            {
                query = query.Where(k => k.ValidTo >= DateTime.Now);
            }
            return query
                    .Include(a => a.Role)
                    .ToListAsync();
        }

        public Task<ApiKey?> GetByHash(string hash)
        {
            return _context.ApiKeys
                        .Where(r => r.Hash == hash)
                        .AsNoTracking()
                        .SingleOrDefaultAsync();
        }

        public Task<ApiKey?> GetById(int id)
        {
            return _context.ApiKeys
                .Where(r => r.ApiKeyId == id)
                .Include(r => r.Role)
                .AsNoTracking()
                .SingleOrDefaultAsync();
        }

        public async Task Update(int id, DateTime ValidTo, int role, bool allowInternalApi)
        {
            var key = await _context.ApiKeys.SingleOrDefaultAsync(a => a.ApiKeyId == id);
            if (key != null)
            {
                await _transactionSupport.ExecuteInTransaction(async () =>
                {
                    key.ValidTo = ValidTo;
                    key.RoleId = role;
                    key.AllowInternalApi = allowInternalApi;
                    await _context.SaveChangesAsync();
                });
                _context.Entry(key).State = EntityState.Detached;
            }
        }


        public Task<ApiKey?> Lookup(string extractedApiKey)
        {
            var hash = GetHash(extractedApiKey);
            return GetByHash(hash);
        }

        private static string GetHash(string inputString)
        {

            var hash = KeyDerivation.Pbkdf2(
                         password: inputString,
                         salt: Encoding.UTF8.GetBytes("   "),
                         prf: KeyDerivationPrf.HMACSHA512,
                         iterationCount: 10000,
                         numBytesRequested: 256 / 8);

            return Convert.ToBase64String(hash);
        }
    }
}