using System;
using System.Globalization;

namespace Instool.Helpers
{
    public static class DateHelper
    {
        public static string? UsDateToDb(string? date)
        {
            return string.IsNullOrWhiteSpace(date) ? null : ParseUsDate(date).ToString("s");
        }

        /// <summary>
        ///     Convenience method, uses DateTime.Parse.
        /// </summary>
        /// <param name="date"></param>
        /// <returns></returns>
        public static DateTime ParseUsDate(string date)
        {
            if (string.IsNullOrWhiteSpace(date))
            {
                throw new ArgumentNullException(nameof(date));
            }
            try
            {
                return DateTime.Parse(date, new CultureInfo("en-US"));
            }
            catch (FormatException f)
            {
                throw new FormatException(f.Message + " String contained: " + date);
            }
        }

        public static DateTime? ParseUsDateOrNull(string? date)
        {
            return string.IsNullOrWhiteSpace(date) ? null : ParseUsDate(date);
        }

        public static string DateToDb(DateTime date)
        {
            return date.ToString("s");
        }

        public static DateTime? ParseDbFormat(string date)
        {
            if (string.IsNullOrWhiteSpace(date))
            {
                return null;
            }
            try
            {
                return DateTime.Parse(date, new CultureInfo("en-US"));
            }
            catch (FormatException f)
            {
                throw new FormatException(f.Message + " String contained: " + date);
            }
        }

        public static DateTime? ParseSampleIDFormat(string date)
        {
            if (string.IsNullOrWhiteSpace(date))
            {
                return null;
            }
            try
            {
                return DateTime.ParseExact(date, "yyMMdd", new CultureInfo("en-US"));
            }
            catch (FormatException f)
            {
                throw new FormatException(f.Message + " String contained: " + date);
            }
        }

        public static string FormatForSampleID(DateTime date)
        {
            return date.ToString("yyMMdd");
        }

        public static string? FormatDate(string? date)
        {
            if (date == null)
            {
                return null;
            }
            try
            {
                return FormatDate(DateTime.Parse(date));
            }
            catch (FormatException f)
            {
                throw new FormatException(f.Message + " String contained: " + date);
            }
        }

        public static string? FormatDate(DateTime? date)
        {
            if (date == null)
            {
                return null;
            }
            try
            {
                return date.Value.ToString("M/d/yyyy", new CultureInfo("en-US"));
            }
            catch (FormatException f)
            {
                throw new FormatException(f.Message + " String contained: " + date);
            }
        }

        public static string? FormatDateTime(string? date)
        {
            if (date == null)
            {
                return null;
            }
            try
            {
                return FormatDateTime(DateTime.Parse(date));
            }
            catch (FormatException f)
            {
                throw new FormatException(f.Message + " String contained: " + date);
            }

        }

        public static string? FormatDateTime(DateTime? date)
        {
            if (!date.HasValue)
            {
                return null;
            }
            return date.Value.ToString("M/d/yyyy h:mm:ss tt", new CultureInfo("en-US"));
        }

        public static string? FormatDateTimeMinutes(DateTime? date)
        {
            if (!date.HasValue)
            {
                return null;
            }
            return date.Value.ToString("M/d/yyyy h:mm tt", new CultureInfo("en-US"));
        }


        public static string? FormatDateTimeFileName(DateTime? date)
        {
            if (!date.HasValue)
            {
                return null;
            }
            return date.Value.ToString("M-d-yyyy_h-mm-ss", new CultureInfo("en-US"));
        }

        /// <summary>
        /// Compare two date in UI-format by first converting them to a valid UTC Date format.
        /// </summary>
        /// <param name="first"></param>
        /// <param name="second"></param>
        /// <returns></returns>
        public static int Compare(string first, string second)
        {
            if (string.IsNullOrEmpty(first))
            {
                throw new ArgumentException($"'{nameof(first)}' cannot be null or empty.", nameof(first));
            }

            if (string.IsNullOrEmpty(second))
            {
                throw new ArgumentException($"'{nameof(second)}' cannot be null or empty.", nameof(second));
            }

            return UsDateToDb(first)!.CompareTo(UsDateToDb(second)!);
        }

        public static string CurrentDate()
        {
            return DateTime.Now.ToString("M/d/yyyy", new CultureInfo("en-US"));
        }
    }
}