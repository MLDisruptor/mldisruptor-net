namespace MLDisruptor.NET.PerformancePredictor.Internal.Predictor
{
    internal class PredictionEngine<TInput> : IPredictionEngine<TInput>
        where TInput : class
    {
        private readonly OneTimePredictor<TInput> _predictor;

        public PredictionEngine(OneTimePredictor<TInput> oneTimePredictor)
        {
            _predictor = oneTimePredictor;
        }
        public float Predict(TInput data)
        {
            return _predictor.Predict(data);
        }
    }
}
