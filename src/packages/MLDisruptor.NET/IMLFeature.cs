using Disruptor;
using Disruptor.Dsl;

namespace MLDisruptor.NET
{
    public interface IMLFeature
    {
        string Name { get; }
        void Initialize<T>(Func<T> eventFactory, int ringBufferSize, TaskScheduler taskScheduler, ProducerType producerType, IWaitStrategy waitStrategy);
    }
}
