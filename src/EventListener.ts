class EventListener {
    private static eventListeners = new Map();

    static on(eventName: string, callback: Function) {
        if (!this.eventListeners.has(eventName)) {
            this.eventListeners.set(eventName, new Set());
        }

        this.eventListeners.get(eventName).add(callback);
        return this;
    }

    static fire(eventName: string, event: Event, target: any) {
        const callbacks = this.eventListeners.get(eventName);
        if (!callbacks) return;

        callbacks.forEach(callback => callback(event, target));
    }
}

export default EventListener;