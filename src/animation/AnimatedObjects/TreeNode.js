import { AttractedDraggableObject } from './';
import { Colors, Utils } from 'utils';

export default class TreeNode extends AttractedDraggableObject {
    static SIZE = 50;

    constructor(x,y, data) {
        super(x,y);

        this.data = data;

        this.left = null;
        this.right = null;

        this.readyToFollow = true;
    }

    getCenterXY() {
        let centerX = this.currentX + this.constructor.SIZE/2;
        let centerY = this.currentY + this.constructor.SIZE/2;
        return [centerX, centerY];
    }

    containsPos(x,y) {
        let [centerX, centerY] = this.getCenterXY();
        return Math.pow(Math.pow(centerX - x, 2) + Math.pow(centerY - y, 2), 0.5) <= this.constructor.SIZE/2;
    }

    containsMousePin() {
        return this.pinnedToMouse || (this.left && this.left.containsMousePin()) || (this.right && this.right.containsMousePin());
    }

    shiftDown() {
        super.shift(this.desiredX, this.desiredY + this.constructor.VSPACE);
    }

    shiftUp() {
        super.shift(this.desiredX, this.desiredY - this.constructor.VSPACE);
    }

    shiftX(x) {
        super.shift(x, this.desiredY);
    }

    setY(y) {
        super.shift(this.desiredX, y);
    }

    update(animationSpeed, p5) {
        super.update(animationSpeed, p5)
        // if (this.left) {
        //     this.left.update(animationSpeed, p5);
        // }
        // if (this.right) {
        //     this.right.update(animationSpeed, p5);
        // }
    }

    draw(p5) {
        p5.push();
        p5.fill(255);
        p5.stroke(...this.color);
        p5.circle(...this.getCenterXY(), this.constructor.SIZE);
        // p5.rect(this.currentX, this.currentY, this.constructor.SIZE, this.constructor.SIZE);
        // p5.line(this.currentX + this.constructor.SIZE, this.currentY, this.currentX + this.constructor.SIZE, this.currentY + this.constructor.SIZE);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.fill(...this.color);
        p5.text(this.data.toString(), this.currentX,this.currentY, this.constructor.SIZE,this.constructor.SIZE);
        if (this.left) {
            p5.stroke(...Utils.addArray(this.color, Colors.BLUE));
            p5.fill(...Utils.addArray(this.color, Colors.BLUE));
            let deltaX = this.left.currentX - this.currentX;
            let deltaY = this.left.currentY - this.currentY;
            let angle = Math.atan(deltaY/deltaX);
            if (deltaX < 0) {
                angle += Math.PI;
            }
            p5.line(...Utils.addArray(this.getCenterXY(),[Math.cos(angle)*this.constructor.SIZE/2,Math.sin(angle)*this.constructor.SIZE/2]),...Utils.addArray(this.left.getCenterXY(),[-Math.cos(angle)*this.constructor.SIZE/2,-Math.sin(angle)*this.constructor.SIZE/2]));
        } else {
            // p5.line(this.currentX + this.constructor.SIZE, this.currentY, this.currentX + this.constructor.SIZE, this.currentY + this.constructor.SIZE);
        }
        if (this.right) {
            p5.stroke(...Utils.addArray(this.color, Colors.BLUE));
            p5.fill(...Utils.addArray(this.color, Colors.BLUE));
            let deltaX = this.right.currentX - this.currentX;
            let deltaY = this.right.currentY - this.currentY;
            let angle = Math.atan(deltaY/deltaX);
            if (deltaX < 0) {
                angle += Math.PI;
            }
            p5.line(...Utils.addArray(this.getCenterXY(),[Math.cos(angle)*this.constructor.SIZE/2,Math.sin(angle)*this.constructor.SIZE/2]),...Utils.addArray(this.right.getCenterXY(),[-Math.cos(angle)*this.constructor.SIZE/2,-Math.sin(angle)*this.constructor.SIZE/2]));
        } else {
            // p5.line(this.currentX + this.constructor.SIZE, this.currentY, this.currentX + this.constructor.SIZE, this.currentY + this.constructor.SIZE);
        }
        p5.pop();
        // if (this.left) {
        //     this.left.draw(p5);
        // }
        // if (this.right) {
        //     this.right.draw(p5);
        // }
    }
}
