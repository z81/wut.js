import EventListener from "../EventListener";

export interface ElementProps {
  x?: number|Function;
  y?: number|Function;
  z?: number|Function;
  width?: number|Function;
  height?: number|Function;
  borderSize?: number|Function;
  borderColor?: string|Function;
  background?: string|Function;
  cursor?: string|Function;
  rotate?: number|Function;
  aimationType?: any|Function;
  children?: any|Function;
  id?: any|Function;
  text?: string|Function;
  font?: string|Function;
  align?: string|Function;
  color?: string|Function;
  radius?: number|Function;
  src?: string|Function;
  borderRadius?: number|Function;
  fontSize?: number|Function;
  fontName?: string|Function;
  ref?: any|Function;
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
      for(const propertyName in config) {
        const property = config[propertyName];

        if (typeof property === 'function') {
          Object.defineProperty(this, propertyName, {
            get: property,
            set: value => this.fire('change', { propertyName, value }, this)
          });
        } else {
          this[propertyName] = config[propertyName];
        }
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

  public inj(...a) {
    console.log(a)
  }
}
