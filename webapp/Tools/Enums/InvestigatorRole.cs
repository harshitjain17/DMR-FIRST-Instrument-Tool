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
            return id switch
            {
                "F" => Faculty,
                "T" => Technical,
                "P" => PI,
                "c" => coPI,
                _ => throw new System.Exception("Unknown Project Category " + id),
            };
        }

        public static ICollection<BaseEnum> GetEnums()
        {
            return new List<BaseEnum>() { Faculty, Technical, PI, coPI};
        }
        public static readonly InvestigatorRole Faculty = new InvestigatorRole("F", "Faculty");
        public static readonly InvestigatorRole Technical = new InvestigatorRole("T", "Technical");

        public static readonly InvestigatorRole PI = new InvestigatorRole("P", "PI");

        public static readonly InvestigatorRole coPI = new InvestigatorRole("c", "co-PI");
    }
}