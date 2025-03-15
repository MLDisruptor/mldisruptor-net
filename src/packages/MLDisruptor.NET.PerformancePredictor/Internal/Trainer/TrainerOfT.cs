namespace MLDisruptor.NET.PerformancePredictor.Internal.Trainer
{
    internal class Trainer<TTrainingInput> : ITrainer<TTrainingInput>
    {
        private readonly IModelTrainer<TTrainingInput> _trainer;

        public Trainer(IModelTrainer<TTrainingInput> trainer)
        {
            _trainer = trainer;
        }

        public void Train(TTrainingInput data)
        {
            _trainer.Train(data);
        }
    }
}
