using Instool.DAL.Models;

namespace Instool.DAL.Repositories
{
    public interface ILocationRepository
    {
        Task<Location?> Lookup(string building);
    }
}
