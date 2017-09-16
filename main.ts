import Stats from "stats.js/src/Stats";
import { GraphicEngine } from "./src";
import circleDemo from "./examples/circles";
import animDemo from "./examples/animation";
import dragableResizableDemo from "./examples/draggable_resiazable";

let fps = 30;
let selectedDemoIdx = 0;
const demos = [
  {
    name: "Circle anim",
    demo: circleDemo
  },
  {
    name: "Draggable Resizable",
    demo: dragableResizableDemo
  },
  {
    name: "Animation plugin",
    demo: animDemo
  }
];

let FpsProp = function() {
  this.maxFps = fps;
};

const text = new FpsProp();
const gui = new window["dat"].GUI();

const getDemo = () => demos[selectedDemoIdx].demo;

const selectDemo = idx => {
  getDemo().destroy();
  selectedDemoIdx = idx;
  getDemo().init();
  getDemo().props(gui);
};

window["selectDemo"] = selectDemo;

const menu = document.getElementById("menu");
menu.innerHTML = demos
  .map(
    ({ name }, idx) => `<button onclick="selectDemo(${idx})">${name}</button>`
  )
  .join("");

// STATS
const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
stats.dom.style.left = "inherit";
stats.dom.style.top = "inherit";
stats.dom.style.right = "0";
stats.dom.style.bottom = "0";
document.body.appendChild(stats.dom);
//

// CRATE NODE
const rootNode = document.getElementById("app");

// INIT RENDERER
const renderer = GraphicEngine.init("canvas");
renderer.appendTo(rootNode);
renderer.setSize(1000, 900);

// main render function
const render = timestamp => {
  stats.begin();
  renderer.clear();
  getDemo().render(timestamp, renderer);

  stats.end();
  //requestAnimationFrame(render);
};

const createRenderTimer = () =>
  setInterval(() => {
    render(Date.now());
  }, 1000 / fps);

let thisRenderTimerIdx = createRenderTimer();
//requestAnimationFrame(render);

gui.add(text, "maxFps", 1, 100).onChange(function(value) {
  fps = value;
  clearInterval(thisRenderTimerIdx);
  thisRenderTimerIdx = createRenderTimer();
});
