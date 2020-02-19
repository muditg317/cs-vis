export default class AnimatedObject {
    constructor() {
        this.xProgress = 1;
        this.yProgress = 1;
        // this.translationFrames = 0;

        // this.animating = false;
    }

    travel() {
        this.xProgress = 0;
        this.yProgress = 0;
    }

    inPosition() {
        return this.xProgress >= 1 && this.xProgress >= 1;
    }

    update(animationSpeed) {
        if (!this.inPosition()) {
            // this.animating = true;
            this.xProgress += 0.01;
            this.yProgress += 0.01;
        } else {
            // this.animating = false;
        }
    }


}
