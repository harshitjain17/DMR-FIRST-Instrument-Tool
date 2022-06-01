namespace Instool.Tools.Helpers
{
    public static class DoiHelper
    {

        public static IdOrDoi DecodeDoi(string route)
        {
            // Make sure we do not treat a starting or ending slash as part of the id
            // (Hopefully we do not get a DOI ending with a slash).
            if (route.StartsWith("/")) { route = route[1..]; }
            if (route.EndsWith("/")) { route = route[0..(route.Length - 1)]; }

            return new IdOrDoi(route);
        }

        /// <summary>
        /// Decode a route with DOIs.
        /// {idOrDOI}/furtherPath/{furtherId}
        /// 
        /// DOIs contains slashes, so the usual route matching cannot be used.
        /// 
        /// 
        /// </summary>
        /// <param name="route"></param>
        /// <param name="numericalId"></param>
        /// <param name="doi"></param>
        /// <param name="datapackageId"></param>
        public static bool DecodeDoi(string route, string furtherPath, out IdOrDoi first, out IdOrDoi second)
        {
            // Make sure we do not treat a starting or ending slash as part of the id
            // (Hopefully we do not get a DOI ending with a slash).
            if (route.StartsWith("/")) { route = route[1..]; }
            if (route.EndsWith("/")) { route = route[0..(route.Length - 1)]; }

            if (string.IsNullOrWhiteSpace(furtherPath))
            {
                first = new IdOrDoi(route);
                second = new IdOrDoi();
            }
            else
            {
                // A path param in the route has to start with /. If we got a param without, add it.
                if (!furtherPath.StartsWith("/")) { furtherPath = "/" + furtherPath; }
                var pos = route.IndexOf(furtherPath);
                if (pos < 0)
                {
                    first = null;
                    second = null;
                    return false;
                }
                first = new IdOrDoi(route[0..pos]);
                second = route.Length > (pos + furtherPath.Length + 1) ?
                            new IdOrDoi(route[(pos + furtherPath.Length + 1)..]) :
                            new IdOrDoi();
            }
            return true;
        }
    }
    public class IdOrDoi
    {
        public IdOrDoi()
        {
        }

        internal IdOrDoi(string param)
        {
            if (int.TryParse(param, out int id))
            {
                NumericalId = id;
            }
            else
            {
                Doi = param;
            }
        }

        public string Doi { get; internal set; }
        public int NumericalId { get; internal set; }

        public bool IsDoi
        {
            get { return this.Doi != null; }
        }

        public bool HasValue
        {
            get { return this.Doi != null || this.NumericalId != 0; }
        }
    }
}
