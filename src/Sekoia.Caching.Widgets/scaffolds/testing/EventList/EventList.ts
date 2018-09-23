import evnts = require("compass/events");

class EventList {
    public compositionComplete()
    {
        // start with a few events
        this.sendWithBody();
        this.sendWithoutBody();
        this.sendWithBody();
        this.sendWithoutBody();
    }

    public sendWithBody()
    {
        evnts.build()
            .withId("some-module/some-event-with-body")
            .addPayload("a-number", Math.random() * 1000000)
            .addPayload("a-string", new Date().toISOString() + "-" + Math.random())
            .addPayload("a-date", new Date())
            .addPayload("an-object", evnts)
            .publish();
    }

    public sendWithoutBody()
    {
        evnts.build()
            .withId("some-module/some-event-with-no-body")
            .publish();
    }
}

export = EventList;