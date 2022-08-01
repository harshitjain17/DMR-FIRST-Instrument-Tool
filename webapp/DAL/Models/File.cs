using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Instool.DAL.Models
{
    public class File
    {
        public int FileId { get; set; }
        public string Filename { get; set; } = null!;

        public string Content { get; set; } = null!;

        public int InstrumentId { get; set; }
        public virtual Instrument Instrument { get; set; } = null!;

        public File()
        {

        }
    }
}

