using Microsoft.ML;
using Microsoft.ML.Data;

namespace MLDisruptor.NET.PerformancePredictor.Internal.Core
{
    internal class PredictOptions<TSrc> where TSrc : class
    {
        public ITransformer Transformer { get; set; }
        public TSrc Data { get; set; }
        public bool IgnoreMissingColumns { get; set; } = true;
        public SchemaDefinition? InputSchemaDefinition { get; set; }
        public SchemaDefinition? OutputSchemaDefinition { get; set; }
        public PredictOptions(ITransformer transformer, TSrc data)
        {
            Transformer = transformer;
            Data = data;
        }
    }

    internal class MLContextApi
    {
        private readonly MLContext _context;

        public MLContextApi()
        {
            _context = new MLContext();
        }

        public TDst Predict<TSrc, TDst>(PredictOptions<TSrc> options)
            where TSrc : class
            where TDst : class, new()
        {
            var predictor = _context.Model.CreatePredictionEngine<TSrc, TDst>(
                options.Transformer,
                options.IgnoreMissingColumns,
                options.InputSchemaDefinition,
                options.OutputSchemaDefinition);
            return predictor.Predict(options.Data);
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
