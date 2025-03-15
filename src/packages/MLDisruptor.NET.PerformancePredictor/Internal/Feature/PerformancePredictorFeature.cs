using Disruptor;
using Disruptor.Dsl;

namespace MLDisruptor.NET.PerformancePredictor.Internal.Feature
{
    internal class PerformancePredictorFeature : IMLFeature
    {
        // not null after initialization by Plugin Loader.
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.
        private int _ringBufferSize;
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.

        public string Name => nameof(PerformancePredictorFeature);

        public void Initialize<T>(Func<T> eventFactory, int ringBufferSize, TaskScheduler taskScheduler, ProducerType producerType, IWaitStrategy waitStrategy)
        {
            _ringBufferSize = ringBufferSize;
        }

        public int RingBufferSize => _ringBufferSize;
    }
}
