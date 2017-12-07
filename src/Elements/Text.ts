import ElementBase from './ElementBase';

export class Text extends ElementBase {
    get fontName(): string {
        return this._fontName;
    }

    set fontName(value: string) {
        this.font = this.buildFont(this._fontSize, value);
        this._fontName = value;
    }

    get fontSize(): number {
        return this._fontSize;
    }

    set fontSize(value: number) {
        this.font = this.buildFont(value, this._fontName);
        this._fontSize = value;
    }

    public set font(value) {
        const [size, name] = value.split(' ');
        this._fontSize = parseInt(size, 10);
        this._fontName = name;
    }

    public get font() {
        return this.buildFont(this._fontSize, this._fontName);
    }

    private buildFont(fontSize: number, fontName: string) {
        return `${fontSize}px ${fontName}`;
    }

    public type: string = 'text';
    private _fontSize: number = 14;
    private _fontName: string = 'Georgia';
}