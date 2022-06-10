using Instool.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Instool.DAL.Repositories
{
    public interface IInvestigatorRepository
    {
        public Task<Investigator?> GetById(int id);

        public Task<Investigator?> GetByEppn(string eppn);

        public Task<int> Create(Investigator entity);
    }
}
