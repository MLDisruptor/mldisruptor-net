using MLDisruptor.NET.PerformancePredictor.Internal.Core;
using MLDisruptor.NET.PerformancePredictor.Internal.ExecutionData;

namespace MLDisruptor.NET.PerformancePredictor.Internal.Feature
{
    internal class ExecutionPerformancePredictor<TEvent> : IExecutionPerformancePredictor<TEvent>
    {
        private readonly MLDisruptorPredictor<ExecutionData.ExecutionData, ExecutionDataConfiguration<TEvent>> _mlDisruptorPredictor;
        private readonly StopwatchHandler _stopwatchHandler = new();
        private long currentSequence = -1;
        private readonly int _bufferSize;

        public ExecutionPerformancePredictor(ModelStore modelHolder, int bufferSize, string keyName)
        {
            _bufferSize = bufferSize;
            var trainingDataBuilder = new ExecutionDataBuilder<TEvent>();
            _mlDisruptorPredictor = new MLDisruptorPredictor<ExecutionData.ExecutionData, ExecutionDataConfiguration<TEvent>>(trainingDataBuilder, modelHolder, bufferSize, keyName);
        }

        public int BufferSize => _bufferSize;

        public void Start(long sequence)
        {
            currentSequence = sequence;
            _stopwatchHandler.Start();
        }

        public float Finish(TEvent @event, int messageType)
        {
            var executionTime = _stopwatchHandler.Stop();
            IDataProvider<ExecutionDataConfiguration<TEvent>> dataProvider = new ExecutionDataConfigurationProvider<TEvent>(@event, messageType, currentSequence, BufferSize, executionTime);
            var trainingData = _mlDisruptorPredictor.BuildTrainingData(dataProvider);
            _mlDisruptorPredictor.Train(trainingData);
            return _mlDisruptorPredictor.Predict(trainingData, messageType);
        }
    }
}
