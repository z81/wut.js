import CanvasEventsListener from "./CanvasEventsListener";
import EventListener from "../../EventListener";
import ElementBase from '../../Elements/ElementBase';
import { Stage } from "../../Elements/Stage";
import * as elementRenders from "./elementRenders";

export default class CanvasAdapter {
  private elementNode: HTMLElement;
  private canvasNode: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D|null;
  private eventListener: CanvasEventsListener;
  public antiAliasing: boolean = false;
  public stage: Stage|null = null;

  /**
   * Create canvas element node
   */
  private createCanvas() {
    this.canvasNode = document.createElement("canvas");

    if (this.elementNode) {
      this.elementNode.appendChild(this.canvasNode);
    } else {
      throw Error("Element node is node defined");
    }
  }

  /**
   * Init canvas context
   */
  private initContext() {
    this.ctx = this.canvasNode.getContext("2d");
  }

  /**
   * append canvas to htlm element
   * @param CanvasAdapter 
   */
  appendTo(elementNode: HTMLElement): CanvasAdapter {
    this.elementNode = elementNode;

    this.createCanvas();
    this.initContext();
    this.autoSize();
    this.stage = new Stage();
    this.eventListener = new CanvasEventsListener(this.canvasNode, this.stage);
    this.bindEvents();
    return this;
  }

  /**
   * Bind events to canvas
   */
  private bindEvents(): void {
    EventListener.on("mousemove", (event: Event, element: ElementBase) => {
      this.setCursor(element.cursor);
    });

    EventListener.on("mouseleave", (event: Event, element: ElementBase) => {
      this.setCursor(element.cursor);
    });
  }

  /**
   * Auth resize canvas
   */
  autoSize(): void {
    const { width, height } = this.elementNode.getBoundingClientRect();
    this.resize(width, height);
  }

  /**
   * Resize canvas
   * @param width 
   * @param height 
   */
  resize(width: number, height: number): CanvasAdapter {
    this.canvasNode.width = width;
    this.canvasNode.height = height;

    return this;
  }

  /**
   * Set cursor
   * @param cursor css cursor propery value
   */
  setCursor(cursor: string): void {
    this.canvasNode.style.cursor = cursor;
  }

  /**
   * Render Element
   * @param element CanvasElement
   * @param i index
   */
  draw = (element: ElementBase, i: number) => {
    if (this.ctx === null) {
      throw Error("2D Context is note defined");
    }

    if (element.type === "group") {
      return element.children.forEach(this.draw, this);
    }

    let x = element.x;
    let y = element.y;

    if (!this.antiAliasing) {
      x += 0.5;
      y += 0.5;
    }

    this.configureCanvas(element);
    elementRenders[element.type](x, y, this.ctx, element);
  }


  /**
   * Set paramenters to canvas
   * @param config canvas parameters
   */
  configureCanvas({
    x,
    y,
    width,
    height,
    background,
    borderColor,
    borderSize, 
    cursor,
    parent
  }: any) {
    if (this.ctx === null) {
      throw Error("2D Context is note defined");
    }

    this.ctx.fillStyle = background;
    this.ctx.strokeStyle = borderColor;

    if (borderSize !== undefined) {
      this.ctx.lineWidth = borderSize;
    }

    //  this.setCursor(parent && parent.cursor ? parent.cursor : cursor);
    // if (parent && parent.cursor) {
    //   this.setCursor(parent.cursor);
    // }
  }

  /**
   * Clear all
   */
  clear() {
    if (this.ctx === null) {
      throw Error("2D Context is note defined");
    }

    this.ctx.clearRect(0, 0, this.canvasNode.width, this.canvasNode.height);
  }

  /**
   * Render stage
   */
  render = () => {
    this.stage.children.forEach(this.draw);
  }

  clen() {
    this.clear();
    this.stage.clear();
    this.eventListener.clear();
  }
}
