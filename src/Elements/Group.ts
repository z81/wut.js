import ElementBase from './ElementBase';

export class Group extends ElementBase {
    public children = [];

    add(element) {
        this.children.push(element);
        element.parent = this;
        return this;
    }

    public type: String = 'group';
}