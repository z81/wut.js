import ElementBase from './ElementBase';

export class Group extends ElementBase {
    public children = [];

    add(element) {
        this.children.push(element);
        return this;
    }

    public type: String = 'group';
}