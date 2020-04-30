import Visualizer from 'components/visualizer';
import { Utils, Colors } from 'utils';

export default class Visualization {
    constructor(animator) {
        this.x = 20;
        this.y = 20;

        if (this.constructor.SUPPORTS_TEXT) {
            // this.displayText = "Animation Ready";
            // if (this.constructor.CAN_DRAG) {
            //     this.displayText += " | Click and drag on a node to move it!";
            // }
            // console.log(this.displayText);
            // this.displayTextColor = [0,0,0];
        } else {
            delete this.showText;
            delete this.updateText;
        }

        this.animator = animator;

        if (this.constructor.SUPPORTS_NO_LOOP) {
            // this.drawing = false;
        } else {
            delete this.beginDrawLoop;
            delete this.endDrawLoop;
        }

        if (this.constructor.SUPPORTS_ANIMATION_CONTROL) {
            this.paused = false;
            Utils.unfoldUndoRedo(this);
        } else {
            delete this.playPause;
            delete this.play;
            delete this.pause;
        }

        if (this.constructor.SUPPORTS_STOP_ID) {
            this.stopID = 0;
        }

    }

    reset() {
        if (this.constructor.SUPPORTS_TEXT) {
            this.displayText = "Animation Ready";
            if (this.constructor.CAN_DRAG) {
                this.displayText += " | Click and drag on a node to move it!";
            }
            this.displayTextColor = [0,0,0];
        }

        this.animationHistory = [];
        this.runningAnimation = [];
        this.animationQueue = [];
        this.animating = false;

        if (this.constructor.SUPPORTS_NO_LOOP) {
            this.stopDrawing(++this.stopID);
        }
        if (this.constructor.SUPPORTS_ANIMATION_CONTROL) {
            // this.paused = false;
        }
    }

    noAction() {}
    undo_noAction() {}

    playPause() {
        if (this.paused) {
            this.play();
        } else {
            this.pause();
        }
    }

    play() {
        this.paused = false;
        if (this.animationQueue.length > 0) {
            this.beginDrawLoop();
        }
        this.animator.disable("stepBack");
        this.animator.disable("skipBack");
        this.animator.disable("stepForward");
        this.animator.disable("skipForward");
    }

    pause() {
        this.animationQueue.unshift({method:this.setPaused,noAnim:true});
        this.beginDrawLoop();
    }

