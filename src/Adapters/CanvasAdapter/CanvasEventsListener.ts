import EventListener from "../../EventListener";
import ElementBase from "../../Elements/ElementBase";
import { Stage } from "../../Elements/Stage";

class CanvasEventsListener {
  private stage: Stage | null;
  private canvasNode: HTMLCanvasElement;
  private eventsForWatch = ["mousemove", "click", "mouseup", "mousedown", "dblclick"];
  private prevTarget: ElementBase | null = null;
  private viewOffset = { x: 0, y: 0 };

  constructor(canvasNode: HTMLCanvasElement, stage: Stage, viewOffset) {
    this.viewOffset = viewOffset;
    this.canvasNode = canvasNode;
    this.stage = stage;
    this.bindEventsListeners();
  }

  public xray(
    { type, x, y, radius, width, height, borderSize = 0, fontSize, align, isHidden }: any,
    pointX: number,
    pointY: number
  ) {
    if (isHidden) {
      return false;
    }

    if (type === "rect") {
      return (
        pointX >= x - borderSize &&
        pointX <= x + width + borderSize &&
        (pointY >= y - borderSize && pointY <= y + height + borderSize)
      );
    }

    if (type === "text") {
      if (align === "center") {
        x -= width / 2;
        y -= fontSize / 2;
      } else {
        y -= fontSize;
      }

      return (
        pointX >= x - 3 &&
        pointX <= x + width + 3 &&
        (pointY >= y - 3 && pointY <= y + fontSize + 3)
      );
    }

    if (type === "circle") {
      return (
        Math.pow(pointX - x - borderSize, 2) + Math.pow(pointY - y - borderSize, 2) <=
        Math.pow(radius + 1 + borderSize, 2)
      );
    }

    return false;
  }

  public fireEvent(
    eventName: string,
    event: Event,
    element: ElementBase
  ): boolean | void {
    if (EventListener.fire(eventName, event, element) === false) return false;

    if (element.type === "group") {
      for (let el of element.children) {
        if (EventListener.fire(eventName, event, el) === false) {
          return;
        }
      }
    }
  }

  public eventHandler = (eventName: string, event, root = this.stage.children) => {
    const x = event.offsetX - this.viewOffset.x;
    const y = event.offsetY - this.viewOffset.y;
    const isRoot = root === this.stage.children;

    event.canvasOffsetX = x;
    event.canvasOffsetY = y;
    event.canvasTarget = null;

    if (isRoot) {
      event.elementsOnCursor = [];
    }

    for (let element of root) {
      if (element.type === "group") {
        const inGroup = this.eventHandler(eventName, event, element.children);
        if (inGroup === true) {
          event.elementsOnCursor.push(element);
        }
      } else if (this.xray(element, x, y)) {
        event.elementsOnCursor.push(element);
      }
    }

    let target = null;

    if (event.elementsOnCursor.length > 0 && isRoot) {
      target = event.elementsOnCursor[event.elementsOnCursor.length - 1];
      const sortZ = event.elementsOnCursor.sort((a, b) => a.z > b.z);

      for (let i = sortZ.length - 1; i >= 0; i--) {
        event.canvasTarget = sortZ[i];
        EventListener.fire(eventName, event, event.canvasTarget);
        break;
      }
    } else {
      // EventListener.fire(eventName, event, event.canvasTarget)
    }

    if (isRoot) {
      const isGroup = target && target.type === "group";
      if (!isGroup && target !== this.prevTarget) {
        if (this.prevTarget !== null) {
          EventListener.fire("mouseleave", event, this.prevTarget);
        }

        if (target !== null) {
          EventListener.fire("mouseenter", event, target);
        }

        this.prevTarget = target;
      }

      if (target === null) {
        EventListener.fire(eventName, event, null);
      }
    }

    return null;
  };

  private bindEventsListeners() {
    this.eventsForWatch.forEach(eventName => {
      const handler = this.eventHandler.bind(this, eventName);
      this.canvasNode.addEventListener(eventName, handler, false);
    });
  }

  public clear() {
    this.prevTarget = null;
  }
}

export default CanvasEventsListener;
