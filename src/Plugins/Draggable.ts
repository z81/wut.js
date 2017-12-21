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

const roundNumber = (val, gridSize) => {
    return Math.round(val / gridSize) * gridSize;
}

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
            const dx = e.clientX - x;
            const dy = e.clientY - y;
            
            startDragPositions.set(element, [e.clientX, e.clientY]);
        
            this.moveElement(element, dx, dy, config.gridSize);
            element.fire('drag', e, element);
        }

        private moveElement = (element, dx, dy, gridSize) => {
            if (element.type === 'group') {
                element.children.forEach((el, idx) => {
                    let xOld = el.x;
                    let yOld = el.y;
                    this.moveElement(el, dx, dy, gridSize);

                    if (idx === 0) {
                        dx += xOld - el.x;
                        dy += yOld - el.y;
                        gridSize = 1;
                    }
                });
            } else 
            if (element.type === 'line') {
                for(let p of element['path']) {
                    p[0] = roundNumber(p[0] + dx, gridSize);
                    p[1] = roundNumber(p[1] + dy, gridSize);
                }
            } else {
                element.x = roundNumber(element.x + dx, gridSize);
                element.y = roundNumber(element.y + dy, gridSize);
            }
        }

    }

    return Draggable;
}

export default Draggable;