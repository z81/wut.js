import Stats from 'stats.js/src/Stats';
import GraphicEngine from './src';
import { Circle, Text, Group } from './src/Elements';
import { Draggable } from './src/Plugins';



const stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
stats.dom.style.left = 'inherit';
stats.dom.style.right = '0';
document.body.appendChild( stats.dom );


const rootNode = document.getElementById('app');



const renderer = GraphicEngine.init('canvas');
renderer.appendTo(rootNode);
renderer.setSize(1000, 900);


// generate
const circleList = new Map();
const textList = new Map();
const groupList = new Map();

const cols = 15;
const rows = 10;
for(let i = 1; i <= cols * rows; i++) {
    const x = (i % cols) * 60 + 40;
    const y = 60 * Math.ceil(i / cols);

    const circle = new Circle();
    const text = new Text();
    const group = new Group();
    group.add(circle);
    group.add(text);
    Draggable(group);

    text.text = `${i}`;
    text.background = '#fff';
    text.moveTo(x + 3, y + 3);

    circle.moveTo(x, y);
    circle.on('click', () => console.log('click', circle.x, circle.y));

    circleList.set(i, circle);
    textList.set(i, text);
    groupList.set(i, group);
}

const mousePos = [0, 0];

const getTimeColor = timestamp => {
    const color = Math.round((Math.sin(timestamp / 0xFF5) + 1) / 2 * 358);
    return `hsl(${color}, 50%, 50%)`;
};


const render = timestamp => {
    stats.begin();
    renderer.clear();

    circleList.forEach((circle, i) => {
        const radius = (Math.sin(timestamp / 1000 + i) + 1) * 10 + 10;
        circle.background = getTimeColor(timestamp + i * 1000);
        circle.radius = Math.round(radius);

        if (Math.abs(circle.x - mousePos[0]) + Math.abs(circle.y - mousePos[1]) < 120) {
            circle.radius += 10;
        }

        //renderer.draw(circle);
    });


    groupList.forEach((group, i) => {
        renderer.draw(group);
    });

    /*textList.forEach((text, i) => {
        renderer.draw(text);
    });*/

    stats.end();
    //requestAnimationFrame(render);
};

document.addEventListener('mousemove', e => {
    mousePos[0] = e.clientX;
    mousePos[1] = e.clientY;
});

setInterval(() => {
    render(Date.now());
}, 1000 / 30);


//requestAnimationFrame(render);

