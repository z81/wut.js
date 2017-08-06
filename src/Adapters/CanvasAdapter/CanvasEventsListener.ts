import EventListener from '../../EventListener';

class CanvasEventsListener {
    private cache;
    private canvasNode;
    private eventsForWatch = ['mousemove', 'click', 'mouseup', 'mousedown'];
    private prevTarget = null;

    constructor(canvasNode, cache) {
        this.canvasNode = canvasNode;
        this.cache = cache;
        this.bindEventsListeners();
    }

    xray({ type, x, y, radius, width, height }, pointX, pointY) {
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

    fireEvent(eventName, event, element) {
        if (this.prevTarget !== null && this.prevTarget !== element) {
            EventListener.fire('mouseleave', event, this.prevTarget);
        }

        if (this.prevTarget !== element) {
            EventListener.fire('mouseenter', event, element);
        }

        this.prevTarget = element;
        EventListener.fire(eventName, event, element);

        if (element.type === 'group') {
            element.children.forEach(el => this.fireEvent(eventName, event, el));
        }
    }

    eventHandler(eventName, event, root = this.cache, isGroup = false) {
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
        for(let i = 0; i < elementsOnCursor.length; i++) {
            if (event.canvasTarget === null || event.canvasTarget.z < elementsOnCursor[i].z) {
                event.canvasTarget = elementsOnCursor[i];
            }
        }

        if (event.canvasTarget !== null) {
            if (isGroup) {
                return true;
            }
            else {
                this.fireEvent(eventName, event, event.canvasTarget);
            }
        }

        if (this.prevTarget !== null) {
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
}

export default CanvasEventsListener;