using Disruptor;
using Disruptor.Dsl;
using MLDisruptor.NET.Internal;

namespace MLDisruptor.NET
{
    public class MLValueDisruptor<T> : ValueDisruptor<T>
        where T : struct
    {
        private readonly IMLAbilities _ml;

        /// <summary>
        /// Create a new ValueDisruptor using Disruptor.Dsl.SequencerFactory.DefaultWaitStrategy
        /// and Disruptor.Dsl.SequencerFactory.DefaultProducerType.
        /// </summary>
        /// <param name="eventFactory">the factory to create events in the ring buffer</param>
        /// <param name="ringBufferSize">the size of the ring buffer, must be power of 2</param>
        public MLValueDisruptor(Func<T> eventFactory, int ringBufferSize)
            : this(eventFactory, ringBufferSize, TaskScheduler.Default)
        {
        }

        /// <summary>
        /// Create a new ValueDisruptor using Disruptor.Dsl.SequencerFactory.DefaultProducerType.
        /// </summary>
        /// <param name="eventFactory">the factory to create events in the ring buffer</param>
        /// <param name="ringBufferSize">the size of the ring buffer, must be power of 2</param>
        /// <param name="waitStrategy">the wait strategy to use for the ring buffer</param>
        public MLValueDisruptor(Func<T> eventFactory, int ringBufferSize, IWaitStrategy waitStrategy)
            : this(eventFactory, ringBufferSize, TaskScheduler.Default, SequencerFactory.DefaultProducerType, waitStrategy)
        {
        }

        /// <summary>
        /// Create a new ValueDisruptor. Will default to Disruptor.Dsl.SequencerFactory.DefaultWaitStrategy
        /// and Disruptor.Dsl.SequencerFactory.DefaultProducerType.
        /// </summary>
        /// <param name="eventFactory">the factory to create events in the ring buffer</param>
        /// <param name="ringBufferSize">the size of the ring buffer, must be power of 2</param>
        /// <param name="taskScheduler">an System.Threading.Tasks.TaskScheduler to create threads for processors</param>
        public MLValueDisruptor(Func<T> eventFactory, int ringBufferSize, TaskScheduler taskScheduler)
            : this(eventFactory, ringBufferSize, taskScheduler, SequencerFactory.DefaultProducerType, SequencerFactory.DefaultWaitStrategy())
        {
        }

        /// <summary>
        /// Create a new ValueDisruptor.
        /// </summary>
        /// <param name="eventFactory">the factory to create events in the ring buffer</param>
        /// <param name="ringBufferSize">the size of the ring buffer, must be power of 2</param>
        /// <param name="taskScheduler">an System.Threading.Tasks.TaskScheduler to create threads for processors</param>
        /// <param name="producerType">the claim strategy to use for the ring buffer</param>
        /// <param name="waitStrategy">the wait strategy to use for the ring buffer</param>
        public MLValueDisruptor(Func<T> eventFactory, int ringBufferSize, TaskScheduler taskScheduler, ProducerType producerType, IWaitStrategy waitStrategy)
            : base(eventFactory, ringBufferSize, taskScheduler, producerType, waitStrategy)
        {
            _ml = new MLAbilities<T>(eventFactory, ringBufferSize, taskScheduler, producerType, waitStrategy);
        }

        /// <summary>
        /// Get the ML abilities.
        /// </summary>
        public IMLAbilities ML => _ml;

    }
}
