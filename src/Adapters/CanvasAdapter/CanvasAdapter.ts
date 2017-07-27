import CanvasEventsListener from './CanvasEventsListener';

export default class CanvasAdapter {
    private elementNode = null;
    private canvasNode = null;
    private ctx = null;
    private cache = [];
    private eventListener;
    public antiAliasing: boolean = false;


    private createCanvas() {
        this.canvasNode = document.createElement('canvas');
        this.elementNode.appendChild(this.canvasNode);
    }


    private initContext() {
        this.ctx = this.canvasNode.getContext('2d');
    }


    appendTo(elementNode: HTMLElement) {
        this.elementNode = elementNode;

        this.createCanvas();
        this.initContext();
        this.autoSize();
        this.eventListener = new CanvasEventsListener(this.canvasNode, this.cache);
        return this;
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


    draw(element) {
        this.cache.push(element);

        switch (element.type) {
            case 'circle': return this.drawCircle(element);
            case 'text': return this.drawText(element);
            case 'group': return element.children.forEach(this.draw, this);
        }
    }


    drawText({ x, y, text, background, font, fontSize, align }) {
        if (align) {
            const textSize = this.ctx.measureText(text);

            if (align === 'center') {
                x += textSize.width / 2;
                y += fontSize / 2;
            }
        }

        this.ctx.font = font;
        this.ctx.fillStyle = background;
        this.ctx.fillText(text, x, y);
    }


    drawCircle({ x, y, radius, background, lineWidth, borderColor }) {
        if (!this.antiAliasing) {
            x += .5;
            y += .5;
        }

        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2, false);
        this.ctx.lineWidth = lineWidth;

        if (background !== '') {
            this.ctx.fillStyle = background;
            this.ctx.fill();
        }

        if (borderColor !== '') {
            this.ctx.strokeStyle = borderColor;
            this.ctx.storke();
        }
    }

    clear() {
        this.cache.length = 0;
        this.ctx.clearRect(0, 0, this.canvasNode.width, this.canvasNode.height);
    }
}