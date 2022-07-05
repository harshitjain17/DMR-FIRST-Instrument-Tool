using Instool.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Instool.DAL.Repositories
{
    public interface IInstitutionRepository
    {
        Task<Institution?> Lookup(string facility);
    }
}
