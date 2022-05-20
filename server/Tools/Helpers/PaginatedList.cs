using System.Collections.Generic;

namespace Instool.Helpers
{
    public class PaginatedList<T> : List<T>
    {
        public int RecordsFiltered { get; private set; }
        public int RecordsTotal { get; private set; }

        public PaginatedList(IEnumerable<T> items, int count, int recordsFiltered)
        {
            RecordsTotal = count;
            RecordsFiltered = recordsFiltered;
            AddRange(items);
        }
    }
}
