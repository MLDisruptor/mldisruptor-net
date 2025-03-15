using Disruptor;
using MLDisruptor.NET.PerformancePredictor.Internal.Core;

namespace MLDisruptor.NET.PerformancePredictor.Internal.Trainer
{
    internal class TrainingEventHandler<T> : IEventHandler<TrainingEvent<T>>
        where T : class
    {
        private readonly MLContextApi _context = new();
        private readonly ModelStore _modelHolder;
        private readonly List<string> _messageNames;
        private readonly string _keyName;
        private int _eventCounter = 0;

        public TrainingEventHandler(ModelStore modelHolder, string keyName)
        {
            _messageNames = [.. typeof(T).GetMessageNames(keyName)];
            _modelHolder = modelHolder;
            _keyName = keyName;
        }

        public void OnEvent(TrainingEvent<T> trainingEvent, long sequence, bool endOfBatch)
        {
            _eventCounter++;

            if (_eventCounter > 1 && _eventCounter % 100 != 0)
            {
                return; // Only retrain every 100 events
            }

            if (_eventCounter > 1 && trainingEvent.TrainingData.Length < 100)
            {
                return; // Avoid training on too little data
            }

            var newModel = _context.TrainFastForest(trainingEvent.TrainingData, _keyName, _messageNames);

            _modelHolder.UpdateModel(newModel); // Atomic model swap

            _eventCounter = _eventCounter > 1 ? 0 : _eventCounter;
        }
    }
}
