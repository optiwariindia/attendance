class EventStream {
    constructor() {
        this.source = null;
        this.listeners = new Map(); // Map<eventType, Map<userCallback, wrappedCallback>>
        this.serverTime = null;
    }

    connect(url = '/api/v1/events') {
        if (this.source) return;

        this.source = new EventSource(url, { withCredentials: true });

        // Internal sync listeners
        this.source.addEventListener('connected', (e) => {
            try {
                const data = JSON.parse(e.data);
                this.serverTime = new Date(data.serverTime);
                console.log('SSE Connected');
            } catch (err) {}
        });

        this.source.addEventListener('tick', (e) => {
            try {
                const data = JSON.parse(e.data);
                this.serverTime = new Date(data.serverTime);
            } catch (err) {}
        });

        // Re-attach all registered custom listeners
        this.listeners.forEach((userMap, eventType) => {
            userMap.forEach(wrappedCallback => {
                this.source.addEventListener(eventType, wrappedCallback);
            });
        });

        this.source.onerror = () => {
            console.error('SSE Connection lost, retrying...');
        };
    }

    disconnect() {
        if (this.source) {
            this.source.close();
            this.source = null;
        }
    }

    addEventListener(eventType, callback) {
        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, new Map());
        }
        
        const userListeners = this.listeners.get(eventType);
        if (userListeners.has(callback)) return;

        const wrappedCallback = (e) => {
            let data = e.data;
            try {
                if (typeof e.data === 'string' && (e.data.startsWith('{') || e.data.startsWith('['))) {
                    data = JSON.parse(e.data);
                }
            } catch (err) {}
            
            // Pass a clean object with parsed data
            callback({
                data,
                type: e.type,
                origin: e.origin,
                lastEventId: e.lastEventId,
                originalEvent: e
            });
        };

        userListeners.set(callback, wrappedCallback);
        
        if (this.source) {
            this.source.addEventListener(eventType, wrappedCallback);
        }
    }

    removeEventListener(eventType, callback) {
        const userListeners = this.listeners.get(eventType);
        if (userListeners && userListeners.has(callback)) {
            const wrappedCallback = userListeners.get(callback);
            if (this.source) {
                this.source.removeEventListener(eventType, wrappedCallback);
            }
            userListeners.delete(callback);
        }
    }

    get time() {
        return this.serverTime;
    }
}

export const eventStream = new EventStream();
