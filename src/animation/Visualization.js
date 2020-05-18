import Visualizer from 'components/visualizer';
import { Utils, Colors } from 'utils';

export default class Visualization {

    static LOG_UNDO_REDO = false;
    static LOG_ANIMATIONS = false;
    static LOG_DONE_ANIMATING = false;
    static LOG_DRAW = false;
    static TEST_ANIMATION_STEPS = false;

    testAnimation(howMany = 1) {
        this.animationHistory.slice(-howMany).forEach(animationSet => {
            let stepData = animationSet.map(animation => {
                return {
                    method: animation.method.name,
                    isBackStep: animation.isBackStep || animation.isAnimationStep,
                    isForwardStep: animation.isForwardStep || animation.isAnimationStep
                };
            });
            let success = true;
            let i = 0;
            let alsoForward = false;
            while (i < stepData.length) {
                let lastForward = alsoForward ? i - 1 : null;
                while (i < stepData.length && !stepData[i].isBackStep) {
                    console.log(stepData[i]);
                    if (stepData[i].isForwardStep) {
                        if (lastForward !== null) {
                            console.log("EARLY FORWARD");
                            success = false;
                        }
                        lastForward = i;
                    }
                    i++;
                }
                if (i < stepData.length) {
                    console.log(stepData[i]);
                    if (lastForward === null) {
                        console.log("EARLY BACK");
                        success = false;
                    }
                    alsoForward = stepData[i].isForwardStep;
                }
                i++;
            }
            if (success) {
                console.log("ANIMATION PASSED");
            }
        });
    }

    constructor(animator, width, height) {
        this.x = 20;
        this.y = 20;
        if (this.constructor.SET_BOUNDS) {
            this.width = width;
            this.height = height;
        }

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

        // this.drawing = true;
        if (this.constructor.SUPPORTS_NO_LOOP) {
            this.drawing = false;
        } else {
            // this.drawing = true;
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
            delete this.skipBack;
            delete this.stepBack;
            delete this.undoAnimation;
            delete this.undoText;
            delete this.skipForward;
            delete this.stepForward;
            delete this.redoAnimation;

            delete this.undo;
            delete this.undoAction;
            delete this.doExample;
        }

        if (this.constructor.SUPPORTS_STOP_ID) {
            this.stopID = 0;
        }

        if (!Utils.isDev()) {
            delete this.testAnimation;
        }

        this.reset();
        this.made = true;
    }

