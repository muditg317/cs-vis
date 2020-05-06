import { AttractedHighlightableObject } from './';

export default class TrackingHighlighter extends AttractedHighlightableObject {
    constructor(target, offset, options = {}) {
        super(0,0, options);

        this.offset = offset;

        this.target = target;
        this.locked = false;
    }

    stop() {
        super.stop();
        this.locked = true;
    }

    setTarget(target) {
        this.locked = this.target === null;
        this.target = target;
        if (target) {
            this.highlight();
        } else {
            this.unhighlight();
        }
    }

    trackTarget() {
        if (this.target) {
            // console.log("tracking");
            this.desiredX = this.target.currentX + this.offset;
            this.desiredY = this.target.currentY + this.offset;
            if (this.locked) {
                this.currentX = this.desiredX;
                this.currentY = this.desiredY;
            }
        }
    }

    update(animationSpeed, p5) {
        this.trackTarget();
        super.update(animationSpeed, p5)
    }
}
