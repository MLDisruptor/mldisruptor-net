using Disruptor;
using MLDisruptor.NET.PerformancePredictor;

namespace MLDisruptor.NET.PerformancePredictor.Tests
{
    public class AdaptiveEventHandler : IValueEventHandler<AdaptableEvent>
    {
        private readonly IPerformancePredictor _predictor;
        private readonly Logger _logger;
        private float _prediction = -1;

        public AdaptiveEventHandler(IPerformancePredictor predictor, Logger logger)
        {
            _predictor = predictor;
            _logger = logger;
        }

        public void OnEvent(ref AdaptableEvent data, long sequence, bool endOfBatch)
        {
            _predictor.Start(sequence);
            ProcessMessage(data);
            var prediction = _predictor.Finish(data, (int)data.MessageType);
            var comparison = _prediction.CompareTo(prediction);
            if (comparison is > 0 or < 0)
            {
                _prediction = prediction;
                _logger.Log(prediction);
            }
        }

        private static void ProcessMessage(AdaptableEvent message)
        {
            Thread.Sleep(message.MessageType == EMessageType.TestShort ? 1 : 1000);
        }
    }
}