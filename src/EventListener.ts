class EventListener {
    private static eventListeners = new Map();

    static on(eventName: string, callback: Function, toFirst: boolean = true) {
        if (!this.eventListeners.has(eventName)) {
            this.eventListeners.set(eventName, []);
        }

        if (toFirst) {
            this.eventListeners.get(eventName).unshift(callback);
        }
        else {
            this.eventListeners.get(eventName).push(callback);
        }
        return this;
    }

    static fire(eventName: string, event: Event, target: any) {
        const callbacks = this.eventListeners.get(eventName);
        if (!callbacks) return;

        callbacks.forEach(callback => callback(event, target));
    }
}

export default EventListener;