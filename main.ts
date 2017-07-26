import Stats from 'stats.js/src/Stats';
import CanvasRenderer from './src/Renderer/CanvasRenderer';
import { Circle } from './src/Elements';



/*const stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
stats.dom.style.left = 'inherit';
stats.dom.style.right = '0';
document.body.appendChild( stats.dom );*/


const rootNode = document.getElementById('app');



const renderer = new CanvasRenderer(rootNode);
renderer.setSize(1000, 900);



const circleList = new Map();

const cols = 15;
const rows = 5;
for(let i = 1; i <= cols * rows; i++) {
    const circle = new Circle();
    const x = (i % cols) * 60 + 40;
    const y = 60 * Math.ceil(i / cols);

    circle.moveTo(x, y);
    circleList.set(i, circle);
}


const getTimeColor = timestamp => {
    const color = Math.round((Math.sin(timestamp / 0xFF5) + 1) / 2 * 358);
    return `hsl(${color}, 50%, 50%)`;
};


const render = timestamp => {
    //stats.begin();
    renderer.clear();

    circleList.forEach((circle, i) => {
        const radius = (Math.sin(timestamp / 1000 + i) + 1) * 10 + 10;
        circle.background = getTimeColor(timestamp + i * 1000);
        circle.radius = Math.round(radius);
        renderer.draw(circle);
    });

    //stats.end();
    //requestAnimationFrame(render);
};

setInterval(() => {
    render(Date.now());
}, 1000 / 30);


//requestAnimationFrame(render);

