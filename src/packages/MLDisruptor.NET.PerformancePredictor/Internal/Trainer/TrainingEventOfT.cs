namespace MLDisruptor.NET.PerformancePredictor.Internal.Trainer
{
    internal class TrainingEvent<T>(T[] trainingData) where T : class
    {
        public T[] TrainingData { get; set; } = trainingData;
    }
}
