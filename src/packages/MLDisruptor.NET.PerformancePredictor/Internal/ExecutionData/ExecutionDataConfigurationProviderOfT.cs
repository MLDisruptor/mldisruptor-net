namespace MLDisruptor.NET.PerformancePredictor.Internal.ExecutionData
{
    internal class ExecutionDataConfigurationProvider<TEvent> : IDataProvider<ExecutionDataConfiguration<TEvent>>
    {
        private readonly ExecutionDataConfiguration<TEvent> _data;

        public ExecutionDataConfigurationProvider(TEvent @event, int messageType, long currentSequence, int bufferSize, long executionTime)
        {
            _data = new ExecutionDataConfiguration<TEvent>(@event, messageType, currentSequence, bufferSize, executionTime);
        }

        public ExecutionDataConfiguration<TEvent> GetData()
        {
            return _data;
        }
    }
}
