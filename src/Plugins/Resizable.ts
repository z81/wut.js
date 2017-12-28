import MixinBase from './MixinBase';
import { ICanvasMouseEvent } from '../ICanvasMousEvent';


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


const changeOffsetSizeAndPos = (element, offsetWidth, offsetHeight, canvasOffsetX = 0, canvasOffsetY = 0) => {
    if (element.type === 'group') {
        element.children.forEach(el => changeOffsetSizeAndPos(el, offsetWidth, offsetHeight, canvasOffsetX, canvasOffsetY));
        return;
    }

    element.width += offsetWidth;
    element.height += offsetHeight;
    element.x += canvasOffsetX;
    element.y += canvasOffsetY;
};

document.addEventListener('mouseup', (e) => {
    if (resizableElement !== null && resizableElement.mixins.draggable) {
        resizableElement.mixins.draggable.enable();
    }

    if (resizableElement !== null) {
        resizableElement.fire('resizeend', e, resizableElement);
    }

    resizableElement = null;
}, false);


document.addEventListener('mousemove', ({ canvasOffsetX, canvasOffsetY }: ICanvasMouseEvent) => {
    if (resizableElement !== null) {
        const [x, y] = resizeStartPosition;

        if (resizeDirection & DIRECTION.RIGHT) {
            changeOffsetSizeAndPos(resizableElement, canvasOffsetX - x, 0);
        }
        else if (resizeDirection & DIRECTION.LEFT) {
            changeOffsetSizeAndPos(resizableElement, x - canvasOffsetX, 0, canvasOffsetX - x);
        }
        if (resizeDirection & DIRECTION.BOTTOM) {
            changeOffsetSizeAndPos(resizableElement, 0, canvasOffsetY - y);
        }
        else if (resizeDirection & DIRECTION.TOP) {
            changeOffsetSizeAndPos(resizableElement, 0, y - canvasOffsetY, 0, canvasOffsetY - y);
        }

        resizeStartPosition[0] = canvasOffsetX;
        resizeStartPosition[1] = canvasOffsetY;
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

export function Resizable (handler?) {
    class Resizable extends MixinBase {
        constructor(element?) {
            super();
            element.on('mousedown', e => {
                if (handler && e.canvasTarget !== handler && e.canvasTarget !== handler.parent) return;

                const direction = getDirection(handler || e.canvasTarget, e.canvasOffsetX, e.canvasOffsetY);

                if (e.buttons > 0 && direction !== DIRECTION.NONE) {
                    if (element.mixins.draggable) {
                        element.mixins.draggable.disable();
                    }

                    resizeDirection = direction;
                    resizableElement = element;
                    resizeStartPosition = [e.canvasOffsetX, e.canvasOffsetY];
                }

            });

            element.on('mousemove', ({ canvasOffsetX, canvasOffsetY, canvasTarget, elementsOnCursor }) => {
                if (handler && canvasTarget !== handler && canvasTarget !== handler.parent) return;
                if (resizableElement !== null) return;

                const direction = getDirection(canvasTarget, canvasOffsetX, canvasOffsetY);
                let cursor = '';

                if (direction & DIRECTION.LEFT) cursor = 'w-resize';
                if (direction & DIRECTION.RIGHT) cursor = 'w-resize';
                if (direction & DIRECTION.TOP) cursor = 's-resize';
                if (direction & DIRECTION.BOTTOM) cursor = 's-resize';


                if (direction === DIRECTION.BOTTOM + DIRECTION.LEFT) cursor = 'nesw-resize';
                if (direction === DIRECTION.BOTTOM + DIRECTION.RIGHT) cursor = 'nwse-resize';
                if (direction === DIRECTION.TOP + DIRECTION.LEFT) cursor = 'nwse-resize';
                if (direction === DIRECTION.TOP + DIRECTION.RIGHT) cursor = 'nesw-resize';

                element.cursor = cursor;

            });

            element.on('mouseleave', (e) => {
                element.cursor = '';
            });
        }

    }
    return Resizable;
}


export default Resizable;