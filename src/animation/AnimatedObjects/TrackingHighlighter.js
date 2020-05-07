import { AttractedHighlightableObject } from './';
import { Colors } from 'utils';

export default class TrackingHighlighter extends AttractedHighlightableObject {
    constructor(target, offset, options = {}) {
        super(0,0, options);

        this.highlightInnerRadius = offset;

        this.target = target;
        this.locked = false;
    }

    stop() {
        super.stop();
        this.locked = true;
    }

    setTarget(target, innerRadius, asRedSquare) {
        this.locked = this.target === null;
        this.target = target;
        if (innerRadius) {
            this.highlightInnerRadius = innerRadius;
        }
        if (target) {
            this.highlight(asRedSquare ? Colors.RED : undefined, asRedSquare ? AttractedHighlightableObject.HIGHLIGHT_SQUARE : undefined);
        } else {
            this.unhighlight();
        }
        // console.log(this.highlightInnerRadius);
    }

    trackTarget() {
        if (this.target) {
            // console.log("tracking");
            this.desiredX = this.target.currentX + this.highlightInnerRadius;
            this.desiredY = this.target.currentY + this.highlightInnerRadius;
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
