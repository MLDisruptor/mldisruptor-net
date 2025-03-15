namespace MLDisruptor.NET.PerformancePredictor.Internal.Trainer
{
    internal class ModelTrainer<TInput> : IModelTrainer<TInput>
        where TInput : class
    {
        private readonly TrainingDataPublisher<TInput> _trainingDataPublisher;
        public ModelTrainer(TrainingDataPublisher<TInput> trainingDataPublisher)
        {
            _trainingDataPublisher = trainingDataPublisher;
        }
        public void Train(TInput data)
        {
            _trainingDataPublisher.PublishTrainingData(data);
        }
    }
}
