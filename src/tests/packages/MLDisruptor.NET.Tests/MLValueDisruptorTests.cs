namespace MLDisruptor.NET.Tests
{
    public class MLValueDisruptorTests
    {
        [Fact]
        public void ShouldInitializeEmptyMLFeatures()
        {
            var bufferSize = 1024;
            var disruptor = new MLValueDisruptor<AdaptableEvent>(() => new AdaptableEvent(), bufferSize, TaskScheduler.Default);
            Assert.Empty(disruptor.ML.Features);
        }
    }
}