namespace MLDisruptor.NET.PerformancePredictor.Internal.Predictor
{
    internal class PredictorFactory<TInput> : IPredictorFactory<TInput>
    {
        private readonly IPredictionEngine<TInput> _predictionEngine;

        public PredictorFactory(IPredictionEngine<TInput> predictionEngine)
        {
            _predictionEngine = predictionEngine;
        }

        public IPredictor<TInput> CreatePredictor()
        {
            return new Predictor<TInput>(_predictionEngine);
        }
    }
}
