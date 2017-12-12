import {Animation, animTypes} from '../src/Animation/Animation';
import { Text, Group, Rect, Image, Line, Circle } from "../src/Elements";
import { Draggable, Resizable } from "../src/Plugins";


const el = new Rect();
const d1 = new Circle();
const icon = new Image();
const g = new Group(el, d1, icon);

const el2 = new Rect();
const d2 = new Circle();
const g2 = new Group(el2, d2);

const l = new Line();

el2.setProps({
  x: 300,
  y: 100,
  width: 100,
  height: 100,
  background: "#eee",
  borderColor: "#ccc",
  borderSize: 1,
  borderRadius: 10
});

d2.setProps({
  x: 300,
  y: 120,
  radius: 4,
  background: '#44ff00',
  borderColor: '#449f00'
});



el.setProps({
    x: 100,
    y: 100,
    width: 100,
    height: 100,
    background: "#eee",
    borderColor: "#ccc",
    borderSize: 1,
    borderRadius: 10
});

d1.setProps({
    x: 200,
    y: 120,
    radius: 4,
    background: '#44ff00',
    borderColor: '#449f00'
});

d1.on(
    "mouseenter",
    Animation(
      {
        radius: 10,
        type: animTypes.easeOutQuint,
        duration: 200
      }
    ).end()
);


d1.on(
    "mouseleave",
    Animation(
      {
        radius: 4,
        type: animTypes.easeOutQuint,
        duration: 200
      }
    ).end()
);



icon.src = "https://www.w3schools.com/tags/img_the_scream.jpg";

icon.setProps({
  x: 110,
  y: 110,
  width: 80,
  height: 80
});


g.use(Draggable());
g2.use(Draggable());
g2.use(Resizable());


let rectIsSelected = false;

el.on("mousedown", () => {
  rectIsSelected = !rectIsSelected;

  el.borderColor = rectIsSelected ? '#aaf' : '#ccc';
  el.borderSize = rectIsSelected ? 2 : 1;
})


g.on("mousemove", () => {
  l.path[0][0] = d1.x;
  l.path[0][1] = d1.y;
})

g2.on("mousemove", () => {
  l.path[1][0] = d2.x;
  l.path[1][1] = d2.y;
})


l.setProps({
  z: -10,
  borderColor: 'green',
  borderSize: 1
})

l.path = [
  [d1.x, d1.y],
  [d2.x, d2.y]
];


// main render function
const render = (timestamp, renderer) => {
    //renderer.draw(g);
    renderer.render();
};

export default {
  init: (renderer) => {
    renderer.stage.add(g);
    renderer.stage.add(g2);
    renderer.stage.add(l);
  },
  destroy: () => {},
  render,
  props: gui => {}
};
