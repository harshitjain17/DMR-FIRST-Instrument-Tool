using Instool.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Instool.DAL.Results
{
    public class InstrumentTypeWithUsage
    {
        public InstrumentType InstrumentType { get; set; } = null!;

        public int Count { get; set; }

        public int Id { get { return this.InstrumentType.InstrumentTypeId; } }

        public int? CategoryId { get { return this.InstrumentType.CategoryId; } }

        public InstrumentTypeWithUsage Category { get; set; } = null!;
    }
}
