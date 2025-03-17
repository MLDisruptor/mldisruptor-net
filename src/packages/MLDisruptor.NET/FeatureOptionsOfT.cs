using Disruptor;
using Disruptor.Dsl;

namespace MLDisruptor.NET
{
    public class FeatureOptions<T>(Func<T> eventFactory, int ringBufferSize, TaskScheduler taskScheduler, ProducerType producerType, IWaitStrategy waitStrategy)
    {
        public Func<T> EventFactory { get; set; } = eventFactory;
        public int RingBufferSize { get; set; } = ringBufferSize;
        public TaskScheduler TaskScheduler { get; set; } = taskScheduler;
        public ProducerType ProducerType { get; set; } = producerType;
        public IWaitStrategy WaitStrategy { get; set; } = waitStrategy;
    }
}
