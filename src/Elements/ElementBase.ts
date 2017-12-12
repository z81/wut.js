import EventListener from "../EventListener";

export interface ElementProps {
  x?: number;
  y?: number;
  z?: number;
  width?: number;
  height?: number;
  borderSize?: number;
  borderColor?: string;
  background?: string;
  cursor?: string;
  rotate?: number;
  aimationType?: any;
  children?: any;
  id?: any;
  text?: string;
  font?: string;
  align?: string;
  color?: string;
  radius?: number;
  borderRadius?: number;
}

export default class ElementBase implements ElementProps {
  public type: string = 'none';
  public x = 0;
  public y = 0;
  public z = 0;
  public width = 10;
  public height = 10;
  public borderSize = 1;
  public borderColor = "#000";
  public background = "#fff";
  public cursor = "";
  public rotate = 0;
  public aimationType = "easeOutQuint";
  public children = [];
  public id = '';
  public text = '';
  public align = '';
  public color = '#fff';
  public radius = 0;
  public borderRadius = 0;
  public font = '14px Georgia';
  private parent = null;
  public readonly mixins = {};

  setProps(config?: ElementProps) {
    if (config) {
      for(const propName in config) {
        this[propName] = config[propName];
      }
    }
  }

  moveTo(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  on(eventName: string, callback: Function) {
    EventListener.on(eventName, (event, target) => {
      if (target !== this && target.parent !== this) return;

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
