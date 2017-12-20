import ElementBase from './ElementBase';

export class Group extends ElementBase {
    public children: ElementBase[] = [];

    constructor(...elements: ElementBase[]) {
        super();

        elements.forEach(this.add)
    }

    add = (element: ElementBase) => {
        element.setParent(this);
        this.children.push(element);
        return this;
    }

    addAfter(element: ElementBase, element2: ElementBase) {
        const itemPos = this.children.indexOf(element2);
        
        if (itemPos > -1) {
            this.children.splice(itemPos + 1, 0, element);
        }
    }

    public type: string = 'group';
}