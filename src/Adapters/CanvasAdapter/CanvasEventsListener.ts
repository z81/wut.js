import EventListener from '../../EventListener';
import ElementBase from '../../Elements/ElementBase';

class CanvasEventsListener {
    private cache;
    private canvasNode: HTMLCanvasElement;
    private eventsForWatch = ['mousemove', 'click', 'mouseup', 'mousedown'];
    private prevTarget: ElementBase|null = null;

    constructor(canvasNode: HTMLCanvasElement, cache) {
        this.canvasNode = canvasNode;
        this.cache = cache;
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
        if (this.prevTarget !== null && this.prevTarget !== element) {
            EventListener.fire('mouseleave', event, this.prevTarget);
        }

        if (this.prevTarget !== element) {
            // console.log('mouseenter', this.prevTarget, element)
            EventListener.fire('mouseenter', event, element);
        }

        this.prevTarget = element;
        if (EventListener.fire(eventName, event, element) === false) return false;

        if (element.type === 'group') {
            for(let el of element.children) {
                if (EventListener.fire(eventName, event, el) === false) {
                    return false;
                }
            }
        }
    }

    eventHandler(eventName: string, event, root = this.cache, isGroup = false) {
        const elementsOnCursor = [];

        for(let element of root) {

            if (element.type === 'group') {
                if (this.eventHandler(eventName, event, element.children, true)) {
                    //this.fireEvent(eventName, event, element);
                    elementsOnCursor.push(element);
                }
                continue;
            }

            if (this.xray(element, event.offsetX, event.offsetY)) {
                //this.fireEvent(eventName, event, element);
                elementsOnCursor.push(element);
            }
        }

        event.canvasTarget = null;
        event.elementsOnCursor = elementsOnCursor;


        const targets = elementsOnCursor.sort(this.sortZIndex);
        
        if (targets.length > 0) {
            event.canvasTarget = targets[0];
        }

        for(let t of targets) {
            event.canvasTarget = t;
            
            if (this.fireEvent(eventName, event, t) === false) {
                console.log('break')
                break;
            }
        }

        // for(let i = 0; i < elementsOnCursor.length; i++) {
        //     if (event.canvasTarget === null || event.canvasTarget.z < elementsOnCursor[i].z) {
        //         event.canvasTarget = elementsOnCursor[i];
        //     }
        // }


        if (event.canvasTarget !== null) {
            if (isGroup) {
                return true;
            }
            else {
                this.fireEvent(eventName, event, event.canvasTarget);
            }
        }
        else if (this.prevTarget !== null && !isGroup) {
            event.canvasTarget = this.prevTarget;
            EventListener.fire('mouseleave', event, this.prevTarget);
            this.prevTarget = null;
        }

        return false;
    }

    bindEventsListeners() {
        this.eventsForWatch.forEach(eventName => {
            const handler = this.eventHandler.bind(this, eventName);
            this.canvasNode.addEventListener(eventName, handler, false);
        });
    }

    sortZIndex(a, b) {
        if (a.z > b.z)  return 1;
        if (a.z < b.z) return -1;
        return 0;
    }
}

export default CanvasEventsListener;