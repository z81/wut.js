import ElementBase from './ElementBase';

export class Group extends ElementBase {
    public children = [];

    add(element) {
        this.children.push(element);
    }

    getChildren() {
        return this.children;
    }

    public type: String = 'group';
}