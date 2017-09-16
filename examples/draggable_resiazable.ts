import { Text, Group, Rect } from "../src/Elements";
import { Draggable, Resizable } from "../src/Plugins";

const getTimeColor = timestamp => {
  const color = Math.round((Math.sin(timestamp / 0xff5) + 1) / 2 * 358);
  return `hsl(${color}, 50%, 50%)`;
};

// generate primitives
const circleList = new Map();
const textList = new Map();
const groupList = new Map();
const frozenElements = new Set();

let id = 1;
for (let x = 1; x <= 2; x++) {
  for (let y = 1; y <= 2; y++) {
    const g = new Group();
    g.z = 1;
    const rect = new Rect();
    rect.x = 600 + x * 80;
    rect.y = 50 + y * 80;

    rect.width = 50;
    rect.height = 50;
    rect.background = getTimeColor((id + 1) * 3254);

    const text = new Text();
    text.fontSize = 25;
    text.text = `${id}`;
    text.align = "center";
    text.x = rect.x + 25;
    text.y = rect.y + 24;

    g
      .use(Resizable)
      .use(Draggable)
      .add(rect)
      .add(text);

    groupList.set("r" + id, g);

    id++;
  }
}

const mousePos = [0, 0];

// main render function
const render = (timestamp, renderer) => {
  circleList.forEach((circle, i) => {
    if (frozenElements.has(circle)) return;

    const radius = (Math.sin(timestamp / 1000 + i) + 1) * 10 + 10;
    circle.background = getTimeColor(timestamp + i * 1000);
    circle.radius = Math.round(radius);

    if (
      Math.abs(circle.x - mousePos[0]) + Math.abs(circle.y - mousePos[1]) <
      120
    ) {
      circle.radius += 10;
    }

    const text = textList.get(i);

    text.fontSize = circle.radius;
    text.x = circle.x;
    text.y = circle.y;
  });

  groupList.forEach(renderer.draw, renderer);
};

export default {
  init: () => {},
  destroy: () => {},
  render,
  props: gui => {}
};
