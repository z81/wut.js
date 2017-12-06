import MixinBase from './MixinBase';


const resizeAreaSize = 10;

const DIRECTION = {
    NONE: 0,
    LEFT: 2,
    TOP: 4,
    RIGHT: 8,
    BOTTOM: 16
};

let resizableElement = null;
let resizeDirection = DIRECTION.NONE;
let resizeStartPosition = [];


const changeOffsetSizeAndPos = (element, offsetWidth, offsetHeight, offsetX = 0, offsetY = 0) => {
    if (element.type === 'group') {
        element.children.forEach(el => changeOffsetSizeAndPos(el, offsetWidth, offsetHeight, offsetX, offsetY));
        return;
    }

    element.width += offsetWidth;
    element.height += offsetHeight;
    element.x += offsetX;
    element.y += offsetY;
};

document.addEventListener('mouseup', () => {
    if (resizableElement !== null && resizableElement.mixins.draggable) {
        resizableElement.mixins.draggable.enable();
    }

    resizableElement = null;
}, false);


document.addEventListener('mousemove', ({ offsetX, offsetY }) => {
    if (resizableElement !== null) {
        const [x, y] = resizeStartPosition;

        if (resizeDirection & DIRECTION.RIGHT) {
            changeOffsetSizeAndPos(resizableElement, offsetX - x, 0);
        }
        else if (resizeDirection & DIRECTION.LEFT) {
            changeOffsetSizeAndPos(resizableElement, x - offsetX, 0, offsetX - x);
        }
        if (resizeDirection & DIRECTION.BOTTOM) {
            changeOffsetSizeAndPos(resizableElement, 0, offsetY - y);
        }
        else if (resizeDirection & DIRECTION.TOP) {
            changeOffsetSizeAndPos(resizableElement, 0, y - offsetY, 0, offsetY - y);
        }

        resizeStartPosition[0] = offsetX;
        resizeStartPosition[1] = offsetY;
        return;
    }
}, false);


const getDirection = ({ width, height, x, y, type, children }, cursorX, cursorY) => {
    let direction = DIRECTION.NONE;

    if (type === 'group') {
        children.forEach(el => {
            const direct = getDirection(el, cursorX, cursorY);
            if (direct !== DIRECTION.NONE) {
                direction = direct;
            }
        });
    }


    if (type === 'rect') {
        if (cursorX >= (x + width - resizeAreaSize) && cursorX <= x + width) {
            direction |= DIRECTION.RIGHT;
        }
        else if (cursorX > x && cursorX <= x + resizeAreaSize) {
            direction |= DIRECTION.LEFT;
        }

        if (cursorY >= (y + height - resizeAreaSize) && cursorY <= y + height) {
            direction |= DIRECTION.BOTTOM;
        }
        else if (cursorY >= y && cursorY <= y + resizeAreaSize) {
            direction |= DIRECTION.TOP;
        }
    }

    return direction;
};

export function Resizable (handler) {
    class Resizable extends MixinBase {
        constructor(element) {
            super();
            element.on('mousedown', e => {
                if (handler && e.elementsOnCursor.indexOf(handler) === -1) return;
                const direction = getDirection(handler, e.offsetX, e.offsetY);

                if (e.buttons > 0 && direction !== DIRECTION.NONE) {
                    if (element.mixins.draggable) {
                        element.mixins.draggable.disable();
                    }

                    resizeDirection = direction;
                    resizableElement = element;
                    resizeStartPosition = [e.offsetX, e.offsetY];
                }
            });

            element.on('mousemove', ({ offsetX, offsetY, elementsOnCursor }) => {
                if (handler && elementsOnCursor.indexOf(handler) === -1) return;
                if (resizableElement !== null) return;

                const direction = getDirection(handler, offsetX, offsetY);
                let cursor = '';

                if (direction & DIRECTION.LEFT) cursor = 'w-resize';
                if (direction & DIRECTION.RIGHT) cursor = 'w-resize';
                if (direction & DIRECTION.TOP) cursor = 's-resize';
                if (direction & DIRECTION.BOTTOM) cursor = 's-resize';


                if (direction === DIRECTION.BOTTOM + DIRECTION.LEFT) cursor = 'nesw-resize';
                if (direction === DIRECTION.BOTTOM + DIRECTION.RIGHT) cursor = 'nwse-resize';
                if (direction === DIRECTION.TOP + DIRECTION.LEFT) cursor = 'nwse-resize';
                if (direction === DIRECTION.TOP + DIRECTION.RIGHT) cursor = 'nesw-resize';

                element.cursor = cursor
            });

            element.on('mouseleave', (e) => {
                element.cursor = '';
            });
        }

    }
    return Resizable;
}


export default Resizable;