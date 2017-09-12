import { Circle } from '../src/Elements';
import {  Animation } from '../src';
const groupList = new Map();

const circle = new Circle();
circle.radius = 20;
circle.background = '#5a0';
circle.moveTo(700, 400);
circle.on('mouseenter', Animation({
    radius: '+15'
}, 1500).end());
circle.on('mouseleave', Animation({
    radius: '-15'
}, 1500).end());
groupList.set('123', circle);
//


export default {
    init: () => {},
    destroy: () => {},
    render: (_, renderer) => groupList.forEach(renderer.draw, renderer)
};
