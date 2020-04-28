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

        if (this.constructor.SUPPORTS_NO_LOOP) {
            this.drawing = false;
        } else {
            delete this.beginDrawLoop;
            delete this.endDrawLoop;
        }

        if (this.constructor.SUPPORTS_ANIMATION_CONTROL) {
            this.paused = false;
            this.undo = new Proxy(this, {
                get: function (target, propertyName, receiver) {
                    return target["undo_"+propertyName];
                }
            });
            this.redo = new Proxy(this, {
                get: function (target, propertyName, receiver) {
                    return target["redo_"+propertyName];
                }
            });
        } else {
            delete this.playPause;
            delete this.play;
            delete this.pause;
        }

    }

    reset() {
        if (this.constructor.SUPPORTS_TEXT) {
            this.displayText = "Animation Ready";
            this.displayTextColor = [0,0,0];
        }

        this.animationHistory = [];
        this.runningAnimation = [];
        this.animationQueue = [];
        this.animating = false;

        if (this.constructor.SUPPORTS_NO_LOOP) {
            this.stopDrawing();
        }
        if (this.constructor.SUPPORTS_ANIMATION_CONTROL) {
            // this.paused = false;
        }
    }

    playPause() {
        if (this.paused) {
            this.play();
        } else {
            this.pause();
        }
    }

    play() {
        this.paused = false;
        this.beginDrawLoop();
        this.animator.disable("stepBack");
        this.animator.disable("stepForward");
    }

    pause() {
        this.paused = true;
        this.endDrawLoop();
        if (this.canStepBack()) {
            this.animator.enable("stepBack");
        }
        if (this.canStepForward()) {
            this.animator.enable("stepForward");
        }
    }

    getLastTextAnimation() {
        if (this.runningAnimation) {
            for (let i = this.runningAnimation.length-1; i >= 0; i--) {
                if (this.runningAnimation[i].method === this.showText || this.runningAnimation[i].explanation) {
                    return this.runningAnimation[i];
                }
            }
        }
        for (let i = this.animationHistory.length - 1; i >= 0; i--) {
            for (let j = this.animationHistory[i].length - 1; j >= 0; j++) {
                if (this.animationHistory[i][j].method === this.showText || this.animationHistory[i][j].explanation) {
                    return this.animationHistory[i][j];
                }
            }
        }
        return {method:this.showText,params:["Animation Ready"]};
    }
    undoText() {
        let textAnimation = this.getLastTextAnimation();
        if (textAnimation) {
            if (textAnimation.method === this.showText) {
                this.showText(...textAnimation.params);
            } else {
                this.showText(textAnimation.explanation);
            }
        }
    }

    undoAnimation(previousAnimation) {
        let scope = previousAnimation.scope || this;
        let undo = scope.undo;
        let undoMethod = undo[previousAnimation.method.name];
        let params = previousAnimation.params || [];
        // console.log(require('util').inspect(previousAnimation, { depth: null }));
        if (undoMethod) {
            // console.log("undo",undoMethod);
            if (previousAnimation.undoData) {
                params.push(...previousAnimation.undoData);
            }
            this.beginDrawLoop();
            undoMethod.apply(scope, params);
            this.undoText();
            if (!previousAnimation.customUndoEnd) {
                this.stopDrawing();
            }
        } else {
            // console.log("failed",previousAnimation);
        }
        this.animationQueue.unshift(previousAnimation);
    }

    unAnimate() {
        let previousAnimation = this.runningAnimation.pop();
        while (!previousAnimation.isAnimationStep) {
            this.undoAnimation(previousAnimation);
            previousAnimation = this.runningAnimation.pop();
            if (!previousAnimation) {
                return;
            }
        }
        this.undoAnimation(previousAnimation);
    }

    canStepBack() {
        return this.animationHistory.length > 0 || this.runningAnimation.length > 0;
    }
    stepBack() {
        if (this.paused) {
            if (this.runningAnimation && this.runningAnimation.length > 0) {
                this.unAnimate();
                this.animator.enable("stepForward");
                if (this.runningAnimation.length === 0) {
                    this.animationQueue.unshift({method:this.animator.emit,scope:this.animator,params:["anim-start",],noAnim:true});
                    if (this.animationHistory.length === 0) {
                        this.animator.disable("stepBack");
                    }
                }
            } else if (this.animationHistory.length > 0) {
                let previousAnimationSequence = this.animationHistory.pop();
                this.animator.emit("anim-start");
                this.animationQueue.unshift({method:this.stopDrawing,noAnim:true});
                this.animationQueue.unshift({method:this.animator.emit,scope:this.animator,params:["anim-end",],noAnim:true});
                this.runningAnimation = previousAnimationSequence;
                this.stepBack();
            }
        }
    }

    redoAnimation(nextAnimation) {
        let scope = nextAnimation.scope || this;
        let method = nextAnimation.method;
        if (nextAnimation.customRedoEnd) {
            let redo = scope.redo;
            method = redo[method.name];
        }
        let params = nextAnimation.params || [];
        // console.log(require('util').inspect(nextAnimation, { depth: null }));
        // console.log("redo",method);
        if (nextAnimation.redoData) {
            params.push(...nextAnimation.redoData);
        }
        this.beginDrawLoop();
        let retVal = method.apply(scope, params);
        nextAnimation.returnValue = retVal;
        if (this.isAnimStart(nextAnimation)) {
            this.runningAnimation = [];
        } else if (this.isAnimEnd(nextAnimation)) {
            this.animationHistory.push(this.runningAnimation);
            this.runningAnimation = null;
        } else if (this.isEndDrawLoopTrigger(nextAnimation)) {

        } else {
            if (this.runningAnimation) {
                this.runningAnimation.push(nextAnimation);
            } else {
                if (!this.constructor.SUPPORTS_ANIMATION_CONTROL) {
                    this.animationHistory.push(nextAnimation);
                }
            }
        }
        if (nextAnimation.explanation) {
            if (nextAnimation.explanationUsesReturn) {
                nextAnimation.explanation = nextAnimation.explanation.replace("|RETURN|", retVal);
            }
            this.showText(nextAnimation.explanation);
        }
        if (!nextAnimation.customRedoEnd) {
            this.stopDrawing();
        }
    }

    reAnimate() {
        let nextAnimation = this.animationQueue.shift();
        while (!nextAnimation.isAnimationStep && !this.isEndDrawLoopTrigger(nextAnimation)) {
            this.redoAnimation(nextAnimation);
            nextAnimation = this.animationQueue.shift();
            if (!nextAnimation) {
                return;
            }
        }
        this.redoAnimation(nextAnimation);
        if (!nextAnimation.customRedoEnd && !this.isEndDrawLoopTrigger(nextAnimation)) {
            if (!this.animationQueue[0].isAnimationStep) {
                nextAnimation = this.animationQueue.shift();
                while (!nextAnimation.isAnimationStep && !this.isEndDrawLoopTrigger(nextAnimation)) {
                    this.redoAnimation(nextAnimation);
                    nextAnimation = this.animationQueue.shift();
                    if (!nextAnimation) {
                        return;
                    }
                }
            }
        }
    }

    canStepForward() {
        return this.animationQueue.length > 0;
    }
    stepForward() {
        if (this.paused) {
            if (this.animationQueue.length > 0) {
                this.reAnimate();
                this.animator.enable("stepBack");
                if (this.animationQueue.length === 0) {
                    this.animator.disable("stepForward");
                } else {
                    this.animator.enable("stepForward");
                }
            }
        }
    }


    updateText(text, color = Colors.BLACK) {
        this.animationQueue.push({method:this.showText,params:[text,color],});
    }

    showText(text, color = Colors.BLACK) {
        this.displayText = text;
        this.displayTextColor = color;
    }
    undo_showText(text, color) {
        return this.showText(text, color);
    }

    addAnimation(animation) {
        this.animationQueue.push({method:this.animator.emit,scope:this.animator,params:["anim-start",],noAnim:true});
        this.animationQueue.push(...animation);
        this.animationQueue.push({method:this.animator.emit,scope:this.animator,params:["anim-end",],noAnim:true});
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
        if (!this.constructor.SUPPORTS_ANIMATION_CONTROL || !this.paused) {
            this.popAnimation(animationSpeed);
        }
    }

    isAnimStart(animation) {
        return animation.method === this.animator.emit && animation.params[0] === "anim-start";
    }

    isAnimEnd(animation) {
        return animation.method === this.animator.emit && animation.params[0] === "anim-end";
    }

    isEndDrawLoopTrigger(animation) {
        return animation.method === this.stopDrawing;
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
                // console.log(animation.method);
                let retVal = animation.method.apply(animation.scope || this, animation.params);
                animation.returnValue = retVal;
                if (this.isAnimStart(animation)) {
                    this.runningAnimation = [];
                } else if (this.isAnimEnd(animation)) {
                    this.animationHistory.push(this.runningAnimation);
                    this.runningAnimation = null;
                } else if (this.isEndDrawLoopTrigger(animation)) {
                    if (this.animationQueue.length > 0) {
                        this.beginDrawLoop();
                    }
                } else {
                    if (this.runningAnimation) {
                        this.runningAnimation.push(animation);
                    } else {
                        if (!this.constructor.SUPPORTS_ANIMATION_CONTROL) {
                            this.animationHistory.push(animation);
                        }
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
        this.drawing = true;
    }

    endDrawLoop() {
        if (this.drawing) {
            this.animationQueue.push({method:this.stopDrawing,noAnim:true});
        }
    }

    stopDrawing() {
        this.animator.noLoop();
        this.drawing = false;
    }

    draw(p5) {
        p5.push();
        if (this.constructor.SUPPORTS_TEXT) {
            p5.fill(...this.displayTextColor);
            p5.textSize(15);
            p5.textAlign(p5.LEFT, p5.TOP);
            p5.text(this.displayText, 2.5,2.5, this.width,60);
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
