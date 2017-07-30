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

    private buildFont(fontSize: number, fontName: string) {
        return `${fontSize}px ${fontName}`;
    }

    public text: string = '';
    public type: string = 'text';
    private font: string = '14px Georgia';
    private _fontSize: number = 14;
    private _fontName: string = 'Georgia';
    public align: string = '';
    public color:string = '#fff';
}