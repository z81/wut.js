class CanvasEventsListener {
    private cache;
    private canvasNode;
    private eventsForWatch = ['mousemove', 'click', 'mouseup', 'mousedown'];

    constructor(canvasNode, cache) {
        this.canvasNode = canvasNode;
        this.cache = cache;
        this.bindEventsListeners();
    }

    xray({ type, x, y, radius, width, height }, pointX, pointY) {
        let onCursor = false;

        switch (type) {
            case 'rect':
                onCursor = (
                    (pointX >= x && pointX <= x + width) &&
                    (pointY >= y && pointY <= y + height)
                );
                break;
            case 'circle':
                onCursor = (
                    Math.pow(pointX - x, 2) + Math.pow(pointY - y, 2) <= Math.pow(radius + 1, 2)
                );
                break;
        }

        return onCursor;
    }

    eventHandler(eventName, event, root = this.cache) {
        for(let element of root) {
            if (element.type === 'group') {
                if (this.eventHandler(eventName, event, element.children)) {
                    element.fire(eventName, event);
                    return true;
                }

                continue;
            }

            if (this.xray(element, event.clientX, event.clientY)) {
                element.fire(eventName, event);
                return true;
            }
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