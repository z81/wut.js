import {Animation, animTypes} from '../src/Animation';
import {Circle} from '../src/Elements/Circle';
import { Text, Group, Rect } from "../src/Elements";
import { Draggable, Resizable } from "../src/Plugins";

const g = new Group();
const el = new Rect();
const d1 = new Circle();
const d2 = new Circle();

g.add(el);
g.add(d1);
g.add(d2);

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
    borderColor: '#449f00',
    aimationType: animTypes.easeOutQuint
});

d1.on(
    "mouseenter",
    Animation(
      {
        radius: 10
      },
      200
    ).end()
);


d1.on(
    "mouseleave",
    Animation(
      {
        radius: 4
      },
      200
    ).end()
);

g.use(Draggable())

// main render function
const render = (timestamp, renderer) => {
    renderer.draw(g);
};

export default {
  init: () => {},
  destroy: () => {},
  render,
  props: gui => {}
};
