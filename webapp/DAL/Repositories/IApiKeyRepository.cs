using Instool.DAL.Models.Auth;

namespace Instool.DAL.Repositories
{
    public interface IApiKeyRepository
    {
        Task<ApiKey?> GetByHash(string hash);

        Task<ApiKey?> GetById(int id);
        Task<List<ApiKey>> List(bool includeExpired);

        Task<int> Create(ApiKey apiKey, string keyToHash);

        Task Delete(ApiKey apiKey);

        Task Update(int id, DateTime ValidTo, int role, bool isReadonly);
        Task<ApiKey?> Lookup(string extractedApiKey);
    }
}
