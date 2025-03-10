namespace MLDisruptor.NET.Tests
{
    public class Logger
    {
        private readonly List<float> _predictions = [];

        public IReadOnlyList<float> Predictions => _predictions;

        public void Log(float prediction)
        {
            _predictions.Add(prediction);
        }
    }
}
