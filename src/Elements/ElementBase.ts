export default class ElementBase {
    public x: Number = 0;
    public y: Number = 0;
    public lineWidth:Number = 1;
    public borderColor:String = '';
    public background:String = '';

    moveTo(x: Number, y: Number) {
        this.x = x;
        this.y = y;
    }
}