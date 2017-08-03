import MixinBase from './MixinBase';

const draggedElements = new Set();
const startDragPositions = new Map();

const startDrag = (element, e) => {
    startDragPositions.set(element, [e.clientX, e.clientY]);
    draggedElements.add(element);
};


const stopDrag = element => {
    draggedElements.delete(element);
    startDragPositions.delete(element)
};


const moveElement = (element, dx, dy) => {
    if (element.type === 'group') {
        element.children.forEach(el => moveElement(el, dx, dy));
        return;
    }

    element.x += dx;
    element.y += dy;
};


const drag = (element, e) => {
    const [x, y] = startDragPositions.get(element);
    const dx = e.clientX - x;
    const dy = e.clientY - y;
    startDragPositions.set(element, [e.clientX, e.clientY]);

    moveElement(element, dx, dy);
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
});


export class Draggable extends MixinBase {
    constructor(element) {
        super();
        element.on('mousedown', startDrag.bind(this, element));
        element.on('mouseup', stopDrag.bind(this, element));
    }
}

export default Draggable;