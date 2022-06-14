using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Instool
{
    internal class IncompleteDataException : Exception
    {
        public IncompleteDataException(string dataobject, string id) : base(
            $"{dataobject} {id} does not exist, and cannot created because it is only referred to by ID")
        { }

    }
}
