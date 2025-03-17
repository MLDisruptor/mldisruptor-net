namespace MLDisruptor.NET.Internal
{
    internal static class PluginLoader
    {
        public static IEnumerable<IMLFeature> LoadPlugins<T>(FeatureOptions<T> options)
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
                        feature.Initialize(options);
                        features.Add(feature);
                    }
                }
            }

            return features;
        }
    }
}
