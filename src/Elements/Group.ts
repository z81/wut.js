import ElementBase from './ElementBase';

export class Group extends ElementBase {
    public children = [];

    add(element) {
        this.children.push(element);
    }

    public type: String = 'group';
}