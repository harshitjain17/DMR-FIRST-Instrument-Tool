namespace Instool.Helpers { 
    public class LocationFrame
    {
        public double minLat;
        public double maxLat;
        public double minLng;
        public double maxLng;

        public LocationFrame(double lat, double lng, int maxDist)
        {
            // That's a rough approximation, to reduce the amount of data that needs to be loaded
            // distance between circles of latitude is
            double latDiff = (double)maxDist / 70;
            this.minLat = lat - latDiff;
            this.maxLat = lat + latDiff;

            // distance between circles of longitude depends on latitude, circles
            // getting shorter farther away from the equator.
            var maxAbsLat = Math.Max(Math.Abs(this.minLat), Math.Abs(this.maxLat));

            // calculate the length of the circle of latitude (roughly)
            double lengthCircleOfLatidue = (2 * Math.PI * 3986.5 * Math.Cos(Math.PI * maxAbsLat / 180));
            double oneDegreeLongitude = lengthCircleOfLatidue / 360;
            double lngDiff = (double)maxDist / oneDegreeLongitude;
            this.minLng = lng - lngDiff;
            this.maxLng = lng + lngDiff;
        }

    }

}
