const resizingElements = new Set();


const isResizeHandler = (element, x, y) => {

    if (element.type === 'rect') {
        return (x > element.x + element.width - 10 && x < element.x + element.width);
    }

    return false;
};


export function Resizable(element) {
    /*element.on('mousemove', (e) => {
        if (isResizeHandler(element, e.clientX, e.clientY)) {
            element.cursor = 'pointer';
        }
        else {
            element.cursor = '';
        }

        console.log(element.cursor);
    });*/

    element.on('mouseenter', (e) => {
        element.cursor = 'pointer';
        console.log('e')
    });

    element.on('mouseleave', (e) => {
        element.cursor = '';
        console.log('l')
    });
}

export default Resizable;