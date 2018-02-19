import { Rect } from "../Elements/Rect";
import MixinBase from "./MixinBase";
import ElementBase from "../Elements/ElementBase";

const draggedElements = new Set();
const startDragPositions = new Map();
const startDragElementPositions = { x: 0, y: 0 };

/**
 * Определяет какой элемент является основным для перетаскивания
 * необходимо для реализации сетки
 * @param element
 * @param handlers
 */
const getOffsetHandler = (element, handlers) => {
  let offsetElement = element;
  if (handlers.length) offsetElement = handlers[0];
  if (element.type === "group") offsetElement = element.children[0];

  return offsetElement;
};

const startDrag = (element, handlers, e) => {
  if (handlers.length) {
    const handlersONCursor = e.elementsOnCursor.filter(e => handlers.indexOf(e) !== -1);

    if (handlersONCursor.length !== e.elementsOnCursor.length) {
      return;
    }
  }

  startDragPositions.set(element, [e.clientX, e.clientY]);
  draggedElements.add(element);

  const offsetElement = getOffsetHandler(element, handlers);
  startDragElementPositions.x = offsetElement.x * 1;
  startDragElementPositions.y = offsetElement.y * 1;

  element.fire("dragstart", e, element);
  return false;
};

const stopDrag = (element, handlers, e) => {
  if (!draggedElements.has(element)) return;

  draggedElements.delete(element);
  startDragPositions.delete(element);

  element.fire("dragend", e, element);
};

const roundNumber = (val, gridSize) => {
  return Math.round(val / gridSize) * gridSize;
};

let globalMoseMoveEventEnabled = false;

interface IDragHArguments {
  handlers: Rect[];
  gridSize?: number;
}

export function Draggable(config: IDragHArguments = { handlers: [], gridSize: 1 }) {
  class Draggable extends MixinBase {
    constructor(element) {
      super();

      element.on("mousedown", startDrag.bind(this, element, config.handlers));
      element.on("mouseup", stopDrag.bind(this, element, config.handlers));

      if (!globalMoseMoveEventEnabled) {
        document.addEventListener("mousemove", this.globalMouseMove);
        globalMoseMoveEventEnabled = true;
      }
      // Todo: descructor
    }

    private globalMouseMove = e => {
      draggedElements.forEach(element => {
        if (!element.mixins.draggable.isEnabled) return;

        if (e.buttons === 0) {
          draggedElements.delete(element);
        }

        if (draggedElements.has(element)) {
          this.drag(element, e);
        }
      });
    };

    private drag = (element, e) => {
      const [startOffsetX, startOffsetY] = startDragPositions.get(element);
      const x = roundNumber(
        startOffsetX - e.clientX - startDragElementPositions.x,
        config.gridSize
      );
      const y = roundNumber(
        startOffsetY - e.clientY - startDragElementPositions.y,
        config.gridSize
      );
      const offsetElement = getOffsetHandler(element, config.handlers);
      const dx = Math.round(-offsetElement.x - x);
      const dy = Math.round(-offsetElement.y - y);
      // Для округеления позиций по сетки в группе необходимо учитывать что позиции там не относительные
      // И применять округление нужно только к основному элементу, остальные же должны быть с отступом на основе
      // dx, dy позиции основного элемента

      this.moveElement(element, dx, dy);
      element.fire("drag", e, element);
    };

    private moveElement = (element, dx, dy) => {
      if (element.type === "group") {
        element.children.forEach((el, idx) => {
          this.moveElement(el, dx, dy);

          // if (idx === 0) {
          //     dx += el.x - xOld;
          //     dy += el.y - yOld;
          //     gridSize = 1;
          // }
        });
      } else if (element.type === "line") {
        for (let p of element["path"]) {
          p[0] = p[0] + dx;
          p[1] = p[1] + dy;
        }
      } else {
        element.fire("dragBeforeMove", { dx, dy }, element);

        element.x = element.x + dx;
        element.y = element.y + dy;
      }
    };
  }

  return Draggable;
}

export default Draggable;