    reset(callback) {
        if (this.made) {
            if (this.constructor.SUPPORTS_NO_LOOP) {
                this.beginDrawLoop();
            }
        }

        if (this.constructor.SUPPORTS_TEXT) {
            this.displayText = "Animation Ready";
            if (this.constructor.SUPPORTS_ANIMATION_CONTROL) {
                this.displayText += " | Press ctrl-z to undo! (permanantly deletes action)";
            }
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

        if (callback) {
            callback();
        } else {
            this.animator.noLoop();
        }

        if (this.made) {
            if (this.constructor.SUPPORTS_NO_LOOP) {
                this.endDrawLoop();
                this.stepForward();
            }
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
        return true;
    }

    play() {
        this.paused = false;
        if (this.animationQueue.length > 0) {
            this.beginDrawLoop();
        } else {
            this.animator.emit("anim-end");
        }
        this.animator.enable("playPause");
        this.animator.disable("stepBack");
        this.animator.disable("skipBack");
        this.animator.disable("stepForward");
        this.animator.disable("skipForward");
    }

    pause() {
        if (this.animationQueue.length === 0 || !this.isPauseTrigger(this.animationQueue[0])) {
            this.animationQueue.unshift({method:this.setPaused,noAnim:true});
        }
        this.beginDrawLoop();
        this.animator.disable("playPause");
    }

    setPaused() {
        this.stopDrawing.apply(this, (this.constructor.SUPPORTS_STOP_ID ? [++this.stopID,true] : []));
        this.paused = true;
        this.animator.emit("paused");
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
            for (let j = this.animationHistory[i].length - 1; j >= 0; j--) {
                if (this.animationHistory[i][j]) {
                    if (this.animationHistory[i][j].method === this.showText || this.animationHistory[i][j].explanation) {
                        return this.animationHistory[i][j];
                    }
                } else {
                    console.log(this.animationHistory, i, j, this.animationHistory[i], this.animationHistory[i][j]);
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
                this.showText(textAnimation.explanation);
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
            if (this.constructor.LOG_UNDO_REDO) {
                console.log("undo",params,undoMethod);
            }
            // if (previousAnimation.returnsUndoData) {
            //     params = previousAnimation.returnValue;
            // }
            if (doDraw) {
                this.beginDrawLoop();
            }
            undoMethod.apply(scope, params);
            this.undoText();//previousAnimation.explanation);
            if (!previousAnimation.customUndoEnd) {
                this.stopDrawing(++this.stopID);
                // console.log(this.stopID);
            }
        } else {
            if (this.constructor.LOG_UNDO_REDO) {
                console.log("failed",previousAnimation);
            }
        }
        this.animationQueue.unshift(previousAnimation);
    }

    unAnimate(doDraw) {
        if (doDraw) {
            this.ensureDrawn(true);
        }
        let previousAnimation = this.runningAnimation.pop();
        let lastUndo = null;
        while (!(previousAnimation.isAnimationStep || previousAnimation.isBackStep)) {
            this.undoAnimation(previousAnimation,doDraw);
            lastUndo = previousAnimation;
            previousAnimation = this.runningAnimation.pop();
            if (!previousAnimation) {
                break;
            }
        }
        if (previousAnimation) {
            this.undoAnimation(previousAnimation,doDraw);
            lastUndo = previousAnimation;
        }
        if (doDraw && !lastUndo.customUndoEnd) {
            this.ensureDrawn();
        }
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
                return true;
            } else if (this.animationHistory.length > 0) {
                this.popHistoryToRunningAnimation();
                this.stepBack();
            } else {
                this.animator.disable("stepBack");
                this.animator.disable("skipBack");
            }
        }
        return false;
    }

    redoAnimation(nextAnimation,doDraw) {
        let scope = nextAnimation.scope || this;
        let method = nextAnimation.method;
        method = method.redo || method;
        let params = nextAnimation.redoData || nextAnimation.params || [];
        if (doDraw) {
            this.beginDrawLoop();
        }
        let retVal;
        if (!this.isAnimEnd(nextAnimation)) {
            if (this.constructor.LOG_UNDO_REDO) {
                console.log("redo",params,method);
            }
            retVal = method.apply(scope, params);
        }
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
        if (nextAnimation.returnsUndoData && !nextAnimation.undoData) {
            nextAnimation.undoData = nextAnimation.explanationUsesReturn ? retVal[1] : retVal;
        }
        if (nextAnimation.returnsRedoData && !nextAnimation.redoData) {
            nextAnimation.redoData = nextAnimation.explanationUsesReturn ? retVal[1] : retVal;
        }
    }

    reAnimate(doDraw) {
        if (doDraw) {
            this.ensureDrawn(true);
        }
        let nextAnimation = this.animationQueue.shift();
        let lastRedo = null;
        while (!(nextAnimation.isAnimationStep || nextAnimation.isForwardStep) && !this.isEndDrawLoopTrigger(nextAnimation)) {
            this.redoAnimation(nextAnimation,doDraw);
            lastRedo = nextAnimation;
            nextAnimation = this.animationQueue.shift();
            if (!nextAnimation) {
                break;
            }
        }
        if (nextAnimation) {
            this.redoAnimation(nextAnimation,doDraw);
            lastRedo = nextAnimation;
        }
        if (doDraw && !lastRedo.customRedoEnd) {
            this.ensureDrawn();
        }
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
                    this.animator.emit("anim-end");
                    this.animator.disable("stepForward");
                    this.animator.disable("skipForward");
                } else {
                    this.animator.enable("stepForward");
                    this.animator.enable("skipForward");
                }
                return true;
            } else {
                this.animator.emit("anim-end");
                this.animator.disable("stepForward");
                this.animator.disable("skipForward");
            }
        }
        return false;
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
                return true;
            } else if (this.animationHistory.length > 0) {
                this.popHistoryToRunningAnimation();
                this.skipBack();
            } else {
                this.animator.disable("stepBack");
                this.animator.disable("skipBack");
            }
        }
        return false;
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
                    this.animator.emit("anim-end");
                    this.animator.disable("stepForward");
                    this.animator.disable("skipForward");
                }
                return true;
            } else {
                this.animator.emit("anim-end");
                this.animator.disable("stepForward");
                this.animator.disable("skipForward");
            }
        }
        return false;
    }

    popHistoryToRunningAnimation() {
        let previousAnimationSequence = this.animationHistory.pop();
        this.animator.emit("anim-start");
        this.animationQueue.unshift({method:this.stopDrawing,params:this.constructor.SUPPORTS_STOP_ID ? [++this.stopID,true] : [],noAnim:true});
        this.animationQueue.unshift({method:this.animator.emit,scope:this.animator,params:["anim-end",],noAnim:true});
        this.runningAnimation = previousAnimationSequence;
    }

    noAnimStartsInQueue() {
        let containsAnimStart = false;
        for (let animation of this.animationQueue) {
            if (this.isAnimStart(animation)) {
                containsAnimStart = true;
                break;
            }
        }
        return !containsAnimStart;
    }

    canUndo() {
        return this.noAnimStartsInQueue() && (this.animationHistory.length > 0 || (this.runningAnimation && this.runningAnimation.length > 0))
    }
    undo() {
        if (this.canUndo()) {
            if (!this.paused) {
                this.ensureDrawn(true);
                if (this.animationQueue.length === 0 || !this.isUndoTrigger(this.animationQueue[0])) {
                    this.animationQueue.unshift({method:this.undoAction,params:[false],noAnim:true});
                }
                this.beginDrawLoop();
                return true;
            } else {
                this.undoAction(true);
                return true;
            }
        }
        return false;
    }

    undoAction(wasPaused) {
        if (!wasPaused) {
            this.setPaused();
        }
        this.skipBack();
        this.animationQueue.splice(0,this.animationQueue.length);
        if (!wasPaused) {
            this.play();
        } else {
            this.animator.emit("anim-end");
            this.animator.disable("stepForward");
            this.animator.disable("skipForward");
        }
    }

    doExample(operationList, needsReset) {
        if (needsReset) {
            this.reset();
        }
        let f;
        for (let i = operationList.length - 1; i > 0; i--) {
            let temp = f;
            f = () => {
                this[operationList[i].methodName](...operationList[i].params, temp, true);
            }
        }
        this[operationList[0].methodName](...operationList[0].params, f);
        this.play();
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

    doneAnimating(time = 250, caller = "") {
        if (time === 0) {
            this.animating = false;
            if (this.constructor.LOG_DONE_ANIMATING) {
                console.log("done",caller);
            }
            return;
        }
        setTimeout(() => {
            this.animating = false;
            if (this.constructor.LOG_DONE_ANIMATING) {
                console.log("done",caller);
            }
        }, time);
    }

    update(animationSpeed, p5, callForward) {
        if (this.constructor.SET_BOUNDS) {
            this.width = p5.width - 2 * this.x;
            this.height = p5.height - 2 * this.y;
        }
        if (callForward) {
            callForward();
        }
        if (!this.constructor.SUPPORTS_ANIMATION_CONTROL || !this.paused) {
            let testsWindowSize = this.popAnimation(animationSpeed);
            if (this.constructor.SUPPORTS_INFREQUENT_RESIZE && testsWindowSize) {
                this.animator.testWindowSize();
            }
        }
        // if (!this.constructor.SUPPORTS_INFREQUENT_RESIZE) {
        //     this.animator.testWindowSize();
        // }
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

    isUndoTrigger(animation) {
        return animation.method === this.undoAction;
    }

    noAnimation(animation) {
        return animation.noAnim
                || (animation.method === this.animator.emit && (animation.params[0] === "anim-start" || animation.params[0] === "anim-end"))
                || false;
    }

    popAnimation(animationSpeed) {
        if (!this.animating) {
            if (this.animationQueue.length > 0) {
                let animation = this.animationQueue.shift();
                this.animating = true;
                if (this.constructor.LOG_ANIMATIONS) {
                    console.log("animate",animation.params,animation.method);
                }
                let retVal = animation.method.apply(animation.scope || this, animation.params);
                animation.returnValue = retVal;
                if (this.isAnimStart(animation)) {
                    this.runningAnimation = [];
                } else if (this.isAnimEnd(animation)) {
                    this.animationHistory.push(this.runningAnimation);
                    if (this.constructor.TEST_ANIMATION_STEPS) {
                        this.testAnimation();
                    }
                    this.runningAnimation = null;
                } else if (this.isEndDrawLoopTrigger(animation)) {
                    if (this.animationQueue.length > 0) {
                        this.beginDrawLoop();
                    }
                } else if (this.isPauseTrigger(animation) || this.isUndoTrigger(animation)) {

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
                if (animation.returnsRedoData) {
                    animation.redoData = animation.explanationUsesReturn ? retVal[1] : retVal;
                }
                if (this.constructor.SUPPORTS_CUSTOM_END) {
                    if (this.noAnimation(animation)) {
                        this.animating = false;
                    } else if (!animation.customEnd) {
                        if (animationSpeed >= Math.floor(Visualizer.maxAnimationSpeed())) {
                            this.doneAnimating(0, animation.method.name);
                        } else {
                            this.doneAnimating(this.constructor.MAX_ANIM_TIME / animationSpeed / (animation.quick ? 2 : 1), animation.method.name);
                        }
                    }
                }
                return animation.testsWindowSize;
            }
        }
    }

    beginDrawLoop() {
        this.animator.loop();
        this.drawing = true;
    }

    endDrawLoop(callback) {
        if (this.drawing) {
            this.animationQueue.push({method:this.stopDrawing,params:this.constructor.SUPPORTS_STOP_ID ? [++this.stopID,true,callback] : [null,null,callback],noAnim:true});
        }
    }

    stopDrawing(stopID,force,callback) {
        if (!this.constructor.SUPPORTS_STOP_ID || force || stopID === this.stopID) {
            this.animator.noLoop();
            this.drawing = false;
            if (callback) {
                callback();
            }
        }
    }

    draw(p5) {
        if (this.constructor.LOG_DRAW) {
            console.log("draw");
        }
        p5.push();
        if (this.constructor.SUPPORTS_TEXT) {
            p5.fill(...this.displayTextColor);
            p5.textSize(15);
            p5.textAlign(p5.LEFT, p5.TOP);
            p5.text(this.displayText, 2.5,2.5, p5.width-2.5,(this.getDisplayTextExtraLines(p5) + 1)*20);
        }
        p5.pop();
        if (this.constructor.SUPPORTS_TEXT) {
            p5.translate(0,this.getDisplayTextExtraLines(p5)*20);
        }
    }

    mousePressed(p5) {
        return true;
    }

    mouseReleased(p5) {
        return true;
    }

    getDisplayTextExtraLines(p5) {
        p5.push();
        p5.textSize(15);
        let width = p5.textWidth(this.displayText);
        let lines = Math.ceil(width / (p5.width - 10));
        // console.log(width,lines);
        p5.pop();
        return lines - 1;
    }

    windowResized(p5, height, numScrollbars, maxY, callback, maxWidth) {
        maxY += this.getDisplayTextExtraLines(p5)*20;
        if (!document.querySelector(".canvas-container").classList.contains("mobile")) {
            height -= numScrollbars * 16;
        }
        let width = p5.windowWidth;
        if (maxY > (height - (2*this.y))) {
            height = (maxY + (3*this.y));
            if (!document.querySelector(".canvas-container").classList.contains("mobile")) {
                width -= 16;
            }
            document.querySelector(".canvas-container").classList.add("overflow-y");
        } else {
            document.querySelector(".canvas-container").classList.remove("overflow-y");
        }
        if (maxWidth) {
            if (maxWidth > (width - (2*this.x))) {
                width = (maxWidth + (4*this.x));
                if (!document.querySelector(".canvas-container").classList.contains("mobile")) {
                    height -= 16;
                    if (maxY > (height - (3*this.y))) {
                        height = (maxY + (3*this.y));
                        document.querySelector(".canvas-container").classList.add("overflow-y");
                    } else {
                        document.querySelector(".canvas-container").classList.remove("overflow-y");
                    }
                }
                document.querySelector(".canvas-container").classList.add("overflow-x");
            } else {
                document.querySelector(".canvas-container").classList.remove("overflow-x");
            }
        }

        height = Math.max(height, p5.height);
        p5.resizeCanvas(width, height);

        if (this.constructor.SET_BOUNDS) {
            this.width = p5.width - 2 * this.x;
            this.height = p5.height - 2 * this.y;
        }


        if (callback) {
            callback();
        }
        try {
            this.ensureDrawn(this.animationQueue.length === 0);
            if (this.animationQueue.length > 0 && !this.paused) {
                this.stopID++;
            }
        } catch (e) {

        } finally {

        }
    }
}
