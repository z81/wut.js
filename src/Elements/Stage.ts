import ElementBase from "./ElementBase";

const sortZIndex = (a, b) => {
  if (a.z > b.z) return 1;
  if (a.z < b.z) return -1;
  return 0;
}

export class Stage {
  public children: ElementBase[] = [];

  public add = (element: ElementBase) => {

    if (element.type === 'group') {
      element.children.forEach(this.add)
    }

    this.children.push(element);

    this.sortZIndex();
  }

  public sortZIndex = () => {
    this.children = this.children.sort(sortZIndex);
  }

  public clear = () => {
    this.children.length = 0;
  }
}
