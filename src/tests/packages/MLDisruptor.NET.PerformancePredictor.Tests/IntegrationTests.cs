using MLDisruptor.NET.Tests;

namespace MLDisruptor.NET.PerformancePredictor.Tests
{
    public class IntegrationTests
    {
        [Fact]
        public void ShouldGatherPredictions()
        {
            // run the adaptable event handler to gather training data and make predictions
            var bufferSize = 1024;
            var logger = new Logger();
            var disruptor = new MLValueDisruptor<AdaptableEvent>(() => new AdaptableEvent(), bufferSize, TaskScheduler.Default);
            var predictor = disruptor.ML.GetPerformancePredictor();
            disruptor.HandleEventsWith(new AdaptiveEventHandler(predictor, logger));
            var _ringBuffer = disruptor.Start();

            int numMessages = 1000;

            // Simulate 500 message events
            for (int i = 0; i < numMessages; i++)
            {
                long sequence = _ringBuffer.Next();
                try
                {
                    var data = _ringBuffer[sequence];
                    data.MessageType = i % 2 == 0 ? EMessageType.TestShort : EMessageType.TestLong;
                    data.MessageSize = 8;
                }
                finally
                {
                    _ringBuffer.Publish(sequence);
                }
            }

            Thread.Sleep(20000);

            Assert.NotEmpty(logger.Predictions);
        }
    }
}