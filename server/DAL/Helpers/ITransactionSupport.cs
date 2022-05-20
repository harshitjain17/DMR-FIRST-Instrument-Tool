using System;
using System.Data;
using System.Threading.Tasks;

namespace Instool.DAL.Helpers
{
    public interface ITransactionSupport
    {
        /// <summary>
        /// Make sure the action is executed in a transation.
        /// Start one if there is no transaction yet and do a commit (or rollback) afterwards.
        ///
        /// If an transaction has been already opened, just execute the action.
        /// </summary>
        /// <param name="action"></param>
        /// <returns></returns>
        Task ExecuteInTransaction(Func<Task> action, IsolationLevel iso = IsolationLevel.ReadCommitted);
    }

}
