using Microsoft.ML.Data;

namespace MLDisruptor.NET.PerformancePredictor.Internal.ExecutionData
{
    internal class ExecutionData
    {
        private ExecutionData(int messageType, float messageSize, float enqueueTime, float executionTime, float threadCount, float ringBufferSize, float queueDepth)
        {
            MessageType = messageType;
            MessageSize = messageSize;
            EnqueueTime = enqueueTime;
            ExecutionTime = executionTime;
            ThreadCount = threadCount;
            RingBufferSize = ringBufferSize;
            QueueDepth = queueDepth;
        }

        internal static ExecutionData Create(int messageType, float messageSize, float enqueueTime, float executionTime, float threadCount, float ringBufferSize, float queueDepth)
        {
            return new ExecutionData(messageType, messageSize, enqueueTime, executionTime, threadCount, ringBufferSize, queueDepth);
        }

        [LoadColumn(0)] public int MessageType { get; init; }
        [LoadColumn(1)] public float MessageSize { get; init; }
        [LoadColumn(2)] public float EnqueueTime { get; init; }
        [LoadColumn(3), ColumnName("Label")] public float ExecutionTime { get; init; }  // Target variable
        [LoadColumn(4)] public float ThreadCount { get; init; }
        [LoadColumn(5)] public float RingBufferSize { get; init; }
        [LoadColumn(6)] public float QueueDepth { get; init; }
    }
}