    setPaused() {
        this.stopDrawing.apply(this, (this.constructor.SUPPORTS_STOP_ID ? [++this.stopID,true] : []));
        this.paused = true;
        this.animator.enable("playPause");
        if (this.canStepBack()) {
            this.animator.enable("stepBack");
        }
        if (this.canSkipBack()) {
            this.animator.enable("skipBack");
        }
        if (this.canStepForward()) {
            this.animator.enable("stepForward");
        }
        if (this.canSkipForward()) {
            this.animator.enable("skipForward");
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
    undoText(explanation) {
        if (explanation) {
            this.showText(explanation);
            return;
        }
        let textAnimation = this.getLastTextAnimation();
        if (textAnimation) {
            if (textAnimation.method === this.showText) {
                this.showText(...textAnimation.params);
            } else {

            }
        }
    }

    undoAnimation(previousAnimation, doDraw) {
        let scope = previousAnimation.scope || this;
        // let undo = scope.undo;
        let undoMethod = previousAnimation.method.undo;
        let params = previousAnimation.undoData || previousAnimation.params || [];
        // console.log(require('util').inspect(previousAnimation, { depth: null }));
        if (undoMethod) {
            // console.log("undo",params,undoMethod);
            // if (previousAnimation.returnsUndoData) {
            //     params = previousAnimation.returnValue;
            // }
            if (doDraw) {
                this.beginDrawLoop();
            }
            undoMethod.apply(scope, params);
            this.undoText(previousAnimation.explanation);
            if (!previousAnimation.customUndoEnd) {
                this.stopDrawing(++this.stopID);
            }
        } else {
            // console.log("failed",previousAnimation);
        }
        this.animationQueue.unshift(previousAnimation);
    }

    unAnimate(doDraw) {
        if (doDraw) {
            this.ensureDrawn();
        }
        let previousAnimation = this.runningAnimation.pop();
        while (!(previousAnimation.isAnimationStep || previousAnimation.isBackStep)) {
            this.undoAnimation(previousAnimation,doDraw);
            previousAnimation = this.runningAnimation.pop();
            if (!previousAnimation) {
                return;
            }
        }
        this.undoAnimation(previousAnimation,doDraw);
    }

    canStepBack() {
        return this.animationHistory.length > 0 || this.runningAnimation.length > 0;
    }
    stepBack(doDraw = true) {
        if (this.paused) {
            if (this.runningAnimation && this.runningAnimation.length > 0) {
                this.unAnimate(doDraw);
                this.animator.enable("stepForward");
                this.animator.enable("skipForward");
                if (this.runningAnimation.length === 0) {
                    this.animationQueue.unshift({method:this.animator.emit,scope:this.animator,params:["anim-start",],noAnim:true});
                    this.runningAnimation = null;
                    this.undoText();
                    if (this.animationHistory.length === 0) {
                        this.animator.disable("stepBack");
                        this.animator.disable("skipBack");
                    }
                }
            } else if (this.animationHistory.length > 0) {
                this.popHistoryToRunningAnimation();
                this.stepBack();
            }
        }
    }

    redoAnimation(nextAnimation,doDraw) {
        let scope = nextAnimation.scope || this;
        let method = nextAnimation.method;
        if (nextAnimation.customRedoEnd) {
            // let redo = scope.redo;
            method = method.redo;
        }
        let params = nextAnimation.params || [];
        // console.log(require('util').inspect(nextAnimation, { depth: null }));
        // console.log("redo",method);
        if (nextAnimation.redoData) {
            params.push(...nextAnimation.redoData);
        }
        if (doDraw) {
            this.beginDrawLoop();
        }
        let retVal = method.apply(scope, params);
        nextAnimation.returnValue = retVal;
        if (this.isAnimStart(nextAnimation)) {
            this.runningAnimation = [];
        } else if (this.isAnimEnd(nextAnimation)) {
            this.animationHistory.push(this.runningAnimation);
            this.runningAnimation = null;
        } else if (this.isEndDrawLoopTrigger(nextAnimation)) {

        } else if (this.isPauseTrigger(nextAnimation)) {

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
            this.stopDrawing(++this.stopID);
        }
    }

    reAnimate(doDraw) {
        if (doDraw) {
            this.ensureDrawn();
        }
        let nextAnimation = this.animationQueue.shift();
        while (!(nextAnimation.isAnimationStep || nextAnimation.isForwardStep) && !this.isEndDrawLoopTrigger(nextAnimation)) {
            this.redoAnimation(nextAnimation,doDraw);
            nextAnimation = this.animationQueue.shift();
            if (!nextAnimation) {
                return;
            }
        }
        this.redoAnimation(nextAnimation,doDraw);
        // if (!nextAnimation.customRedoEnd && !this.isEndDrawLoopTrigger(nextAnimation)) {
        //     if (!(this.animationQueue[0].isAnimationStep || this.animationQueue[0].isForwardStep)) {
        //         while (!(this.animationQueue[0].isAnimationStep || this.animationQueue[0].isForwardStep) && !this.isEndDrawLoopTrigger(this.animationQueue[0])) {
        //             nextAnimation = this.animationQueue.shift();
        //             this.redoAnimation(nextAnimation);
        //             if (!nextAnimation) {
        //                 return;
        //             }
        //         }
        //     }
        //     if (this.isEndDrawLoopTrigger(this.animationQueue[0])) {
        //         nextAnimation = this.animationQueue.shift();
        //         this.redoAnimation(nextAnimation);
        //     }
        // }
    }

    canStepForward() {
        return this.animationQueue.length > 0;
    }
    stepForward(doDraw = true) {
        if (this.paused) {
            if (this.animationQueue.length > 0) {
                this.reAnimate(doDraw);
                this.animator.enable("stepBack");
                this.animator.enable("skipBack");
                if (this.animationQueue.length === 0) {
                    this.animator.disable("stepForward");
                    this.animator.disable("skipForward");
                } else {
                    this.animator.enable("stepForward");
                    this.animator.enable("skipForward");
                }
            }
        }
    }

    canSkipBack() {
        return this.animationHistory.length > 0 || this.runningAnimation.length > 0;
    }
    skipBack() {
        if (this.paused) {
            if (this.runningAnimation) {
                while (this.runningAnimation && this.runningAnimation.length > 0) {
                    this.stepBack(false);
                }
                this.animator.enable("stepForward");
                this.animator.enable("skipForward");
                if (this.animationHistory.length === 0) {
                    this.animator.disable("stepBack");
                    this.animator.disable("skipBack");
                }
                this.ensureDrawn(true);
            } else if (this.animationHistory.length > 0) {
                this.popHistoryToRunningAnimation();
                this.skipBack();
            }
        }
    }

    canSkipForward() {
        return this.animationQueue.length > 0;
    }
    skipForward() {
        if (this.paused) {
            if (this.animationQueue.length > 0) {
                if (this.isAnimStart(this.animationQueue[0])) {
                    this.stepForward(false);
                }
                while (this.animationQueue.length > 0 && !this.isAnimStart(this.animationQueue[0])) {
                    this.stepForward(false);
                }
                this.ensureDrawn(true);
                this.animator.enable("stepBack");
                this.animator.enable("skipBack");
                if (this.animationQueue.length === 0) {
                    this.animator.disable("stepForward");
                    this.animator.disable("skipForward");
                }
            }
        }
    }

    popHistoryToRunningAnimation() {
        let previousAnimationSequence = this.animationHistory.pop();
        this.animator.emit("anim-start");
        this.animationQueue.unshift({method:this.stopDrawing,params:this.constructor.SUPPORTS_STOP_ID ? [++this.stopID,true] : [],noAnim:true});
        this.animationQueue.unshift({method:this.animator.emit,scope:this.animator,params:["anim-end",],noAnim:true});
        this.runningAnimation = previousAnimationSequence;
    }

    ensureDrawn() {
        throw new TypeError("Need to implement ensure drawn in instance class");
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

    isPauseTrigger(animation) {
        return animation.method === this.setPaused;
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
                } else if (this.isPauseTrigger(animation)) {

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
                        animation.explanation = animation.explanation.replace("|RETURN|", animation.returnsUndoData ? retVal[0] : retVal);
                        if (animation.returnsUndoData) {
                            // console.log(retVal);
                        }
                    }
                    this.showText(animation.explanation);
                }
                if (animation.returnsUndoData) {
                    animation.undoData = animation.explanationUsesReturn ? retVal[1] : retVal;
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
            this.animationQueue.push({method:this.stopDrawing,params:this.constructor.SUPPORTS_STOP_ID ? [++this.stopID,true] : [],noAnim:true});
        }
    }

    stopDrawing(stopID,force) {
        if (!this.constructor.SUPPORTS_STOP_ID || force || stopID === this.stopID) {
            this.animator.noLoop();
            this.drawing = false;
        }
    }

    draw(p5) {
        // console.log("draw");
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

    windowResized(p5, height, numScrollbars, maxY, callback) {
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


        if (callback) {
            callback();
        }
        try {
            this.ensureDrawn(this.animationQueue.length === 0);
            if (this.animationQueue.length > 0) {
                this.stopID++;
            }
        } catch (e) {

        } finally {

        }
    }
}
