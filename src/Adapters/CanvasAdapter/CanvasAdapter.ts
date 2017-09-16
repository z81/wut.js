import CanvasEventsListener from "./CanvasEventsListener";
import EventListener from "../../EventListener";

export default class CanvasAdapter {
  private elementNode = null;
  private canvasNode = null;
  private ctx = null;
  private cache = [];
  private eventListener;
  public antiAliasing: boolean = false;

  private createCanvas() {
    this.canvasNode = document.createElement("canvas");
    this.elementNode.appendChild(this.canvasNode);
  }

  private initContext() {
    this.ctx = this.canvasNode.getContext("2d");
  }

  appendTo(elementNode: HTMLElement) {
    this.elementNode = elementNode;

    this.createCanvas();
    this.initContext();
    this.autoSize();
    this.eventListener = new CanvasEventsListener(this.canvasNode, this.cache);
    this.bindEvents();
    return this;
  }

  private bindEvents() {
    EventListener.on("mousemove", (event, element) => {
      this.setCursor(element.cursor);
    });

    EventListener.on("mouseleave", (event, element) => {
      this.setCursor(element.cursor);
    });
  }

  autoSize() {
    const { width, height } = this.elementNode.getBoundingClientRect();
    this.setSize(width, height);
  }

  setSize(width: Number, height: Number) {
    this.canvasNode.width = width;
    this.canvasNode.height = height;

    return this;
  }

  setCursor(cursor: string) {
    this.canvasNode.style.cursor = cursor;
  }

  draw(element, i) {
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

  drawRect(config) {
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

  drawText(config) {
    let { x, y, text, color, font, fontSize, align } = config;

    this.ctx.beginPath();
    this.ctx.font = font;
    this.ctx.fillStyle = color;

    if (align) {
      const textSize = this.ctx.measureText(text);

      if (align === "center") {
        x -= textSize.width / 2;
        y += fontSize / 2;
      }
    }

    this.configureCanvas(config);
    this.ctx.fillText(text, x, y);
  }

  drawCircle(config) {
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

  configureCanvas({ x, y, width, height, background, borderColor, lineWidth }) {
    if (background !== "") {
      this.ctx.fillStyle = background;
    }

    if (borderColor !== "") {
      this.ctx.strokeStyle = borderColor;
    }

    if (lineWidth !== undefined) {
      this.ctx.lineWidth = lineWidth;
    }
  }

  clear() {
    this.cache.length = 0;
    this.ctx.clearRect(0, 0, this.canvasNode.width, this.canvasNode.height);
  }
}
