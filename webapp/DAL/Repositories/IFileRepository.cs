namespace Instool.DAL.Repositories
{
    public interface IFileRepository
    {
        Task<Models.File?> Get(int fileId);

    }
}
