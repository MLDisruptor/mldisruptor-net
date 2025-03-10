namespace MLDisruptor.NET.PerformancePredictor.Tests
{
    public struct AdaptableEvent()
    {
        public EMessageType MessageType { get; set; }
        public int MessageSize { get; set; }
    }
}
