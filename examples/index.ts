import Stats from "stats.js/src/Stats";
import { GraphicEngine } from "../src";
import circleDemo from "./circles";
import animDemo from "./animation";
import dragableResizableDemo from "./draggable_resiazable";
import windowDemo from "./window";
import elementDemo from "./element";


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
  }
];

let FpsProp = function() {
  this.maxFps = fps;
};

const text = new FpsProp();
const gui = new window["dat"].GUI();

const getDemo = () => demos[selectedDemoIdx].demo;


const selectDemo = idx => {
  document.location.hash = `${idx}`;
};


window.addEventListener("hashchange", e => {
  getDemo().destroy();
  selectedDemoIdx = getThisDemoId();
  getDemo().init();
  getDemo().props(gui);
}, false)

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
renderer.resize(1000, 900);

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
