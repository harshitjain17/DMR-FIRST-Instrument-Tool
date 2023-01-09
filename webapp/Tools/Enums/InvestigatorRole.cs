using Instool.Helpers;

namespace Instool.Enums
{
    public class InvestigatorRole : BaseEnum
    {

        private InvestigatorRole(string id, string label) : base(id, label) { }

        public static InvestigatorRole? GetEnum(string id)
        {
            if (id == null)
            {
                return null;
            }
            return id.ToLower() switch
            {
                "f" => Faculty,
                "faculty" => Faculty,
                "t" => Technical,
                "technical" => Technical,
                "pi" => PI,
                "p" => PI,
                "c" => coPI,
                "copi" => coPI,
                _ => throw new Exception("Unknown Project Category " + id),
            };
        }

        public static ICollection<BaseEnum> GetEnums()
        {
            return new List<BaseEnum>() { Faculty, Technical, PI, coPI};
        }
        public static readonly InvestigatorRole Faculty = new("F", "Faculty");
        public static readonly InvestigatorRole Technical = new("T", "Technical");

        public static readonly InvestigatorRole PI = new("P", "PI");

        public static readonly InvestigatorRole coPI = new("c", "co-PI");
    }
}