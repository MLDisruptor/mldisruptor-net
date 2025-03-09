namespace MLDisruptor.NET.PerformancePredictor
{
    public static class MLDisruptorExtensions
    {
        public static IPerformancePredictor GetPerformancePredictor(this IMLAbilities ml)
        {
            var feature = ml.Features.First(x => x.Name == nameof(PerformancePredictorFeature));
            return ((PerformancePredictorFeature)feature).PerformancePredictor;
        }
    }
}
