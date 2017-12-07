export class Stage {
  private elements: any = new Set();

  add(element) {
    this.elements.add(element);
  }
}
