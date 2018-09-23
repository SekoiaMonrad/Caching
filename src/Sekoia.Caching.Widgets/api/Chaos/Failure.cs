namespace Sekoia.WidgetsTester.Api.Chaos
{
    public class Failure
    {
        public FailureTime Time { get; private set; }
        public IFailureStrategy Type { get; private set; }

        public Failure(FailureTime time, IFailureStrategy type)
        {
            Time = time;
            Type = type;
        }
    }
}