const ANIMATION_SPEED = {
    'slow': 1500,
    'fast': 100
};

const PARSE_ANIMATION_VALUE_REGEXP = /([\+\-\=]?)(\d*\.?\d*)(px|%|)/i;


class Step {
    private transofrms = [];

    constructor(config, time = 750) {
        const keys = Object.keys(config);
        keys.forEach(attribute => {
            const actionType = 'attribute';
            const attributeValue = config[attribute];
            const [
                _,
                modificationType = '=',

            ] = PARSE_ANIMATION_VALUE_REGEXP.exec(attributeValue);


            /*this.transofrms.push({
                modificationType,
                actionType,
                attribute,
                value,
                time
            });*/
        });
    }
}


class AnimationCreator {
    private steps = [];
    private activeAnimations = [];

    constructor(callback, time) {
        if (callback) {
            this.step(callback, time);
        }
    }


    step(config, time) {
        if (typeof config === 'object') {
            const keys = Object.keys(config);
            keys.forEach(attribute => {
                const actionType = 'attribute';
                const attributeValue = config[attribute];
                const [
                    _,
                    modificationType = '=',
                    value,
                    valueFormat = 'px'
                ] = PARSE_ANIMATION_VALUE_REGEXP.exec(attributeValue);

                this.steps.push({
                    modificationType,
                    actionType,
                    valueFormat,
                    attribute,
                    value,
                    time
                });
            });
        }
    }

    end() {
        return this.animationHandler.bind(this);
    }

    private animationHandler({ canvasTarget }) {
        const fps = 60;

        this.activeAnimations.forEach(id => clearInterval(id));
        this.activeAnimations.length = 0;

        this.steps.forEach(({ modificationType, actionType, valueFormat, attribute, value, time} ) => {
            let endValue = canvasTarget[attribute];
            let animationStepValue = value / (time / fps);
            if (modificationType === '+') endValue += parseInt(value);
            if (modificationType === '-') endValue -= value;
            if (modificationType === '=') {
                endValue = value;
                animationStepValue = (value - canvasTarget[attribute]) / (time / fps);
            }

            let activeAnimationId = 0;
            const interval = setInterval(() => {
                const isAnimationCompleted = (
                    (canvasTarget[attribute] > endValue && modificationType === '+') ||
                    (canvasTarget[attribute] <= endValue && modificationType === '-')
                );

                if (isAnimationCompleted) {
                    clearInterval(interval);
                    this.activeAnimations.splice(activeAnimationId, 1);
                }
                else {
                    if (modificationType === '+') {
                        console.log('+', canvasTarget[attribute], endValue)
                        canvasTarget[attribute] += animationStepValue;
                    }
                    else {
                        canvasTarget[attribute] -= animationStepValue;
                    }
                }
            }, 1000 / fps);

            activeAnimationId = this.activeAnimations.push(interval);

            console.log(canvasTarget[attribute], endValue)
        });
    }
}



export const Animation = (config, delay) => new AnimationCreator(config, delay);

export default Animation;