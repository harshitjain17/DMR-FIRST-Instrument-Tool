using Instool.Helpers;

namespace Instool.Enums
{
    public class Status : BaseEnum
    {

        private Status(string id, string label) : base(id, label) { }

        public static Status? GetEnum(string id)
        {
            if (id == null)
            {
                return null;
            }
            return id switch
            {
                "A" => Active,
                "R" => Retired,
                "P" => InProgress,
                _ => InProgress
            };
        }

        public static ICollection<BaseEnum> GetEnums()
        {
            return new List<BaseEnum>() { Active, Retired, InProgress };
        }
        public static readonly Status Active = new Status("A", "Active");
        public static readonly Status Retired = new Status("R", "Retired");

        public static readonly Status InProgress = new Status("P", "In Progress");
    }
}