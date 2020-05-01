export default class AnimatedObject {
    constructor() {
        this.xProgress = 1;
        this.yProgress = 1;
        // this.translationFrames = 0;

        // this.animating = false;
        this.direction = 0;
    }

    travel(direction) {
        this.xProgress = 0;
        this.yProgress = 0;
        this.direction = direction;
    }

    inPosition() {
        return this.direction >= 0
                ? this.xProgress >= 1 && this.yProgress >= 1
                : this.xProgress <= -1 && this.yProgress <= -1;
    }

    update(animationSpeed) {
        if (!this.inPosition()) {
            // this.animating = true;
            this.xProgress += Math.sign(this.direction) * animationSpeed/200;
            this.yProgress += Math.sign(this.direction) * animationSpeed/200;
        } else {
            // this.animating = false;
        }
    }


}
