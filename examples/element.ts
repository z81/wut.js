import { Text, Group, Rect } from "../src/Elements";
import { Draggable, Resizable } from "../src/Plugins";

const groupList = new Set();

const g = new Group();
const win = new Rect();

g.add(win);
groupList.add(g);

const updateWindow = (x, y, width, height) => {
  win.x = x;
  win.y = y;
  win.width = width;
  win.height = height;
  win.borderColor = "#00BCD4";
  win.borderSize = 7;
};

updateWindow(600, 50, 250, 150);

// main render function
const render = (timestamp, renderer) => {
  updateWindow(win.x, win.y, win.width, win.height);
  groupList.forEach(renderer.draw, renderer);
};

export default {
  init: () => {},
  destroy: () => {},
  render,
  props: gui => {}
};
