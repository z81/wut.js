import { Animation, animTypes } from "../src/Animation/Animation";
import { Text, Group, Rect, Image, Line, Circle } from "../src/Elements";
import { Draggable, Resizable } from "../src/Plugins";

const el = new Rect();
const g = new Group(el);

const el2 = new Rect();
const g2 = new Group(el2);

el.setProps({
  x: 30,
  y: 30,
  width: 500,
  height: 700,
  background: "transparent",
  borderColor: "#ccc",
  borderSize: 1,
  borderRadius: 10,
  z: -100
});

el2.setProps({
  x: 100,
  y: 100,
  width: 100,
  height: 100,
  background: "#eee",
  borderColor: "#ccc",
  borderSize: 1,
  borderRadius: 10
});
el2.use(Draggable());

const render = (timestamp, renderer) => {
  renderer.render();
};

export default {
  init: renderer => {
    renderer.stage.add(g2);
    renderer.stage.add(g);
  },
  destroy: () => {},
  render,
  props: gui => {}
};
