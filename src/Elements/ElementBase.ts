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
  src?: string;
  borderRadius?: number;
  fontSize?: number;
  fontName?: string;
  ref?: any;
}

export default class ElementBase implements ElementProps {
  public type: string = 'none';
  public x = 0;
  public y = 0;
  public old_z = 0;
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
  public parent: ElementBase|null = null;
  public ref: any;
  public readonly mixins = {};
  private _z = 0;

  public set z(z) {
    this.old_z = this._z;
    this._z = z;
  }

  public get z() {
    return this._z;
  }

  public setProps(config?: ElementProps) {
    if (config) {
      for(const propName in config) {
        this[propName] = config[propName];
      }
    }
  }

  public setParent(parent: ElementBase) {
    this.parent = parent;
  }

  public moveTo(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public on(eventName: string, callback: Function) {
    EventListener.on(eventName, (event, target) => {
      if (target === null || target !== this && target.parent && target.parent !== this) return;

      return callback(event);
    });
    return this;
  }

  public fire(eventName: string, event: Event, target: any) {
    EventListener.fire(eventName, event, target);
  }

  public use(mixin) {
    const name = mixin.name.toLowerCase();
    this.mixins[name] = new mixin(this);

    return this;
  }
}
