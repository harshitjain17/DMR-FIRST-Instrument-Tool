using Instool.DAL.Models;

namespace Instool.DAL.Repositories
{
    public interface IInstrumentTypeRepository
    {
        /// <summary>
        ///     Load an instrument type including instruments
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Task<InstrumentType?> GetById(int id);
        public Task<InstrumentType?> GetByShortname(string id);

        /// <summary>
        ///     Load all instrument types within a category, 
        ///     or all top level types if no category is provided.
        /// </summary>
        /// <param name="category"></param>
        /// <returns></returns>
        public Task<ICollection<InstrumentType>> GetTypes(int? category = null);
        Task<ICollection<InstrumentType>> LoadHierarchie(int? category = null);
        Task Update(InstrumentType type);
        Task Delete(InstrumentType type);
        Task Create(InstrumentType type);
    }
}
