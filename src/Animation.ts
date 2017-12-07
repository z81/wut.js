import { animationTypes } from "./AnimationTypes";

const ANIMATION_SPEED = {
  slow: 1500,
  fast: 100
};

const ANIMATION_FPS = 60;

const activeAnimations = new Map();

const getAnimationTiming = (type, t, b, c, d) => {
  const isFunctionAnimation = typeof type === "function";

  if (!isFunctionAnimation && animationTypes[type] === undefined) {
    throw Error("Unknown animation type");
  }

  const animation = isFunctionAnimation ? type : animationTypes[type];

  return animation(t, b, c, d);
};


class AnimationCreator {
  private steps = [];
  private activeAnimations = [];

  constructor(config, time) {
    if (config) {
      this.step(config, time);
    }
  }

  step(config, animationDuration) {
    if (typeof config === "object") {
      const keys = Object.keys(config);

      keys.forEach(attribute => {
        const actionType = "attribute";
        const endValue = config[attribute];
        const timingType = config.timing;

        this.steps.push({
          actionType,
          attribute,
          endValue,
          timingType,
          animationDuration
        });
      });
    }
  }

  end() {
    return this.animationHandler.bind(this);
  }

  stopAnimation(canvasTarget) {
    const animations = activeAnimations.get(canvasTarget);
    animations.forEach(id => clearInterval(id));
    animations.length = 0;
  }

  private animationHandler({ canvasTarget }) {
    if (!activeAnimations.has(canvasTarget)) {
      activeAnimations.set(canvasTarget, []);
    }

    this.stopAnimation(canvasTarget);
    this.steps.forEach(this.animateStep.bind(this, canvasTarget));
  }

  private animateStep(canvasTarget, animationConfig) {
    const animations = activeAnimations.get(canvasTarget);
    const { attribute, endValue } = animationConfig;
    animationConfig.startValue = canvasTarget[attribute];

    let i = 0;
    const interval = setInterval(() => {
      this.startAnimationTimer(canvasTarget, animationConfig, i);

      i += 1000 / ANIMATION_FPS;
    }, 1000 / ANIMATION_FPS);

    animations.push(interval);
  }

  private startAnimationTimer(canvasTarget, animConfig, t) {
    const { startValue, endValue, attribute, animationDuration } = animConfig;
    const animationStepValue =
      (endValue - startValue) / (animationDuration / ANIMATION_FPS);
    const isAnimationCompleted =
      (endValue >= startValue && canvasTarget[attribute] >= endValue) ||
      (endValue <= startValue && canvasTarget[attribute] <= endValue);

    if (isAnimationCompleted) {
      this.stopAnimation(canvasTarget);
    } else {
      canvasTarget[attribute] = getAnimationTiming(
        canvasTarget.aimationType,
        t,
        startValue,
        endValue - startValue,
        animationDuration
      );
    }
  }
}

export const Animation = (config, delay) => new AnimationCreator(config, delay);
export const animTypes = animationTypes;

export default Animation;
