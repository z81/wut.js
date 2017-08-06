import EventListener from '../EventListener';


export default class ElementBase {
    public x: number = 0;
    public y: number = 0;
    public z: number = 0;
    public lineWidth: number = 1;
    public borderColor: string = '';
    public background: string = '';
    public cursor: string = '';
    private parent = null;
    public readonly mixins = {};

    moveTo(x: number, y: number) {
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


    use(mixin) {
        const name = mixin.name.toLowerCase();
        this.mixins[name] = new mixin(this);

        return this;
    }
}