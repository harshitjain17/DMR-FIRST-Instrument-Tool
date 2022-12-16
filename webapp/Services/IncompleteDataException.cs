namespace Instool
{
    public class IncompleteDataException : Exception
    {
        public IncompleteDataException(string? message) : base(message)
        {
        }

        public IncompleteDataException(string dataobject, string? id) : base(
            $"{dataobject} {id} does not exist, and cannot created because it is only referred to by ID")
        { }

    }
}
