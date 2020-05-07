import Visualizer from 'components/visualizer'
export default class AttractedDraggableObject {

    static ATTRACTION = 0.3;
    static MIN_DISTANCE = 5;

    constructor(x,y) {
        this.currentX = x;
        this.currentY = y;
        this.desiredX = x;
        this.desiredY = y;
        this.vx = 0;
        this.vy = 0;
        this.frozen = false;
        this.onStop = [];

        this.pinnedToMouse = false;
        this.mouseOffsetX = 0;
        this.mouseOffsetY = 0;
    }

    shift(x,y) {
        // console.log(this.data,":",x,y);
        this.desiredX = x;
        this.desiredY = y;
    }

    goTo(x,y) {
        // let oldX = this.desiredX;
        // let oldY = this.desiredY;
        this.desiredX = x;
        this.desiredY = y;
        this.stop();
        // return [oldX, oldY];
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

    pin(mouseX, mouseY) {
        if (this.constructor.CAN_DRAG) {
            if (!this.frozen) {
                this.pinnedToMouse = true;
                this.mouseOffsetX = mouseX - this.currentX;
                this.mouseOffsetY = mouseY - this.currentY;
            }
        }
    }

    unpin() {
        this.pinnedToMouse = false;
        this.mouseOffsetX = 0;
        this.mouseOffsetY = 0;
        this.vx = 0;
        this.vy = 0;
    }

    update(animationSpeed, p5) {
        if (this.frozen) {
            this.desiredX = this.currentX;
            this.desiredY = this.currentY;
        }
        let deltaX = this.desiredX - this.currentX;
        let deltaY = this.desiredY - this.currentY;
        if (this.pinnedToMouse) {
            this.currentX = p5.mouseX - this.mouseOffsetX;
            this.currentY = p5.mouseY - this.mouseOffsetY;
        } else if ((animationSpeed >= Math.floor(Visualizer.maxAnimationSpeed()))
                || (isNaN(this.currentX) || isNaN(this.currentY) || isNaN(this.vx) || isNaN(this.vy))) {
            this.stop();
        } else {
            // console.log("moving", this.desiredY, this.currentY);
            if (deltaY !== 0 || deltaX !== 0) {
                let angle = Math.atan(deltaY/deltaX);
                if (deltaX < 0) {
                    angle += Math.PI;
                }
                let magnitude = AttractedDraggableObject.ATTRACTION * animationSpeed;
                let prevAngle = Math.atan(this.vy/this.vx);
                if (this.vx < 0) {
                    prevAngle += Math.PI;
                }
                this.vx += magnitude * Math.cos(angle);
                this.vy += magnitude * Math.sin(angle);

                this.vx *= 0.75;
                this.vy *= 0.75;

                if (Math.abs(Math.abs(prevAngle - angle) - Math.PI) < (Math.PI/12)) {
                    this.stop();
                }
                this.currentX += this.vx;
                this.currentY += this.vy;
            } else {
                // console.log("stop");
                this.stop();
            }
        }
        return Math.sqrt(Math.pow(deltaX,2) + Math.pow(deltaY,2));
    }
}
