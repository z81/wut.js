const resizingElements = new Set();
const resizeAreaSize = 10;



const isResizeHandler = (element, x, y) => {
    let direction = '';
    if (element.type === 'rect') {

        return (x > element.x + element.width - resizeAreaSize && x < element.x + element.width);
    }

    return false;
};


export function Resizable(element) {
    element.on('mousemove', (e) => {
        if (isResizeHandler(element, e.offsetX, e.offsetY)) {
            element.cursor = 'pointer';
        }
        else {
            element.cursor = '';
        }

        console.log(element.cursor);
    });

    element.on('mouseleave', (e) => {
        element.cursor = '';
    });
}

export default Resizable;