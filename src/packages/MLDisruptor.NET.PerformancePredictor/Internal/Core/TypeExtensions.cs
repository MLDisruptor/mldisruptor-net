namespace MLDisruptor.NET.PerformancePredictor.Internal.Core
{
    public static class TypeExtensions
    {
        public static IReadOnlyList<string> GetMessageNames(this Type messageType, string keyName)
        {
            return messageType
                .GetProperties()
                .Where(p => p.Name != keyName)
                .Select(p =>
                {
                    var label = p.CustomAttributes.FirstOrDefault(a => a.AttributeType.Name == "ColumnNameAttribute" && a.ConstructorArguments[0].Value?.ToString() == "Label");
                    return label is null ? p.Name : "Label";
                })
                .ToList();
        }
    }
}
