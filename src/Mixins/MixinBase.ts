
class MixinBase {
    public isEnabled = true;


    disable() {
        this.isEnabled = false;
    }

    enable() {
        this.isEnabled = true;
    }
}

export default MixinBase;