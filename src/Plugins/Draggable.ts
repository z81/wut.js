import MixinBase from './MixinBase';
import { ElementBase } from '../../examples/editor/elements/ElementBase';

const draggedElements = new Set();
const startDragPositions = new Map();

const startDrag = (element, handlers, e) => {
    if (handlers.length) {
        const handlersONCursor = e.elementsOnCursor.filter(e => handlers.indexOf(e) !== -1);
        
        if (handlersONCursor.length !== e.elementsOnCursor.length) {
            return;
        } 
    }

    startDragPositions.set(element, [e.clientX, e.clientY]);
    draggedElements.add(element);

    element.fire('dragstart', e, element);
    return false;
};


const stopDrag = (element, handler, e) => {
    draggedElements.delete(element);
    startDragPositions.delete(element);

    element.fire('dragend', e, element);
};


const moveElement = (element, dx, dy) => {
    if (element.type === 'group') {
        element.children.forEach(el => moveElement(el, dx, dy));
        return;
    }


    if (element.type === 'line') {
        for(let p of element['path']) {
            p[0] += dx;
            p[1] += dy;
        }
    } else {
        element.x += dx;
        element.y += dy;
    }
};


const drag = (element, e) => {
    const [x, y] = startDragPositions.get(element);
    const dx = e.clientX - x;
    const dy = e.clientY - y;
    startDragPositions.set(element, [e.clientX, e.clientY]);

    moveElement(element, dx, dy);
    element.fire('drag', e, element);
};




document.addEventListener('mousemove', e => {
    draggedElements.forEach(element => {
        if (!element.mixins.draggable.isEnabled) return;

        if (e.buttons === 0) {
            draggedElements.delete(element);
        }

        if (draggedElements.has(element)) {
            drag(element, e);
        }
    });

    return false;
});


export function Draggable (config = {handlers: []}) {
    class Draggable extends MixinBase {
        constructor(element) {
            super();
            element.on('mousedown', startDrag.bind(this, element, config.handlers));
            element.on('mouseup', stopDrag.bind(this, element, config.handlers));
        }
    }

    return Draggable;
}

export default Draggable;