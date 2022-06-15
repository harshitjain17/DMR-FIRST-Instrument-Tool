namespace Instool.Helpers
{
    public class BaseEnum
    {
        public string ID { get; internal set; }
        public string Label { get; protected set; }

        protected BaseEnum(string ID, string Label)
        {
            this.ID = ID;
            this.Label = Label;
        }

        protected BaseEnum()
        {
            ID = null!;
            Label = null!;
        }

    }
}