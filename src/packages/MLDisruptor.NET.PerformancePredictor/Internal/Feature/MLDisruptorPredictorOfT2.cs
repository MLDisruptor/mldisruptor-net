using Disruptor.Dsl;
using MLDisruptor.NET.PerformancePredictor.Internal.Core;
using MLDisruptor.NET.PerformancePredictor.Internal.Predictor;
using MLDisruptor.NET.PerformancePredictor.Internal.Trainer;

namespace MLDisruptor.NET.PerformancePredictor.Internal.Feature
{
    internal class MLDisruptorPredictor<TTrainingData, TConfiguration>
        where TTrainingData : class
    {
        private readonly Disruptor<TrainingEvent<TTrainingData>> _trainingDisruptor;
        private readonly ITrainingDataBuilder<TTrainingData, TConfiguration> _trainingDataBuilder;
        private readonly ITrainer<TTrainingData> _trainer;
        private readonly IPredictor<TTrainingData> _predictor;

        public MLDisruptorPredictor(
            ITrainingDataBuilder<TTrainingData, TConfiguration> trainingDataBuilder,
            ModelStore modelHolder,
            int bufferSize,
            string keyName)
        {
            _trainingDataBuilder = trainingDataBuilder;
            var predictorFactory = GetPredictorFactory(modelHolder);
            _predictor = predictorFactory.CreatePredictor();

            _trainingDisruptor = new Disruptor<TrainingEvent<TTrainingData>>(
                () => new TrainingEvent<TTrainingData>([]),
                bufferSize,
                TaskScheduler.Default);
            _trainingDisruptor.HandleEventsWith(
                new TrainingEventHandler<TTrainingData>(modelHolder, keyName));

            var ringBuffer = _trainingDisruptor.Start();
            var ringBufferApi = new RingBufferApi<TrainingEvent<TTrainingData>>(ringBuffer);
            var trainerFactory = GetTrainerFactory(ringBufferApi);
            _trainer = trainerFactory.CreateTrainer();
        }

        private static PredictorFactory<TTrainingData> GetPredictorFactory(ModelStore modelHolder)
        {
            var mlContextApi = new MLContextApi();
            var oneTimePredictor = new OneTimePredictor<TTrainingData>(mlContextApi, modelHolder);
            var predictionEngine = new PredictionEngine<TTrainingData>(oneTimePredictor);
            return new PredictorFactory<TTrainingData>(predictionEngine);
        }

        private static TrainerFactory<TTrainingData> GetTrainerFactory(RingBufferApi<TrainingEvent<TTrainingData>> ringBuffer)
        {
            var trainingPublisher = new TrainingDataPublisher<TTrainingData>(ringBuffer);
            var modelTrainer = new ModelTrainer<TTrainingData>(trainingPublisher);
            return new TrainerFactory<TTrainingData>(modelTrainer);
        }

        public TTrainingData BuildTrainingData(IDataProvider<TConfiguration> dataProvider)
        {
            return _trainingDataBuilder.Build(dataProvider);
        }

        public void Train(TTrainingData trainingData)
        {
            _trainer.Train(trainingData);
        }

        public float Predict(TTrainingData trainingData, int messageType)
        {
            return _predictor.MakePrediction(trainingData, messageType);
        }

    }
}
