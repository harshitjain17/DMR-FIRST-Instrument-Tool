using Instool.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Instool.Dto
{
    public class InstrumentWithDistance
    {
        public Instrument Instrument { get; }

        public int Distance { get; }

        public InstrumentWithDistance(Instrument instrument, int distance)
        {
            Instrument = instrument;
            Distance = distance;
        }
    }
}
