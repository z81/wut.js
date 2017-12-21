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
    if (!draggedElements.has(element)) return;

    draggedElements.delete(element);
    startDragPositions.delete(element);

    element.fire('dragend', e, element);
};


const moveElement = (element, dx, dy) => {
    if (element.type === 'group') {
        element.children.forEach(el => moveElement(el, dx, dy));
    } else 
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


export function Draggable (config = { handlers: [], gridSize: 1 }) {
    class Draggable extends MixinBase {
        constructor(element) {
            super();

            element.on('mousedown', startDrag.bind(this, element, config.handlers));
            element.on('mouseup', stopDrag.bind(this, element, config.handlers));
            document.addEventListener('mousemove', this.globalMouseMove);
            // Todo: descructor
        }

        private globalMouseMove = (e) => {
            draggedElements.forEach(element => {
                if (!element.mixins.draggable.isEnabled) return;
        
                if (e.buttons === 0) {
                    draggedElements.delete(element);
                }
        
                if (draggedElements.has(element)) {
                    this.drag(element, e);
                }
            });
        }

        private drag = (element, e) => {
            const [x, y] = startDragPositions.get(element);
            const dx = Math.round((e.clientX - x) / config.gridSize) * config.gridSize;
            const dy = Math.round((e.clientY - y) / config.gridSize) * config.gridSize;
            
            startDragPositions.set(element, [e.clientX, e.clientY]);
        
            moveElement(element, dx, dy);
            element.fire('drag', e, element);
        }

    }

    return Draggable;
}

export default Draggable;