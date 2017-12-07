import EventListener from "../EventListener";

export default class ElementBase {
  public x: number = 0;
  public y: number = 0;
  public z: number = 0;
  public type: string = 'none';
  public borderSize: number = 1;
  public borderColor: string = "#000";
  public background: string = "#fff";
  public cursor: string = "";
  public rotate: number = 0;
  public aimationType: string = "linear";
  public children: any = [];
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
