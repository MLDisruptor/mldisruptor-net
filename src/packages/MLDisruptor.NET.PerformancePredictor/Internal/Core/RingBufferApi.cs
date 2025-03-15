using Disruptor;

namespace MLDisruptor.NET.PerformancePredictor.Internal.Core
{
    internal class RingBufferApi<T>
        where T : class
    {
        private readonly RingBuffer<T> _ringBuffer;

        public RingBufferApi(RingBuffer<T> ringBuffer)
        {
            _ringBuffer = ringBuffer;
        }

        public long Next()
        {
            return _ringBuffer.Next();
        }

        public void Publish(long sequence)
        {
            _ringBuffer.Publish(sequence);
        }

        public T Get(long sequence)
        {
            return _ringBuffer[sequence];
        }

        public int BufferSize => _ringBuffer.BufferSize;
    }
}
