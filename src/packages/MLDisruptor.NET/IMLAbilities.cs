namespace MLDisruptor.NET
{
    /// <summary>
    /// Entry point for accessing ML features.
    /// </summary>
    public interface IMLAbilities
    {
        IEnumerable<IMLFeature> Features { get; }
    }
}
