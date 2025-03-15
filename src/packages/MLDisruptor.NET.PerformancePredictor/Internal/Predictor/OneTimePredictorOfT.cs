using Microsoft.ML.Data;
using MLDisruptor.NET.PerformancePredictor.Internal.Core;

namespace MLDisruptor.NET.PerformancePredictor.Internal.Predictor
{
    internal class OneTimePredictor<T> where T : class
    {
        private readonly MLContextApi _context;
        private readonly ModelStore _modelHolder;

        public OneTimePredictor(MLContextApi context, ModelStore modelHolder)
        {
            _context = context;
            _modelHolder = modelHolder;
        }

        public float Predict(T input)
        {
            var model = _modelHolder.GetModel();
            if (model == null)
            {
                return -1; // No trained model yet
            }

            var oneTimePrediction = _context.Predict<T, OneTimePrediction>(model, input);
            return oneTimePrediction.Prediction;
        }

        private sealed class OneTimePrediction
        {
            [ColumnName("Score")]
            public float Prediction { get; set; }
        }
    }
}
