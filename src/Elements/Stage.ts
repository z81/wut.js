import ElementBase from "./ElementBase";

const sortZIndex = (a, b) => {
  if (a.z > b.z) return 1;
  if (a.z < b.z) return -1;
  return 0;
}

export class Stage {
  public children: ElementBase[] = [];

  add = (element: ElementBase) => {
    this.children.push(element);

    if (element.type === 'group') {
      element.children.forEach(this.add)
    }

    this.children = this.children.sort(sortZIndex);
  }

  clear = () => {
    this.children.length = 0;
  }
}
