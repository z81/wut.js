import ElementBase from "./Elements/ElementBase";

export interface ICanvasMouseEvent extends MouseEvent {
  canvasTarget: null | ElementBase;
  elementsOnCursot: any[];
  canvasOffsetX: number;
  canvasOffsetY: number;
}
