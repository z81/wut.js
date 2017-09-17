import { Text, Group, Rect } from "../src/Elements";
import { Draggable, Resizable } from "../src/Plugins";

const groupList = new Set();

const g = new Group();
const win = new Rect();
const header = new Rect();
const headerText = new Text();
const close = new Rect();
const closeText = new Text();
const maxText = new Text();
const minText = new Text();
const max = new Rect();
const min = new Rect();

g.add(win);
g.add(header);
g.add(headerText);
g.add(close);
g.add(min);
g.add(max);
g.add(closeText);
g.add(maxText);
g.add(minText);
g.use(Draggable).use(Resizable);
groupList.add(g);

const updateWindow = (x, y, width, height) => {
  win.x = x;
  win.y = y;
  win.width = width;
  win.height = height;
  win.borderColor = "#00BCD4";
  win.borderSize = 7;
  header.x = x;
  header.y = y;
  header.background = "#00BCD4";
  header.width = win.width;
  header.height = 30;
  header.borderColor = "#00BCD4";
  header.borderSize = 1;
  headerText.x = x + 20;
  headerText.y = y + 20;
  headerText.color = "#000";
  headerText.text = "Window title";
  close.width = 25;
  close.height = 25;
  close.x = x + width - close.width;
  close.y = y;
  close.background = "#ff5722";
  close.borderSize = 0;
  max.width = 25;
  max.height = 25;
  max.x = x + width - close.width * 2 - 5;
  max.y = y;
  max.background = "#8bc34a";
  min.width = 25;
  min.height = 25;
  min.x = x + width - close.width * 3 - 10;
  min.y = y;
  min.background = "#3f51b5";
  closeText.x = close.x + 7;
  closeText.y = y + 20;
  closeText.fontSize = close.height;
  closeText.fontName = "Arial";
  closeText.color = "#000";
  closeText.text = "x";
  maxText.x = max.x + 7;
  maxText.y = y + 18;
  maxText.fontSize = 18;
  maxText.fontName = "Arial";
  maxText.color = "#000";
  maxText.text = "🗖";
  minText.x = min.x + 7;
  minText.y = y + 16;
  minText.fontSize = close.height;
  minText.fontName = "Arial";
  minText.color = "#333";
  minText.text = "_";
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
