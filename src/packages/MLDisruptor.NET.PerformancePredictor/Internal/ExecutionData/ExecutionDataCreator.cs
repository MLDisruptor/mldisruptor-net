using System.Diagnostics;
using System.Runtime.InteropServices;

namespace MLDisruptor.NET.PerformancePredictor.Internal.ExecutionData
{
    internal static class ExecutionDataCreator
    {
        public static ExecutionData Create<T>(T @event, int messageType, long currentSequence, int bufferSize, long executionTime)
        {
            var currentProcess = Process.GetCurrentProcess();
            var threads = currentProcess.Threads;
            var threadCount = threads.Count;

            var queueDepth = currentSequence - bufferSize;
            var messageSize = Marshal.SizeOf(@event);

            return ExecutionData.Builder()
                .WithMessageType(messageType)
                .WithMessageSize(messageSize)
                .WithEnqueueTime(Stopwatch.GetTimestamp())
                .WithExecutionTime(executionTime)
                .WithThreadCount(threadCount)
                .WithRingBufferSize(bufferSize)
                .WithQueueDepth(queueDepth)
                .Build();

        }
    }
}
