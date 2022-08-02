namespace Instool.DAL.Repositories
{
    public interface IFileRepository
    {
        Task<Models.File?> Get(int fileId);

        Task Create(Models.File entity);

    }
}
