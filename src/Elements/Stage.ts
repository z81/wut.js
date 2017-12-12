import ElementBase from "./ElementBase";

export class Stage {
  public children: ElementBase[] = [];

  add = (element: ElementBase) => {
    this.children.push(element);

    if (element.type === 'group') {
      element.children.forEach(this.add)
    }
  }

  clear = () => {
    this.children.length = 0;
  }
}
