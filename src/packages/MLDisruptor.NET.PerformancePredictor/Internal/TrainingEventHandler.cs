using Disruptor;
using Microsoft.ML;

namespace MLDisruptor.NET.PerformancePredictor.Internal
{
    internal class TrainingEventHandler : IEventHandler<TrainingEvent>
    {
        private readonly MLContext _mlContext = new();
        private readonly ModelStore _modelHolder;
        private int _eventCounter = 0;

        public TrainingEventHandler(ModelStore modelHolder)
        {
            _modelHolder = modelHolder;
        }

        public void OnEvent(TrainingEvent trainingEvent, long sequence, bool endOfBatch)
        {
            _eventCounter++;

            if (_eventCounter > 1 && _eventCounter % 100 != 0)
            {
                return; // Only retrain every 100 events
            }

            if (_eventCounter > 1 && trainingEvent.DisruptorExecutionData.Count < 100)
            {
                return; // Avoid training on too little data
            }

            IDataView dataView = _mlContext.Data.LoadFromEnumerable(trainingEvent.DisruptorExecutionData);

            var pipeline = _mlContext.Transforms.Conversion.MapValueToKey("MessageType")
                .Append(_mlContext.Transforms.Concatenate("Features", "MessageSize", "ThreadCount", "RingBufferSize", "QueueDepth"))
                .Append(_mlContext.Regression.Trainers.FastForest());

            var newModel = pipeline.Fit(dataView);

            _modelHolder.UpdateModel(newModel); // Atomic model swap

            _eventCounter = _eventCounter > 1 ? 0 : _eventCounter;
        }
    }
}
