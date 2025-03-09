namespace MLDisruptor.NET.PerformancePredictor
{
    public interface IPerformancePredictor
    {
        /// <summary>
        /// Begin measuring the time it takes to process an event.
        /// </summary>
        /// <param name="sequence">The current claimed ring buffer sequence.</param>
        void Start(long sequence);
        /// <summary>
        /// Finish measuring the time it takes to process an event.
        /// </summary>
        /// <typeparam name="T">The type of the event.</typeparam>
        /// <param name="event">The instance of the event.</param>
        /// <param name="messageType">A user defined message type indicator.</param>
        /// <returns>A float indicating the predicted execution time.</returns>
        float Finish<T>(T @event, int messageType);

        /// <summary>
        /// The size of the ring buffer.
        /// </summary>
        int BufferSize { get; }
    }
}
