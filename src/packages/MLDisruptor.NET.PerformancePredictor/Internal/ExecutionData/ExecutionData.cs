using Microsoft.ML.Data;

namespace MLDisruptor.NET.PerformancePredictor.Internal.ExecutionData
{
    internal class ExecutionDataBuilder
    {
        private int _messageType;
        private float _messageSize;
        private float _enqueueTime;
        private float _executionTime;
        private float _threadCount;
        private float _ringBufferSize;
        private float _queueDepth;

        public ExecutionDataBuilder WithMessageType(int messageType)
        {
            _messageType = messageType;
            return this;
        }

        public ExecutionDataBuilder WithMessageSize(float messageSize)
        {
            _messageSize = messageSize;
            return this;
        }

        public ExecutionDataBuilder WithEnqueueTime(float enqueueTime)
        {
            _enqueueTime = enqueueTime;
            return this;
        }

        public ExecutionDataBuilder WithExecutionTime(float executionTime)
        {
            _executionTime = executionTime;
            return this;
        }

        public ExecutionDataBuilder WithThreadCount(float threadCount)
        {
            _threadCount = threadCount;
            return this;
        }

        public ExecutionDataBuilder WithRingBufferSize(float ringBufferSize)
        {
            _ringBufferSize = ringBufferSize;
            return this;
        }

        public ExecutionDataBuilder WithQueueDepth(float queueDepth)
        {
            _queueDepth = queueDepth;
            return this;
        }

        public ExecutionData Build()
        {
            return new ExecutionData(
                _messageType,
                _messageSize,
                _enqueueTime,
                _executionTime,
                _threadCount,
                _ringBufferSize,
                _queueDepth);
        }
    }

    internal class ExecutionData(
        int messageType,
        float messageSize,
        float enqueueTime,
        float executionTime,
        float threadCount,
        float ringBufferSize,
        float queueDepth)
    {
        public static ExecutionDataBuilder Builder() => new();

        [LoadColumn(0)] public int MessageType { get; init; } = messageType;
        [LoadColumn(1)] public float MessageSize { get; init; } = messageSize;
        [LoadColumn(2)] public float EnqueueTime { get; init; } = enqueueTime;
        [LoadColumn(3), ColumnName("Label")] public float ExecutionTime { get; init; } = executionTime;
        [LoadColumn(4)] public float ThreadCount { get; init; } = threadCount;
        [LoadColumn(5)] public float RingBufferSize { get; init; } = ringBufferSize;
        [LoadColumn(6)] public float QueueDepth { get; init; } = queueDepth;
    }
}
