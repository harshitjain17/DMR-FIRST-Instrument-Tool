using Instool.DAL.Models.Auth;

namespace Instool.DAL.Repositories
{
    public interface IRoleRepository
    {
        /// <summary>
        /// Get a list of roles
        /// </summary>
        /// <returns></returns>
        Task<List<Role>> List(bool includePrivileges = false);

        /// <summary>
        /// Get a list of roles for modification, including privileges and flag if used (ie. if deletable or not)
        /// </summary>
        /// <returns></returns>
        Task<IEnumerable<(Role, bool)>> ListWithUsage();

        Task<int> Create(Role role);

        Task<Role?> Get(int id);

        Task Update(Role role);

        Task Delete(Role role);

    }
}
