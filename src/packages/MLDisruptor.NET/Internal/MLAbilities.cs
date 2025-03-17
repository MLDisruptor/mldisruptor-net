namespace MLDisruptor.NET.Internal
{
    internal class MLAbilities<T> : IMLAbilities
    {
        private readonly IEnumerable<IMLFeature> _features;

        public MLAbilities(FeatureOptions<T> options)
        {
            _features = PluginLoader.LoadPlugins(options);
        }

        public IEnumerable<IMLFeature> Features => _features;
    }
}
