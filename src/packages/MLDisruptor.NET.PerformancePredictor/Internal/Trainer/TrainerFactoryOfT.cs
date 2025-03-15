namespace MLDisruptor.NET.PerformancePredictor.Internal.Trainer
{
    internal class TrainerFactory<TTrainingInput> : ITrainerFactory<TTrainingInput>
    {
        private readonly IModelTrainer<TTrainingInput> _trainer;

        public TrainerFactory(IModelTrainer<TTrainingInput> trainer)
        {
            _trainer = trainer;
        }

        public ITrainer<TTrainingInput> CreateTrainer()
        {
            return new Trainer<TTrainingInput>(_trainer);
        }
    }
}
