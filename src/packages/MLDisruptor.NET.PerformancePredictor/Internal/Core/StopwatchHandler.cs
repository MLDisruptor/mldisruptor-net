using System.Diagnostics;

namespace MLDisruptor.NET.PerformancePredictor.Internal.Core
{
    internal class StopwatchHandler
    {
        private readonly Stopwatch _stopwatch = new();

        public void Start()
        {
            _stopwatch.Restart();
        }

        public long Stop()
        {
            _stopwatch.Stop();
            return _stopwatch.ElapsedMilliseconds;
        }
    }
}
