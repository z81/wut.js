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
            resizableElement.width += offsetX - x;
        }
        else if (resizeDirection & DIRECTION.LEFT) {
            resizableElement.x += offsetX - x;
            resizableElement.width += x - offsetX;
        }
        if (resizeDirection & DIRECTION.BOTTOM) {
            resizableElement.height += offsetY - y;
        }
        else if (resizeDirection & DIRECTION.TOP) {
            resizableElement.y += offsetY - y;
            resizableElement.height += y - offsetY;
        }

        resizeStartPosition[0] = offsetX;
        resizeStartPosition[1] = offsetY;
        return;
    }
}, false);


const getDirection = ({ width, height, x, y, type }, cursorX, cursorY) => {
    let direction = DIRECTION.NONE;
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


export class Resizable extends MixinBase {
    constructor(element) {
        super();
        element.on('mousedown', e => {
            const direction = getDirection(element, e.offsetX, e.offsetY);

            if (e.buttons > 0 && direction !== DIRECTION.NONE) {
                if (element.mixins.draggable) {
                    element.mixins.draggable.disable();
                }

                resizeDirection = direction;
                resizableElement = element;
                resizeStartPosition = [e.offsetX, e.offsetY];
            }
        });

        element.on('mousemove', ({ offsetX, offsetY }) => {
            if (resizableElement !== null) return;

            const direction = getDirection(element, offsetX, offsetY);
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


export default Resizable;