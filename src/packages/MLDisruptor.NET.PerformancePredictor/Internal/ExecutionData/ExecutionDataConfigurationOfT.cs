namespace MLDisruptor.NET.PerformancePredictor.Internal.ExecutionData
{
    internal readonly record struct ExecutionDataConfiguration<TEvent>(TEvent Event, int MessageType, long CurrentSequence, int BufferSize, long ExecutionTime);
}
