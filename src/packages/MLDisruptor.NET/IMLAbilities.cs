namespace MLDisruptor.NET
{
    /// <summary>
    /// Represents the machine learning abilities, providing access to a collection of machine learning features.
    /// </summary>
    public interface IMLAbilities
    {
        /// <summary>
        /// Gets the collection of machine learning features.
        /// </summary>
        IEnumerable<IMLFeature> Features { get; }
    }
}
