import CanvasEventsListener from "./CanvasEventsListener";
import EventListener from "../../EventListener";
import ElementBase from '../../Elements/ElementBase';

export default class CanvasAdapter {
  private elementNode: HTMLElement;
  private canvasNode: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D|null;
  private cache: ElementBase[] = [];
  private eventListener: CanvasEventsListener;
  public antiAliasing: boolean = false;
  public stage: object|null = null;

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
    this.eventListener = new CanvasEventsListener(this.canvasNode, this.cache);
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
  draw(element: ElementBase, i: number) {
    this.cache.push(element);

    switch (element.type) {
      case "circle":
        return this.drawCircle(element);
      case "text":
        return this.drawText(element);
      case "rect":
        return this.drawRect(element);
      case "group":
        return element.children.forEach(this.draw, this);
    }
  }

  /**
   * Render reactangle
   * @param config Element config
   */
  drawRect(config: any) {
    if (this.ctx === null) {
      throw Error("2D Context is note defined");
    }

    let { x, y, background, borderColor, width, height, rotate } = config;

    if (!this.antiAliasing) {
      x += 0.5;
      y += 0.5;
    }

    //this.ctx.save();
    this.ctx.beginPath();
    this.configureCanvas(config);
    // if (rotate !== 0 && config._prevRotate !== rotate) {
    //   this.ctx.translate(x + width / 2, y + height / 2);
    //   this.ctx.rotate(rotate * Math.PI / 180);
    //   this.ctx.rect(-width / 2, -height, width, height);
    //   config._prevRotate = rotate;
    // } else if (rotate !== 0) {
    this.ctx.rect(x, y, width, height);
    // }

    this.ctx.stroke();
    this.ctx.fill();
    this.ctx.translate(0, 0);
    //this.ctx.restore();
  }

  /**
   * Render text
   * @param config 
   */
  drawText(config: any) {
    if (this.ctx === null) {
      throw Error("2D Context is note defined");
    }

    let { x, y, text, color, font, fontSize, align } = config;

    this.ctx.beginPath();
    this.ctx.font = font;

    if (align) {
      const textSize = this.ctx.measureText(text);

      if (align === "center") {
        x -= textSize.width / 2;
        y += fontSize / 2;
      }
    }

    this.configureCanvas(config);

    this.ctx.fillStyle = color;
    this.ctx.fillText(text, x, y);
  }

  /**
   * Render circle
   * @param config 
   */
  drawCircle(config: any) {
    if (this.ctx === null) {
      throw Error("2D Context is note defined");
    }

    let { x, y, radius, background, lineWidth, borderColor } = config;

    if (!this.antiAliasing) {
      x += 0.5;
      y += 0.5;
    }

    this.ctx.beginPath();
    this.configureCanvas(config);
    this.ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    this.ctx.stroke();
    this.ctx.fill();
    this.ctx.closePath();
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
    borderSize
  }: any) {
    if (this.ctx === null) {
      throw Error("2D Context is note defined");
    }

    this.ctx.fillStyle = background;
    this.ctx.strokeStyle = borderColor;

    if (borderSize !== undefined) {
      this.ctx.lineWidth = borderSize;
    }
  }

  /**
   * Clear all
   */
  clear() {
    if (this.ctx === null) {
      throw Error("2D Context is note defined");
    }

    this.cache.length = 0;
    this.ctx.clearRect(0, 0, this.canvasNode.width, this.canvasNode.height);
  }
}
