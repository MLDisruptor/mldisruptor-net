namespace MLDisruptor.NET.PerformancePredictor.Internal.Predictor
{
    internal class Predictor<TInput> : IPredictor<TInput>
    {
        private readonly IPredictionEngine<TInput> _predictionEngine;

        public Predictor(IPredictionEngine<TInput> predictionEngine)
        {
            _predictionEngine = predictionEngine;
        }

        public float MakePrediction(TInput data, int type)
        {
            return _predictionEngine.Predict(data);
        }
    }
}
