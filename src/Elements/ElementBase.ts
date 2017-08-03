import EventListener from '../EventListener';


export default class ElementBase {
    public x: Number = 0;
    public y: Number = 0;
    public z: Number = 0;
    public lineWidth: Number = 1;
    public borderColor:String = '';
    public background:String = '';
    public cursor:String = '';
    public readonly mixins = {};

    moveTo(x: Number, y: Number) {
        this.x = x;
        this.y = y;
    }


    on(eventName: string, callback: Function) {
        EventListener.on(eventName, (event, target) => {
            if (target !== this) return;

            callback(event);
        });
        return this;
    }

    fire(eventName: string, event: Event, target: any) {
        EventListener.fire(eventName, event, target);
    }

    // SOLID :(
    use(mixin) {
        const name = mixin.name.toLowerCase();
        this.mixins[name] = new mixin(this);

        return this;
    }
}