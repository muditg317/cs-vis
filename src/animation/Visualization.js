import Visualizer from 'components/visualizer';
import { Colors } from 'utils';

export default class Visualization {
    constructor(animator) {
        this.x = 20;
        this.y = 20;

        if (this.constructor.SUPPORTS_TEXT) {
            this.displayText = "Animation Ready";
            this.displayTextColor = [0,0,0];
        } else {
            delete this.showText;
            delete this.updateText;
        }

        this.animator = animator;

        this.animationHistory = [];
        this.animationQueue = [];
        this.animating = false;

        if (!this.constructor.SUPPORTS_NO_LOOP) {
            delete this.beginDrawLoop;
            delete this.endDrawLoop;
        }
    }

    reset() {
        if (this.constructor.SUPPORTS_TEXT) {
            this.displayText = "Animation Ready";
            this.displayTextColor = [0,0,0];
        }

        this.animationHistory = [];
        this.animationQueue = [];
        this.animating = false;
    }

    updateText(text, color = Colors.BLACK) {
        this.animationQueue.push({method:this.showText,params:[text,color],});
    }

    showText(text, color = Colors.BLACK) {
        this.displayText = text;
        this.displayTextColor = color;
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

    isAnimStart(animation) {
        return animation.method === this.animator.emit && animation.params[0] === "anim-start";
    }

    isAnimEnd(animation) {
        return animation.method === this.animator.emit && animation.params[0] === "anim-end";
    }

    noAnimation(animation) {
        return animation.noAnim
                || (animation.method === this.animator.emit && (animation.params[0] === "anim-start" || animation.params[0] === "anim-end"))
                || (animation.method === this.showText);
    }

    popAnimation(animationSpeed) {
        if (!this.animating) {
            if (this.animationQueue.length > 0) {
                let animation = this.animationQueue.shift();
                this.animating = true;
                let retVal = animation.method.apply(animation.scope || this, animation.params);
                if (this.isAnimStart(animation)) {
                    this.runningAnimation = [];
                } else if (this.isAnimEnd(animation)) {
                    this.animationHistory.push(this.runningAnimation);
                    this.runningAnimation = null;
                } else {
                    if (this.runningAnimation) {
                        this.runningAnimation.push(animation);
                    } else {
                        this.animationHistory.push(animation);
                    }
                }
                if (animation.explanation) {
                    if (animation.explanationUsesReturn) {
                        animation.explanation = animation.explanation.replace("|RETURN|", retVal);
                    }
                    this.showText(animation.explanation);
                }
                if (this.constructor.SUPPORTS_CUSTOM_END) {
                    if (this.noAnimation(animation)) {
                        this.animating = false;
                    } else if (!animation.customEnd) {
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

    beginDrawLoop() {
        this.animator.loop();
    }

    endDrawLoop() {
        this.animationQueue.push({method:this.animator.noLoop,scope:this.animator,params:[],});
    }

    draw(p5) {
        p5.push();
        if (this.constructor.SUPPORTS_TEXT) {
            p5.fill(...this.displayTextColor);
            p5.textSize(15);
            p5.textAlign(p5.LEFT, p5.TOP);
            p5.text(this.displayText, 2.5,2.5);
        }
        p5.pop();
    }

    mousePressed(p5) {
        return true;
    }

    mouseReleased(p5) {
        return true;
    }

    windowResized(p5, height, numScrollbars, maxY) {
        height -= numScrollbars * 16;
        let width = p5.windowWidth;
        if (maxY > (height - (2*this.y))) {
            height = (maxY + (3*this.y))
            if (!document.querySelector(".canvas-container").classList.contains("mobile")) {
                width -= 16;
            }
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
