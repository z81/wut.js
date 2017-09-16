import { Circle, Text, Group } from "../src/Elements";
import { Draggable } from "../src/Plugins";

const getTimeColor = timestamp => {
  const color = Math.round((Math.sin(timestamp / 0xff5) + 1) / 2 * 358);
  return `hsl(${color}, 50%, 50%)`;
};

// generate primitives
const circleList = new Map();
const textList = new Map();
const groupList = new Map();
const frozenElements = new Set();

const cols = 10;
const rows = 10;
// gen circle
for (let i = 1; i <= cols * rows; i++) {
  const x = (i % cols) * 60 + 40;
  const y = 60 * Math.ceil(i / cols);

  const circle = new Circle();
  const text = new Text();
  const group = new Group();
  group.add(circle);
  group.add(text);
  group.use(Draggable);

  text.text = `${i}`;
  text.align = "center";
  text.fontSize = 20;
  text.moveTo(x + 3, y + 3);

  circle.moveTo(x, y);
  circle.on("click", () => {
    if (frozenElements.has(circle)) {
      frozenElements.delete(circle);
    } else {
      frozenElements.add(circle);
    }
  });

  circleList.set(i, circle);
  textList.set(i, text);
  groupList.set(i, group);
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

const globalMouseMove = e => {
  mousePos[0] = e.clientX;
  mousePos[1] = e.clientY;
};

export default {
  init: () => {
    document.addEventListener("mousemove", globalMouseMove, false);
  },
  destroy: () => {
    document.removeEventListener("mousemove", globalMouseMove, false);
  },
  render,
  props: gui => {}
};
