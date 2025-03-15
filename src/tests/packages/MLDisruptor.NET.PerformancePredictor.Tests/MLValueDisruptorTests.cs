namespace MLDisruptor.NET.PerformancePredictor.Tests
{
    public class MLValueDisruptorTests
    {
        [Fact]
        public void ShouldIncludePerformancePredictorFeature()
        {
            var disruptor = new MLValueDisruptor<AdaptableEvent>(() => new AdaptableEvent(), 1024, TaskScheduler.Default);
            var predictor = disruptor.ML.CreatePerformancePredictor<AdaptableEvent>();
            var features = disruptor.ML.Features;

            Assert.NotNull(predictor);
            Assert.Contains(features, f => f.Name == "PerformancePredictorFeature");
        }
    }
}