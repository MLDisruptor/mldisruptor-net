using MLDisruptor.NET.PerformancePredictor.Internal.Core;

namespace MLDisruptor.NET.PerformancePredictor.Internal.Trainer
{
    internal class TrainingDataPublisher<T> where T : class
    {
        private readonly RingBufferApi<TrainingEvent<T>> _ringBuffer;
        private long _previousSequence = -1;

        public TrainingDataPublisher(RingBufferApi<TrainingEvent<T>> ringBuffer)
        {
            _ringBuffer = ringBuffer;
        }

        public void PublishTrainingData(T trainingData)
        {
            long sequence = _ringBuffer.Next();
            try
            {
                var trainingEvent = _ringBuffer.Get(sequence);
                trainingEvent.TrainingData = BuildTrainingData(trainingData);
            }
            finally
            {
                _previousSequence = sequence;
                _ringBuffer.Publish(sequence);
            }
        }

        private T[] BuildTrainingData(T trainingData)
        {
            var previousData = _previousSequence != -1
                ? _ringBuffer.Get(_previousSequence).TrainingData
                : [];

            var fullTrainingData = previousData
                .Concat([trainingData])
                .TakeLast(_ringBuffer.BufferSize)
                .ToList();

            return [.. fullTrainingData];
        }
    }
}
