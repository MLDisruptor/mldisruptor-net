using Disruptor.Dsl;
using Microsoft.ML;

namespace MLDisruptor.NET.PerformancePredictor.Internal
{
    internal class DisruptorPerformancePredictor : IPerformancePredictor
    {
        private readonly Disruptor<TrainingEvent> _trainingDisruptor;
        private readonly TrainingDataPublisher _publisher;
        private readonly ExecutionTimePredictor _predictor;
        private readonly int _ringBufferSize;

        private readonly StopwatchHandler _stopwatch = new();
        private long _currentSequence = -1;

        public int BufferSize => _ringBufferSize;

        public DisruptorPerformancePredictor(
            ModelStore modelHolder, int bufferSize)
        {
            var mlContext = new MLContext();
            _predictor = new ExecutionTimePredictor(mlContext, modelHolder);
            _ringBufferSize = bufferSize;

            _trainingDisruptor = new Disruptor<TrainingEvent>(
                () => new TrainingEvent(),
                BufferSize,
                TaskScheduler.Default);
            _trainingDisruptor.HandleEventsWith(
                new TrainingEventHandler(modelHolder));
            var ringBuffer = _trainingDisruptor.Start();
            _publisher = new TrainingDataPublisher(ringBuffer);
        }

        public void Start(long sequence)
        {
            _currentSequence = sequence;
            _stopwatch.Start();
        }

        public float Finish<T>(T @event, int messageType)
        {
            var executionTime = _stopwatch.Stop();
            var executionData = ExecutionDataCreator
                .Create(
                    @event,
                    messageType,
                    _currentSequence,
                    BufferSize,
                    executionTime);

            _publisher.PublishTrainingData(executionData);

            float predictedTime = _predictor.PredictExecutionTime(executionData);

            return predictedTime;
        }

    }
}
