import Stats from "stats.js/src/Stats";
import { GraphicEngine } from "../src";
import circleDemo from "./circles";
import animDemo from "./animation";
import dragableResizableDemo from "./draggable_resiazable";
import windowDemo from "./window";
import elementDemo from "./element";
import editorDemo from "./editor";


const getThisDemoId = () => (parseInt(document.location.hash.substr(1), 10) || 0);


let fps = 30;
let selectedDemoIdx = getThisDemoId();

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
  },
  {
    name: "Window",
    demo: windowDemo
  },
  {
    name: "Element",
    demo: elementDemo
  },
  {
    name: "Editor",
    demo: editorDemo
  }
];

let FpsProp = function() {
  this.maxFps = fps;
};

const text = new FpsProp();
const gui = new window["dat"].GUI();

const getDemo = () => demos[selectedDemoIdx].demo;


const selectDemo = (idx: number) => {
  document.location.hash = `${idx}`;
};




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
const rootNode: HTMLElement|null = document.getElementById("app");


// INIT RENDERER
const renderer = GraphicEngine.init("canvas");
if (rootNode) {
  renderer.appendTo(rootNode);
  renderer.resize(1000, 900);
}

// main render function
const render = (timestamp: number) => {
  stats.begin();
  renderer.clear();
  getDemo().render(timestamp, renderer);

  stats.end();
  //requestAnimationFrame(render);
};

// getDemo().init(renderer);

const init = () => {
  getDemo().destroy();
  renderer.clean();

  selectedDemoIdx = getThisDemoId();
  getDemo().init(renderer);
  getDemo().props(gui);
}

window.addEventListener("hashchange", init, false)
init();

// tslint:disable
window["selectDemo"] = selectDemo;

const createRenderTimer = () =>
  setInterval(() => {
    render(Date.now());
  }, 1000 / fps);

let thisRenderTimerIdx = createRenderTimer();
//requestAnimationFrame(render);


gui.add(text, "maxFps", 1, 100).onChange(function(value: number) {
  fps = value;
  clearInterval(thisRenderTimerIdx);
  thisRenderTimerIdx = createRenderTimer();
});
