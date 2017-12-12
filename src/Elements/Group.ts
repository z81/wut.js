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

    public type: string = 'group';
}