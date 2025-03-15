using Disruptor;
using FakeItEasy;

namespace MLDisruptor.NET.PerformancePredictor.Tests
{
    public class APITests
    {
        [Fact]
        public void ShouldProvideBasic_PredictorApi()
        {
            const float expectedPrediction = -1f;

            var fakePredictorFactory = A.Fake<IPredictorFactory<AdaptableEvent>>();
            var fakePredictor = A.Fake<IPredictor<AdaptableEvent>>();
            A.CallTo(() => fakePredictor.MakePrediction(A<AdaptableEvent>.Ignored, A<int>.Ignored)).Returns(expectedPrediction);
            A.CallTo(() => fakePredictorFactory.CreatePredictor()).Returns(fakePredictor);

            var predictor = fakePredictorFactory.CreatePredictor();
            var data = new AdaptableEvent();
            var messageType = 1;
            var prediction = predictor.MakePrediction(data, messageType);

            Assert.Equal(expectedPrediction, prediction);
        }

        [Fact]
        public void ShouldProvideBasic_TrainerApi()
        {
            var fakeTrainerFactory = A.Fake<ITrainerFactory<AdaptableEvent>>();
            var fakeTrainer = A.Fake<ITrainer<AdaptableEvent>>();
            A.CallTo(() => fakeTrainer.Train(A<AdaptableEvent>.Ignored)).DoesNothing();
            A.CallTo(() => fakeTrainerFactory.CreateTrainer()).Returns(fakeTrainer);
            var trainer = fakeTrainerFactory.CreateTrainer();
            var data = new AdaptableEvent();
            trainer.Train(data);
            A.CallTo(() => fakeTrainer.Train(A<AdaptableEvent>.That.IsEqualTo(data))).MustHaveHappened();
        }

        [Fact]
        public async Task GivenAPredictionEngine_ShouldMakePrediction()
        {
            var expectedPrediction = 1f;
            var fakePredictionEngine = A.Fake<IPredictionEngine<AdaptableEvent>>();
            A.CallTo(() => fakePredictionEngine.Predict(A<AdaptableEvent>.Ignored)).Returns(expectedPrediction);
            var disruptor = new MLValueDisruptor<AdaptableEvent>(() => new AdaptableEvent(), 1024);
            var factory = disruptor.ML.CreatePredictorFactory(fakePredictionEngine);
            var taskCompletionSource = new TaskCompletionSource<float>();
            disruptor.HandleEventsWith(new PredictorFactoryHandler(factory, taskCompletionSource));
            var buffer = disruptor.Start();

            var sequence = buffer.Next();
            var @event = buffer[sequence];
            @event.MessageType = EMessageType.TestShort;
            buffer.Publish(sequence);

            var prediction = await taskCompletionSource.Task;

            Assert.Equal(expectedPrediction, prediction);
        }

        [InlineData(1)]
        [InlineData(2)]
        [InlineData(3)]
        [Theory]
        public async Task GivenATrainer_ShouldTrain(int numberOfIterations)
        {
            var fakeModelTrainer = A.Fake<IModelTrainer<AdaptableEvent>>();
            var disruptor = new MLValueDisruptor<AdaptableEvent>(() => new AdaptableEvent(), 8);
            var factory = disruptor.ML.CreateTrainerFactory(fakeModelTrainer);
            disruptor.HandleEventsWith(new TrainerFactoryHandler(factory));
            var buffer = disruptor.Start();

            for(var i = 0; i < numberOfIterations; i++)
            {
                var sequence = buffer.Next();
                var @event = buffer[sequence];
                @event.MessageType = EMessageType.TestShort;
                buffer.Publish(sequence);

                await Task.Delay(100);
            }

            A.CallTo(() => fakeModelTrainer.Train(A<AdaptableEvent>.Ignored)).MustHaveHappened(numberOfIterations, Times.Exactly);
        }
    }

    public class TrainerFactoryHandler : IValueEventHandler<AdaptableEvent>
    {
        private readonly ITrainerFactory<AdaptableEvent> _factory;
        public TrainerFactoryHandler(ITrainerFactory<AdaptableEvent> factory)
        {
            _factory = factory;
        }
        public void OnEvent(ref AdaptableEvent data, long sequence, bool endOfBatch)
        {
            var trainer = _factory.CreateTrainer();
            trainer.Train(data);
        }
    }

    public class PredictorFactoryHandler : IValueEventHandler<AdaptableEvent>
    {
        private readonly IPredictorFactory<AdaptableEvent> _factory;
        private readonly TaskCompletionSource<float> _taskCompletionSource;

        public PredictorFactoryHandler(IPredictorFactory<AdaptableEvent> factory, TaskCompletionSource<float> taskCompletionSource)
        {
            _factory = factory;
            _taskCompletionSource = taskCompletionSource;
        }

        public void OnEvent(ref AdaptableEvent data, long sequence, bool endOfBatch)
        {
            var predictor = _factory.CreatePredictor();
            ProcessMessage(data);
            var prediction = predictor.MakePrediction(data, (int)data.MessageType);
            _taskCompletionSource.SetResult(prediction);
        }

        private static void ProcessMessage(AdaptableEvent message)
        {
            Thread.Sleep(message.MessageType == EMessageType.TestShort ? 1 : 1000);
        }

    }
}
