using Microsoft.ML;
using Microsoft.ML.Data;

namespace MLDisruptor.NET.PerformancePredictor.Internal.Core
{
    internal class MLContextApi
    {
        private readonly MLContext _context;

        public MLContextApi()
        {
            _context = new MLContext();
        }

        public TDst Predict<TSrc, TDst>(ITransformer transformer, TSrc data,
            bool ignoreMissingColumns = true, SchemaDefinition inputSchemaDefinition = null, SchemaDefinition outputSchemaDefinition = null)
            where TSrc : class
            where TDst : class, new()
        {
            var predictor = _context.Model.CreatePredictionEngine<TSrc, TDst>(transformer, ignoreMissingColumns, inputSchemaDefinition, outputSchemaDefinition);
            return predictor.Predict(data);
        }

        public ITransformer TrainFastForest<TRow>(IEnumerable<TRow> trainingData, string keyName, IEnumerable<string> messageNames)
            where TRow : class
        {
            IDataView dataView = _context.Data.LoadFromEnumerable(trainingData);

            var pipeline = _context.Transforms.Conversion.MapValueToKey(keyName)
                .Append(_context.Transforms.Concatenate("Features", [.. messageNames]))
                .Append(_context.Regression.Trainers.FastForest());

            return pipeline.Fit(dataView);
        }
    }
}
