using Disruptor;
using Disruptor.Dsl;
using MLDisruptor.NET.PerformancePredictor.Internal;

namespace MLDisruptor.NET.PerformancePredictor
{
    internal class PerformancePredictorFeature : IMLFeature
    {
        // not null after initialization by Plugin Loader.
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.
        private DisruptorPerformancePredictor _performancePredictor;
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.

        public string Name => nameof(PerformancePredictorFeature);

        public void Initialize<T>(Func<T> eventFactory, int ringBufferSize, TaskScheduler taskScheduler, ProducerType producerType, IWaitStrategy waitStrategy)
        {
            var store = ModelStore.Create();
            _performancePredictor = new DisruptorPerformancePredictor(store, ringBufferSize);
        }

        public IPerformancePredictor PerformancePredictor => _performancePredictor;
    }
}
