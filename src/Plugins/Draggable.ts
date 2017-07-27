const draggedElements = new Set();

const startDrag = (element, e) => {
    element.__isDrag = true;
    element.__startDragPosition = [e.clientX, e.clientY];
    draggedElements.add(element);
};


const stopDrag = element => {
    element.__isDrag = false;
    draggedElements.delete(element);
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
    const [x, y] = element.__startDragPosition;
    const dx = e.clientX - x;
    const dy = e.clientY - y;
    element.__startDragPosition = [e.clientX, e.clientY];

    moveElement(element, dx, dy);
};




document.addEventListener('mousemove', e => {
    draggedElements.forEach(element => {
        if (e.buttons === 0) {
            element.__isDrag = false;
        }

        if (element.__isDrag) {
            drag(element, e);
        }
    });
});


export function Draggable(element) {
    element.on('mousedown', e => {
        console.log('start drag')
        startDrag(element, e);
    });

    element.on('mouseup', () => {
        stopDrag(element);
    });

}

export default Draggable;