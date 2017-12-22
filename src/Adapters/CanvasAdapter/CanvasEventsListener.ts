import EventListener from '../../EventListener';
import ElementBase from '../../Elements/ElementBase';
import { Stage } from '../../Elements/Stage';

class CanvasEventsListener {
    private stage: Stage|null;
    private canvasNode: HTMLCanvasElement;
    private eventsForWatch = ['mousemove', 'click', 'mouseup', 'mousedown', 'dblclick'];
    private prevTarget: ElementBase|null = null;
    private viewOffset = {x: 0, y: 0};

    constructor(canvasNode: HTMLCanvasElement, stage: Stage, viewOffset) {
        this.viewOffset = viewOffset;
        this.canvasNode = canvasNode;
        this.stage = stage;
        this.bindEventsListeners();
    }

    xray({ type, x, y, radius, width, height, borderSize = 0, fontSize, align }: any, pointX: number, pointY: number) {
        if (type === 'rect') {
            return (
                (pointX >= x - borderSize && pointX <= x + width + borderSize) &&
                (pointY >= y - borderSize && pointY <= y + height + borderSize)
            );
        }

        if (type === 'text') {
            if (align === "center") {
                x -= width / 2;
            }

            y -= fontSize;

            return (
                (pointX >= x - 3 && pointX <= x + width + 3) &&
                (pointY >= y - 3 && pointY <= y + fontSize + 3)
            );
        }

        if (type === 'circle') {
            return (
                Math.pow(pointX - x - borderSize, 2) + 
                Math.pow(pointY - y - borderSize, 2) <= Math.pow(radius + 1 + borderSize, 2)
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
            const x = event.offsetX - this.viewOffset.x;
            const y = event.offsetY - this.viewOffset.y;

            if (element.type !== 'group' && this.xray(element, x, y)) {
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
        
        if (!target) {
            EventListener.fire(eventName, event, target);
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