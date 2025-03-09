using Disruptor;

namespace MLDisruptor.NET.PerformancePredictor.Internal
{
    internal class TrainingDataPublisher
    {
        private readonly RingBuffer<TrainingEvent> _ringBuffer;
        private long _previousSequence = -1;

        public TrainingDataPublisher(RingBuffer<TrainingEvent> ringBuffer)
        {
            _ringBuffer = ringBuffer;
        }

        public void PublishTrainingData(ExecutionData executionData)
        {
            List<ExecutionData> trainingData = BuildTrainingData(executionData);

            long sequence = _ringBuffer.Next();
            try
            {
                var trainingEvent = _ringBuffer[sequence];
                trainingEvent.DisruptorExecutionData = trainingData;
            }
            finally
            {
                _previousSequence = sequence;
                _ringBuffer.Publish(sequence);
            }
        }

        private List<ExecutionData> BuildTrainingData(ExecutionData executionData)
        {
            var previousData = _previousSequence != -1
                ? _ringBuffer[_previousSequence].DisruptorExecutionData
                : [];

            var trainingData = new List<ExecutionData> { executionData }
                .Concat(previousData)
                .TakeLast(_ringBuffer.BufferSize)
                .ToList();

            return trainingData;
        }
    }
}
