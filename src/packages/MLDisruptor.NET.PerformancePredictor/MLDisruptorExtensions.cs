using MLDisruptor.NET.PerformancePredictor.Internal.Core;
using MLDisruptor.NET.PerformancePredictor.Internal.ExecutionData;
using MLDisruptor.NET.PerformancePredictor.Internal.Feature;
using MLDisruptor.NET.PerformancePredictor.Internal.Predictor;
using MLDisruptor.NET.PerformancePredictor.Internal.Trainer;

namespace MLDisruptor.NET.PerformancePredictor
{
    public static class MLDisruptorExtensions
    {
        /// <summary>
        /// Creates a trainer factory using the specified model trainer.
        /// </summary>
        /// <typeparam name="T">The type of training input data used by the model trainer.</typeparam>
        /// <param name="ml">The machine learning abilities used to create the trainer factory.</param>
        /// <param name="trainer">The model trainer used to train the model.</param>
        /// <returns>An instance of <see cref="ITrainerFactory{T}"/>.</returns>
        public static ITrainerFactory<T> CreateTrainerFactory<T>(this IMLAbilities ml, IModelTrainer<T> trainer)
        {
            return new TrainerFactory<T>(trainer);
        }

        /// <summary>
        /// Creates a predictor factory using the specified prediction engine.
        /// </summary>
        /// <typeparam name="T">The type of input data used by the prediction engine.</typeparam>
        /// <param name="ml">The machine learning abilities used to create the predictor factory.</param>
        /// <param name="predictionEngine">The prediction engine used to make predictions.</param>
        /// <returns>An instance of <see cref="IPredictorFactory{T}"/>.</returns>
        public static IPredictorFactory<T> CreatePredictorFactory<T>(this IMLAbilities ml, IPredictionEngine<T> predictionEngine)
        {
            return new PredictorFactory<T>(predictionEngine);
        }

        /// <summary>
        /// Creates an execution performance predictor.
        /// </summary>
        /// <typeparam name="TEvent">The type of event for which the performance is predicted.</typeparam>
        /// <param name="ml">The machine learning abilities used to create the performance predictor.</param>
        /// <returns>An instance of <see cref="IExecutionPerformancePredictor{TEvent}"/>.</returns>
        public static IExecutionPerformancePredictor<TEvent> CreatePerformancePredictor<TEvent>(this IMLAbilities ml)
        {
            var feature = ml.Features.First(x => x.Name == nameof(PerformancePredictorFeature));
            var instance = (PerformancePredictorFeature)feature;
            var ringBufferSize = instance.RingBufferSize;
            var modelStore = ModelStore.Create();
            return new ExecutionPerformancePredictor<TEvent>(modelStore, ringBufferSize, nameof(ExecutionData.MessageType));
        }
    }
}
