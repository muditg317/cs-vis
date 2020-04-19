import { Colors } from 'utils';

export default class AttractedHighlightableObject {
    static ATTRACTION = 0.2;
    static MIN_DISTANCE = 5;

    static HIGHTLIGHT_WIDTH = 5;
    static HIGHLIGHT_CIRCLE = 0;
    static HIGHLIGHT_SQUARE = 1;

    constructor(x,y, options = {}) {
        this.value = options.value || null;

        this.currentX = x;
        this.currentY = y;
        this.desiredX = x;
        this.desiredY = y;
        this.vx = 0;
        this.vy = 0;
        this.frozen = false;
        this.onStop = [];

        this.highlighted = false;
        this.highlightColor = Colors.BLACK;
        this.highlightShape = AttractedHighlightableObject.HIGHLIGHT_CIRCLE;

        Object.entries(options).forEach((option) => {
            this[option[0]] = option[1];
        });

    }

    shift(x,y) {
        this.desiredX = x;
        this.desiredY = y;
    }

    goTo(x,y) {
        this.desiredX = x;
        this.desiredY = y;
        this.stop();
    }

    displacement() {
        return Math.sqrt(Math.pow(this.desiredX - this.currentX,2) + Math.pow(this.desiredY - this.currentY,2));
    }

    addOnStop(callback) {
        this.onStop.push(callback);
    }

    stop() {
        this.currentX = this.desiredX;
        this.vx = 0;
        this.currentY = this.desiredY;
        this.vy = 0;
        while (this.onStop.length > 0) {
            this.onStop.shift()(this);
        }
    }

    highlight(color = Colors.BLUE, shape = AttractedHighlightableObject.HIGHLIGHT_CIRCLE) {
        this.highlightColor = color;
        this.highlightShape = shape;
        this.highlighted = true;
    }

    unhighlight() {
        this.highlighted = false;
    }

    update(animationSpeed, p5) {
        if (this.frozen) {
            this.desiredX = this.currentX;
            this.desiredY = this.currentY;
        }
        let deltaX = this.desiredX - this.currentX;
        let deltaY = this.desiredY - this.currentY;
        if (isNaN(this.currentX) || isNaN(this.currentY) || isNaN(this.vx) || isNaN(this.vy)) {
            this.stop();
        } else {
            if (deltaY !== 0 || deltaX !== 0) {
                let angle = Math.atan(deltaY/deltaX);
                if (deltaX < 0) {
                    angle += Math.PI;
                }
                let magnitude = AttractedHighlightableObject.ATTRACTION * animationSpeed;
                let prevAngle = Math.atan(this.vy/this.vx);
                if (this.vx < 0) {
                    prevAngle += Math.PI;
                }
                this.vx = magnitude * Math.cos(angle);
                this.vy = magnitude * Math.sin(angle);

                // this.vx *= 0.75;
                // this.vy *= 0.75;

                if (Math.abs(Math.abs(prevAngle - angle) - Math.PI) < (Math.PI/12)) {
                    this.stop();
                }
                this.currentX += this.vx;
                this.currentY += this.vy;
            } else {
                this.stop();
            }
        }
        return Math.sqrt(Math.pow(deltaX,2) + Math.pow(deltaY,2));
    }

    drawHighlight(p5) {
        p5.push();
        p5.stroke(...this.highlightColor);
        p5.noFill();
        p5.strokeWeight(AttractedHighlightableObject.HIGHTLIGHT_WIDTH);
        let diameter = 2 * (this.highlightInnerRadius || this.highlightOuterRadius) + (this.highlightInnerRadius ? 1 : -1) * AttractedHighlightableObject.HIGHTLIGHT_WIDTH;
        if (this.highlightShape === AttractedHighlightableObject.HIGHLIGHT_CIRCLE) {
            p5.circle(this.currentX, this.currentY, diameter);
        } else if (this.highlightShape === AttractedHighlightableObject.HIGHLIGHT_SQUARE) {
            p5.square(this.currentX - diameter/2, this.currentY - diameter/2, diameter);
        }
        p5.pop();
    }

    drawValue(p5) {
        if (this.value) {
            p5.textAlign(p5.CENTER, p5.CENTER);
            p5.fill(0);
            p5.stroke(0);
            let radius = 2 * (this.highlightInnerRadius || this.highlightOuterRadius) + (this.highlightInnerRadius ? 1 : -1) * AttractedHighlightableObject.HIGHTLIGHT_WIDTH;
            p5.text(this.value.toString(), this.currentX - radius,this.currentY - radius, 2*radius, 2*radius);
        }
    }

    draw(p5) {
        p5.push();
        if (this.highlighted) {
            this.drawHighlight(p5);
        }
        this.drawValue(p5);
        p5.pop();
    }
}
