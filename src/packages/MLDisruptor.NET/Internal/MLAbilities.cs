using Disruptor;
using Disruptor.Dsl;

namespace MLDisruptor.NET.Internal
{
    internal class MLAbilities<T> : IMLAbilities
    {
        private readonly IEnumerable<IMLFeature> _features;

        public MLAbilities(Func<T> eventFactory, int ringBufferSize, TaskScheduler taskScheduler, ProducerType producerType, IWaitStrategy waitStrategy)
        {
            _features = PluginLoader.LoadPlugins(eventFactory, ringBufferSize, taskScheduler, producerType, waitStrategy);
        }

        public IEnumerable<IMLFeature> Features => _features;
    }
}
