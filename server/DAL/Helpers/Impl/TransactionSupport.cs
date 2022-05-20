using System.Data;
using Instool.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Instool.DAL.Helpers.Impl
{
    internal class TransactionSupport : ITransactionSupport
    {
        private readonly DbContext _context;
        private readonly ILogger _logger;

        public TransactionSupport(DbContext context)
        {
            _logger = ApplicationLogging.CreateLogger<TransactionSupport>();
            this._context = context;
        }

        public async Task ExecuteInTransaction(Func<Task> action, IsolationLevel iso = IsolationLevel.ReadCommitted)
        {
            if (_context.Database.CurrentTransaction != null)
            {
                await action();
                return;
            }
            else
            {
                using var t = _context.Database.BeginTransaction(iso);
                try
                {
                    await action();
                    await _context.SaveChangesAsync();
                    t.Commit();
                }
                catch (Exception e)
                {
                    _logger.LogDebug("Exception, rolling back", e);
                    t.Rollback();
                    throw;
                }
            }
        }
    }
}