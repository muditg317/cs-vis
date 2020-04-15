import Visualizer from 'components/visualizer';

export default class Visualization {
    constructor(animator) {

        this.x = 20;
        this.y = 20;

        this.animator = animator;

        this.animationHistory = [];
        this.animationQueue = [];
        this.animating = false;
    }

    addAnimation(animation) {
        this.animationQueue.push({method:this.animator.emit,scope:this.animator,params:["anim-start",],});
        this.animationQueue.push(...animation);
        this.animationQueue.push({method:this.animator.emit,scope:this.animator,params:["anim-end",],});
    }

    doneAnimating(time = 250) {
        if (time === 0) {
            this.animating = false;
            return;
        }
        setTimeout(() => {
            this.animating = false;
        }, time);
    }

    update(callForward, animationSpeed, p5) {
        if (this.constructor.SET_BOUNDS) {
            this.width = p5.width - 2 * this.x;
            this.height = p5.height - 2 * this.y;
        }
        callForward();
        this.popAnimation(animationSpeed);
    }

    popAnimation(animationSpeed) {
        if (!this.animating) {
            if (this.animationQueue.length > 0) {
                let animation = this.animationQueue.shift();
                this.animating = true;
                animation.method.apply(animation.scope || this, animation.params);
                if (this.constructor.SUPPORTS_CUSTOM_END) {
                    if (!animation.customEnd) {
                        if (animationSpeed >= Math.floor(Visualizer.maxAnimationSpeed())) {
                            this.animating = false;
                        } else {
                            this.doneAnimating(this.constructor.MAX_ANIM_TIME / animationSpeed);
                        }
                    }
                }
            }
        }
    }

    draw(p5) {
        p5.push();

        p5.pop();
    }

    mousePressed(p5) {
        return true;
    }

    mouseReleased(p5) {
        return true;
    }

    windowResized(p5, height, maxY) {
        let width = p5.windowWidth;
        if (maxY > (height - (2*this.y))) {
            height = (maxY + (3*this.y))
            width -= 16;
            document.querySelector(".canvas-container").classList.add("overflow");
        } else {
            document.querySelector(".canvas-container").classList.remove("overflow");
        }

        if (height > p5.height) {
            p5.resizeCanvas(width, height);
        } else {
            p5.resizeCanvas(width, p5.height);
        }

        if (this.constructor.SET_BOUNDS) {
            this.width = p5.width - 2 * this.x;
            this.height = p5.height - 2 * this.y;
        }
    }
}
