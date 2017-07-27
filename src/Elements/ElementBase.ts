export default class ElementBase {
    public x: Number = 0;
    public y: Number = 0;
    public lineWidth: Number = 1;
    public borderColor:String = '';
    public background:String = '';
    private eventListners = new Map();

    moveTo(x: Number, y: Number) {
        this.x = x;
        this.y = y;
    }

    on(eventName: string, callback: Function) {
        this.eventListners.set(eventName, callback);
        return this;
    }

    fire(eventName: string, event: Event) {
        const callback = this.eventListners.get(eventName);
        if (callback) {
            callback(event);
        }
    }
}