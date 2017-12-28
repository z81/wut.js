import ElementBase from './ElementBase';
import { Stage } from './Stage';

export class Group extends ElementBase {
    public children: ElementBase[] = [];
    public stage: Stage;

    constructor(...elements: ElementBase[]) {
        super();

        elements.forEach(this.add)
    }

    public add = (element: any) => {
        element.setParent(this);
        this.children.push(element);
        return this;
    }

    public addAfter(element: ElementBase, element2: ElementBase) {
        const itemPos = this.children.indexOf(element2);
        
        if (itemPos > -1) {
            this.children.splice(itemPos + 1, 0, element);
        }
    }
    
    public removeItem(element: ElementBase) {
        this.children.splice(this.children.indexOf(element), 1);
        
        if (this.stage) {
            this.stage.removeItem(element);
        }
    }

    public type: string = 'group';
}