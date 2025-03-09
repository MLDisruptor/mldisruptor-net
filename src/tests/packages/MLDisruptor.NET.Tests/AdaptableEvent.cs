namespace MLDisruptor.NET.Tests
{
    public struct AdaptableEvent()
    {
        public EMessageType MessageType { get; set; }
        public int MessageSize { get; set; }
    }
}
