import { EventEmitter } from "events";

class EventStream extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(100); // Increased limit for multiple subscribers
    }
}

const eventStream = new EventStream();

export default eventStream;
