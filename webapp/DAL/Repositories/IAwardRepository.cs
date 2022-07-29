using Instool.DAL.Models;

namespace Instool.DAL.Repositories
{
    public interface IAwardRepository
    {
        Task<Award?> GetByAwardNumber(string awardNumber);
    }
}
