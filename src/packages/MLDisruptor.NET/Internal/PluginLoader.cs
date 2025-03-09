using Disruptor;
using Disruptor.Dsl;

namespace MLDisruptor.NET.Internal
{
    internal static class PluginLoader
    {
        public static IEnumerable<IMLFeature> LoadPlugins<T>(Func<T> eventFactory, int ringBufferSize, TaskScheduler taskScheduler, ProducerType producerType, IWaitStrategy waitStrategy)
        {
            var featureType = typeof(IMLFeature);
            var assemblies = AppDomain.CurrentDomain.GetAssemblies();
            var features = new List<IMLFeature>();

            foreach (var assembly in assemblies)
            {
                var types = assembly.GetTypes().Where(t => featureType.IsAssignableFrom(t) && !t.IsInterface && !t.IsAbstract);
                foreach (var type in types)
                {
                    if (Activator.CreateInstance(type) is IMLFeature feature)
                    {
                        feature.Initialize(eventFactory, ringBufferSize, taskScheduler, producerType, waitStrategy);
                        features.Add(feature);
                    }
                }
            }

            return features;
        }
    }
}
