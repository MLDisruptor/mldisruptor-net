﻿namespace MLDisruptor.NET.PerformancePredictor.Internal.Feature
{
    internal class PerformancePredictorFeature : IMLFeature
    {
        // not null after initialization by Plugin Loader.
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.
        private int _ringBufferSize;
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.

        public string Name => nameof(PerformancePredictorFeature);

        public void Initialize<T>(FeatureOptions<T> options)
        {
            _ringBufferSize = options.RingBufferSize;
        }

        public int RingBufferSize => _ringBufferSize;
    }
}
