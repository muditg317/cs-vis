export default class AttractedDraggableObject {

    static ATTRACTION = 0.3;
    static MIN_DISTANCE = 10;

    constructor(x,y) {
        this.currentX = x;
        this.currentY = y;
        this.desiredX = x;
        this.desiredY = y;
        this.vx = 0;
        this.vy = 0;
        this.pinnedToMouse = false;
    }

    shift(x,y) {
        this.desiredX = x;
        this.desiredY = y;
    }

    displacement() {
        return Math.sqrt(Math.pow(this.desiredX - this.currentX,2) + Math.pow(this.desiredY - this.currentY,2));
    }

    pin() {
        if (!this.frozen) {
            this.pinnedToMouse = true;
        }
    }

    unpin() {
        this.pinnedToMouse = false;
        this.vx = 0;
        this.vy = 0;
    }

    setOnStop(callback) {
        this.onStop = callback;
    }

    update(animationSpeed, p5) {
        if (this.frozen) {
            this.desiredX = this.currentX;
            this.desiredY = this.currentY;
        }
        let deltaX = this.desiredX - this.currentX;
        let deltaY = this.desiredY - this.currentY;
        if (this.pinnedToMouse) {
            this.currentX = p5.mouseX;
            this.currentY = p5.mouseY;
        } else {
            if (deltaY !== 0 || deltaX !== 0) {
                let angle = Math.atan(deltaY/deltaX);
                if (deltaX < 0) {
                    angle += Math.PI;
                }
                let magnitude = AttractedDraggableObject.ATTRACTION * animationSpeed;
                this.vx += magnitude * Math.cos(angle);
                this.vy += magnitude * Math.sin(angle);

                this.vx *= 0.75;
                this.vy *= 0.75;

                if (Math.floor(Math.sqrt(Math.pow(deltaX,2) + Math.pow(deltaY,2))) <= AttractedDraggableObject.MIN_DISTANCE) {
                    this.currentX = this.desiredX;
                    this.vx = 0;
                    this.currentY = this.desiredY;
                    this.vy = 0;
                    if (this.onStop) {
                        this.onStop();
                        this.onStop = null;
                    }
                }
                this.currentX += this.vx;
                this.currentY += this.vy;
            } else {
                if (this.onStop) {
                    this.onStop();
                    this.onStop = null;
                }
            }
        }
        return Math.sqrt(Math.pow(deltaX,2) + Math.pow(deltaY,2));
    }
}
