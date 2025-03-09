using Microsoft.ML;
using Microsoft.ML.Data;

namespace MLDisruptor.NET.PerformancePredictor.Internal
{
    internal class ExecutionTimePredictor
    {
        private readonly MLContext _mlContext;
        private readonly ModelStore _modelHolder;

        public ExecutionTimePredictor(MLContext mlContext, ModelStore modelHolder)
        {
            _mlContext = mlContext;
            _modelHolder = modelHolder;
        }

        public float PredictExecutionTime(ExecutionData input)
        {
            var model = _modelHolder.GetModel();
            if (model == null)
            {
                return -1; // No trained model yet
            }

            var predictor = _mlContext.Model.CreatePredictionEngine<ExecutionData, ExecutionPrediction>(model);
            return predictor.Predict(input).ExecutionTime;
        }

        private sealed class ExecutionPrediction
        {
            [ColumnName("Score")]
            public float ExecutionTime { get; set; }
        }
    }
}
