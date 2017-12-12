import ElementBase from './ElementBase';

export class Group extends ElementBase {
    public children: ElementBase[] = [];

    constructor(...elements: ElementBase[]) {
        super();

        if (elements) {
            this.children  = elements;
        }
    }

    add(element) {
        this.children.push(element);
        element.parent = this;
        return this;
    }

    public type: string = 'group';
}