import EventListener from '../../EventListener';
import ElementBase from '../../Elements/ElementBase';
import { Stage } from '../../Elements/Stage';

class CanvasEventsListener {
    private stage: Stage|null;
    private canvasNode: HTMLCanvasElement;
    private eventsForWatch = ['mousemove', 'click', 'mouseup', 'mousedown'];
    private prevTarget: ElementBase|null = null;

    constructor(canvasNode: HTMLCanvasElement, stage: Stage) {
        this.canvasNode = canvasNode;
        this.stage = stage;
        this.bindEventsListeners();
    }

    xray({ type, x, y, radius, width, height }: any, pointX: number, pointY: number) {
        if (type === 'rect') {
            return (
                (pointX >= x && pointX <= x + width) &&
                (pointY >= y && pointY <= y + height)
            );
        }

        if (type === 'circle') {
            return (
                Math.pow(pointX - x, 2) + Math.pow(pointY - y, 2) <= Math.pow(radius + 1, 2)
            );
        }


        return false;
    }

    fireEvent(eventName: string, event: Event, element: ElementBase): boolean|void {
        if (EventListener.fire(eventName, event, element) === false) return false;

        if (element.type === 'group') {
            for(let el of element.children) {
                if (EventListener.fire(eventName, event, el) === false) {
                    return;
                }
            }
        }
    }

    eventHandler = (eventName: string, event, root = this.stage.children, isGroup = false) => {
        const elementsOnCursor = [];

        for(let element of root) {
            if (element.type !== 'group' && this.xray(element, event.offsetX, event.offsetY)) {
                elementsOnCursor.push(element);
            }
        }

        
        event.elementsOnCursor = elementsOnCursor;
        const targets = elementsOnCursor;
        let target = null;
        
        if (targets.length > 0) {
            target = targets[0];
        }

        if (isGroup) {
            return !!target;
        }


        for(let t of targets) {
            target = t;
            
            // if (eventName === 'mousedown') debugger;
            if (this.fireEvent(eventName, event, target) === false) {
                
                break;
            }
        }


        if (!isGroup && target !== this.prevTarget) {
            if (this.prevTarget !== null) {
                EventListener.fire('mouseleave', event, this.prevTarget);
            }
            if (target !== null) {
                EventListener.fire('mouseenter', event, target);
            }

            this.prevTarget = target;
        }
        

        return false;
    }

    bindEventsListeners() {
        this.eventsForWatch.forEach(eventName => {
            const handler = this.eventHandler.bind(this, eventName);
            this.canvasNode.addEventListener(eventName, handler, false);
        });
    }

    clear() {
        this.prevTarget = null;
    }
}

export default CanvasEventsListener;