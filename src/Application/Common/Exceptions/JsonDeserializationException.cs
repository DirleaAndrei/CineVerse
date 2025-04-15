namespace CineVerse.Application.Common.Exceptions
{
    public class JsonDeserializationException : Exception
    {
        public string Json { get; }
        public string TargetClassName { get; }

        public JsonDeserializationException(string json, string targetClassName, Exception? innerException = null)
            : base($"Failed to deserialize JSON into {targetClassName}. JSON: {json}", innerException)
        {
            Json = json;
            TargetClassName = targetClassName;
        }
    }
}