import { Circle, Rect } from "../src/Elements";
import { Animation } from "../src";
const groupList = new Map();

const Props = new function() {
  this.background = "#5a0";
  this.aimationType = "easeInOutElastic";
}();

const circle = new Circle();
circle.radius = 20;
circle.background = Props.background;
circle.moveTo(700, 400);
circle.aimationType = "easeInOutElastic";

circle.on(
  "mouseenter",
  Animation(
    {
      radius: 50
    },
    1500
  ).end()
);

circle.on(
  "mouseleave",
  Animation(
    {
      radius: 20
    },
    1000
  ).end()
);

groupList.set("123", circle);
//
const rect = new Rect();
rect.width = 50;
rect.height = 50;
rect.background = Props.background;
rect.rotate = 45;
rect.aimationType = "easeInOutBack";
rect.moveTo(200, 400);

rect.on(
  "mousedown",
  Animation(
    {
      height: 100,
      width: 100,
      x: 720,
      y: 420
    },
    1500
  ).end()
);

rect.on(
  "mouseleave",
  Animation(
    {
      height: 50,
      width: 50,
      x: 200,
      y: 400
    },
    1500
  ).end()
);

groupList.set("1235", rect);
//

let thisGUIItemInstance = [];
let thisGUIInstance = null;

const removeBackgroundProp = () => {
  if (thisGUIItemInstance.length > 0 && thisGUIItemInstance) {
    thisGUIItemInstance.forEach(item => thisGUIInstance.remove(item));
    thisGUIItemInstance.length = 0;
  }
};

const avaliableAnimationTypes = [
  "easeInQuad",
  "easeOutQuad",
  "easeInOutQuad",
  "easeInCubic",
  "easeOutCubic",
  "easeInOutCubic",
  "easeInQuart",
  "easeOutQuart",
  "easeInOutQuart",
  "easeInQuint",
  "easeOutQuint",
  "easeInOutQuint",
  "easeInSine",
  "easeOutSine",
  "easeInOutSine",
  "easeInExpo",
  "easeOutExpo",
  "easeInOutExpo",
  "easeInCirc",
  "easeOutCirc",
  "easeInOutCirc",
  "easeInElastic",
  "easeOutElastic",
  "easeInOutElastic",
  "easeInBack",
  "easeOutBack",
  "easeInOutBack",
  "easeInBounce",
  "easeOutBounce",
  "easeInOutBounce"
];

export default {
  init: () => {},
  destroy: () => {
    removeBackgroundProp();
  },
  render: (_, renderer) => groupList.forEach(renderer.draw, renderer),
  props: gui => {
    thisGUIInstance = gui;
    removeBackgroundProp();

    thisGUIItemInstance.push(
      gui
        .add(Props, "aimationType", avaliableAnimationTypes)
        .onChange(function(aimationType) {
          rect.aimationType = aimationType;
          circle.aimationType = aimationType;
        })
    );

    thisGUIItemInstance.push(
      gui.addColor(Props, "background").onChange(function(background) {
        rect.background = background;
        circle.background = background;
      })
    );
  }
};
