namespace MLDisruptor.NET
{
    /// <summary>
    /// Represents a machine learning feature with initialization capabilities.
    /// </summary>
    public interface IMLFeature : IMLFeatureWithName
    {
        /// <summary>
        /// Initializes the machine learning feature with the specified options.
        /// </summary>
        /// <typeparam name="T">The type of event used by the event factory.</typeparam>
        /// <param name="options">The options to use for configuring the machine learning feature.</param>
        void Initialize<T>(FeatureOptions<T> options);
    }

    public interface IMLFeatureWithName
    {
        /// <summary>
        /// Gets the name of the machine learning feature.
        /// </summary>
        string Name { get; }
    }
}
