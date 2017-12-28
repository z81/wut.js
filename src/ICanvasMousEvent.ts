import { ElementBase } from "../examples/editor/elements/ElementBase";

export interface ICanvasMouseEvent extends MouseEvent {
    canvasTarget: null | ElementBase,
    elementsOnCursot: any[],
    canvasOffsetX: number, 
    canvasOffsetY : number
}