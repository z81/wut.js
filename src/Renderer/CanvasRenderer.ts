export default class CanvasRenderer {
    private elementNode = null;
    private canvasNode = null;
    private ctx = null;
    public antiAliasing: boolean = false;

    constructor(element) {
        this.setRootNode(element);
        this.createCanvas();
        this.initContext();
        this.autoSize();
    }


    private createCanvas() {
        this.canvasNode = document.createElement('canvas');
        this.elementNode.appendChild(this.canvasNode);
    }


    private initContext() {
        this.ctx = this.canvasNode.getContext('2d');
    }


    setRootNode(elementNode: HTMLElement) {
        this.elementNode = elementNode;
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

        switch (element.type) {
            case 'circle': this.drawCircle(element);
        }
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
        this.ctx.clearRect(0, 0, this.canvasNode.width, this.canvasNode.height);
    }
}