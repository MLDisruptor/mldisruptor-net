namespace MLDisruptor.NET.PerformancePredictor.Internal.ExecutionData
{
    internal class ExecutionDataBuilder<TEvent> : ITrainingDataBuilder<ExecutionData, ExecutionDataConfiguration<TEvent>>
    {
        public ExecutionData Build(IDataProvider<ExecutionDataConfiguration<TEvent>> dataProvider)
        {
            var data = dataProvider.GetData();
            var executionData = ExecutionDataCreator
                .Create(
                    data.Event,
                    data.MessageType,
                    data.CurrentSequence,
                    data.BufferSize,
                    data.ExecutionTime);

            return executionData;
        }
    }
}
