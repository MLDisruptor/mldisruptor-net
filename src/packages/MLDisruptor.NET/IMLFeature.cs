using Disruptor;
using Disruptor.Dsl;

namespace MLDisruptor.NET
{
    /// <summary>
    /// Represents a machine learning feature with initialization capabilities.
    /// </summary>
    public interface IMLFeature : IMLFeatureWithName
    {
        /// <summary>
        /// Initializes the machine learning feature with the specified parameters.
        /// </summary>
        /// <typeparam name="T">The type of event used by the event factory.</typeparam>
        /// <param name="eventFactory">A factory function to create instances of the event type <typeparamref name="T"/>.</param>
        /// <param name="ringBufferSize">The size of the ring buffer.</param>
        /// <param name="taskScheduler">The task scheduler to use for scheduling tasks.</param>
        /// <param name="producerType">The type of producer (single or multi) for the disruptor.</param>
        /// <param name="waitStrategy">The wait strategy to use for the disruptor.</param>
        void Initialize<T>(Func<T> eventFactory, int ringBufferSize, TaskScheduler taskScheduler, ProducerType producerType, IWaitStrategy waitStrategy);

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
