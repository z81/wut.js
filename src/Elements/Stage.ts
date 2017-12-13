import ElementBase from "./ElementBase";

const sortZIndex = (a, b) => {
  if (a.z > b.z) return 1;
  if (a.z < b.z) return -1;
  return 0;
}

export class Stage {
  public children: ElementBase[] = [];

  public add = (...elements: ElementBase[]) => {

    for(let element of elements) {
      // Элементы группы должны быть выше в списке отрисовки
      if (element.type === 'group') {
        element.children.forEach(el => this.add(el))
      }
  
      this.children.push(element);
  
      this.sortZIndex();
    }
  }

  public sortZIndex = () => {
    this.children = this.children.sort(sortZIndex);
  }

  public clear = () => {
    this.children.length = 0;
  }
}
