import { Visualization } from 'animation';
import { AttractedHighlightableObject } from 'animation';
import { Colors } from 'utils';

export default class QueueArray extends Visualization {
    static USE_CANVAS = true;
    static SET_BOUNDS = true;
    static SUPPORTS_NO_LOOP = true;
    static SUPPORTS_CUSTOM_END = true;
    static MAX_ANIM_TIME = 5000;
    static SUPPORTS_TEXT = true;
    static SUPPORTS_ANIMATION_CONTROL = true;
    static SUPPORTS_STOP_ID = true;

    static INITIAL_CAPACITY = 4;

    static ELEMENT_SIZE = 50;
    static HEAD_LOCATION_X = 125;
    static HEAD_LOCATION_Y = 35;
    static TAIL_LOCATION_X = 125;
    static TAIL_LOCATION_Y = 55;

    constructor(animator) {
        super(animator);

        this.reset();
        this.made = true;
    }

    reset() {
        super.reset();
        if (this.made) {
            this.beginDrawLoop();
        }

        this.backingArray = new Array(QueueArray.INITIAL_CAPACITY);
        this.size = 0;
        this.copyArray = null;
        this.tempElement = null;
        this.headPointerValue = 0;
        this.headPointerHighlighter = new AttractedHighlightableObject(QueueArray.HEAD_LOCATION_X, QueueArray.HEAD_LOCATION_Y, {
            highlightOuterRadius: 15
        });
        this.tailPointerValue = 0;
        this.tailPointerHighlighter = new AttractedHighlightableObject(QueueArray.TAIL_LOCATION_X, QueueArray.TAIL_LOCATION_Y, {
            highlightOuterRadius: 15
        });

        this.resizing = false;
        if (this.made) {
            // this.updateText("Animation Ready");
            this.endDrawLoop();
        }
    }

    ensureDrawn(skipDraw = false) {
        if (!this.drawing) {
            this.beginDrawLoop();
            let furthestObject = this.headPointerHighlighter;
            if (this.tailPointerHighlighter.displacement() > furthestObject.displacement()) {
                furthestObject = this.tailPointerHighlighter;
            }
            for (let i = 0; i < this.backingArray.length; i++) {
                if (this.backingArray[i] && this.backingArray[i].displacement() > furthestObject.displacement()) {
                    furthestObject = this.backingArray[i];
                }
            }
            if (this.copyArray) {
                for (let i = 0; i < this.copyArray.length; i++) {
                    if (this.copyArray[i] && this.copyArray[i].displacement() > furthestObject.displacement()) {
                        furthestObject = this.copyArray[i];
                    }
                }
            }
            if (furthestObject.displacement() > 0) {
                let stopID = ++this.stopID;
                furthestObject.addOnStop(() => {
                    this.stopDrawing(stopID);
                });
                if (skipDraw) {
                    this.headPointerHighlighter.stop();
                    this.tailPointerHighlighter.stop();
                    for (let i = 0; i < this.backingArray.length; i++) {
                        if (this.backingArray[i]) {
                            this.backingArray[i].stop();
                        }
                    }
                    if (this.copyArray) {
                        for (let i = 0; i < this.copyArray.length; i++) {
                            if (this.copyArray[i]) {
                                this.copyArray[i].stop();
                            }
                        }
                    }
                }
            } else {
                let stopID = ++this.stopID;
                furthestObject.addOnStop(() => {
                    this.stopDrawing(stopID);
                });
            }
        }
    }


    enqueue(data) {
        if (this.animating) {
            console.log("animation in progress");
            return false;
        }
        this.beginDrawLoop();
        if (data === null) {
            this.updateText("Cannot add null to Queue.", Colors.RED);
            return false;
        }
        let animation = [];
        animation.push({method:this.showText,params:[`Enqueuing at index ${this.tailPointerValue}.`]});
        if (this.size === this.backingArray.length) {
            animation.push(...this.createCopyArray());
        }
        animation.push({method:this.createElement,params:[data],explanation:`Create value: ${data}`,isAnimationStep:true,});
        animation.push(...this.useTailPointer());
        // animation.push({method:this.highlightTemp,params:[],noAnim:true});
        animation.push({method:this.insertElement,params:[],customEnd:true,explanation:`Added ${data} to backingArray`,isAnimationStep:true,customUndoEnd:true,customRedoEnd:true,});
        animation.push(...this.updateTailPointer());
        animation.push({method:this.sizeIncr,params:[],noAnim:true});
        animation.push({method:this.showText,params:[`Successfully pushed ${data} to queue.`,Colors.GREEN,],});
        this.addAnimation(animation);
        this.endDrawLoop();
        this.stepForward();
        return true;
    }

    dequeue() {
        if (this.animating) {
            console.log("animation in progress");
            return false;
        }
        this.beginDrawLoop();
        if (this.size === 0) {
            this.updateText("Cannot pop empty Queue", Colors.RED);
            return false;
        }
        let animation = [];
        let data = this.backingArray[this.headPointerValue].value;
        animation.push({method:this.showText,params:[`Dequeuing from index ${this.headPointerValue}.`]});
        animation.push(...this.useHeadPointer());
        animation.push({method:this.extractElement,params:[],explanation:`Pop value: ${data} from queue`,customEnd:true,isAnimationStep:true,customUndoEnd:true,customRedoEnd:true,});
        animation.push({method:this.unmakeElement,params:[],noAnim:true,returnsUndoData:true});
        animation.push(...this.updateHeadPointer());
        animation.push({method:this.sizeDecr,params:[],noAnim:true});
        animation.push({method:this.showText,params:[`Successfully popped ${data} from queue.`,Colors.GREEN],noAnim:true});
        this.addAnimation(animation);
        this.endDrawLoop();
        this.stepForward();
        return data;
    }

    createCopyArray() {
        let animation = [];
        animation.push({method:this.initCopyArray,params:[],noAnim:true,explanation:`Queue full, resizing to length ${this.backingArray.length*2}`,isForwardStep:true,});
        animation.push(...this.useHeadPointer());
        for (let i = 0; i < this.size; i++) {
            animation.push(...this.addItemToCopy(i));
        }
        animation.push(...this.useCopyArr());
        animation.push(...this.updateHeadPointer(0));
        animation.push(...this.updateTailPointer(this.size));
        return animation;
    }

    initCopyArray() {
        this.copyArray = new Array(this.backingArray.length * 2);
        for (let i = 0; i < this.size; i++) {
            let arrIndex = (i + this.headPointerValue) % this.backingArray.length;
            let pos = this.getElementPosition(arrIndex);
            this.copyArray[i] = new QueueArrayElement({data: this.backingArray[arrIndex].value, index: i, x:pos[0],y:pos[1],},);
        }
    }
    undo_initCopyArray() {
        this.copyArray = null;
    }

    addItemToCopy(index) {
        let animation = [];
        // animation.push({method:this.shiftElementToCopyArray,params:[index,...this.getElementPosition(index,true)],customEnd:true,isBackStep:(index === 0),isForwardStep:(index === this.size - 1),customUndoEnd:(index === 0),customRedoEnd:(index === this.size - 1),});
        animation.push({method:this.shiftElementToCopyArray,params:[index,...this.getElementPosition(index,true)],customEnd:true,isAnimationStep:true,customUndoEnd:true,customRedoEnd:true,returnsUndoData:true,});
        return animation;
    }

    shiftElementToCopyArray(index, x, y) {
        let element = this.copyArray[index];
        let oldX = element.desiredX;
        let oldY = element.desiredY;
        element.highlightForMovement();
        element.shift(x,y);
        element.addOnStop((el) => {
            el.unhighlight();
            this.doneAnimating(0);
        });
        return [index, oldX, oldY];
    }
    undo_shiftElementToCopyArray(index, x, y) {
        let element = this.copyArray[index];
        element.highlightForMovement();
        element.shift(x,y);
        if (true || index === 0) {
            let stopID = ++this.stopID;
            element.addOnStop((el) => {
                el.unhighlight();
                this.stopDrawing(stopID);
            });
        } else {
            element.addOnStop((el) => {
                el.unhighlight();
            });
        }
    }
    redo_shiftElementToCopyArray(index, x, y) {
        let element = this.copyArray[index];
        element.highlightForMovement();
        element.shift(x,y);
        if (true || index === this.size - 1) {
            let stopID = ++this.stopID;
            element.addOnStop((el) => {
                el.unhighlight();
                this.stopDrawing(stopID);
            });
        } else {
            element.addOnStop((el) => {
                el.unhighlight();
            });
        }
    }

    useCopyArr() {
        let animation = [];
        animation.push({method:this.assignCopyArray,params:[],noAnim:true,isBackStep:true,customUndoEnd:true,returnsUndoData:true});
        for (let i = 0; i < this.size; i++) {
            animation.push({method:this.shiftElementToBackingArray,params:[i,],noAnim:true,isForwardStep:(i === this.size - 1),customUndoEnd:true,customRedoEnd:true});
        }
        animation.push({method:this.noAction,noAnim:true,isBackStep:true});
        return animation;
    }

    assignCopyArray() {
        let oldBacking = this.backingArray;
        this.backingArray = this.copyArray;
        this.copyArray = null;
        return [oldBacking];
    }
    undo_assignCopyArray(oldBacking) {
        this.copyArray = this.backingArray;
        this.backingArray = oldBacking;
    }

    shiftElementToBackingArray(index) {
        let element = this.backingArray[index];
        element.shift(...this.getElementPosition(element.index));
    }
    undo_shiftElementToBackingArray(index) {
        let element = this.backingArray[index];
        element.shift(...this.getElementPosition(index,true));
        if (index === 0) {
            let stopID = ++this.stopID;
            element.addOnStop((el) => {
                this.stopDrawing(stopID);
            })
        }
    }
    redo_shiftElementToBackingArray(index) {
        let element = this.backingArray[index];
        element.shift(...this.getElementPosition(element.index));
        if (index === this.size - 1) {
            let stopID = ++this.stopID;
            element.addOnStop((el) => {
                this.stopDrawing(stopID);
            })
        }
    }

    createElement(data) {
        this.tempElement = new QueueArrayElement({data: data, index: this.tailPointerValue, x:45,y:45,},);
    }
    undo_createElement(data) {
        this.tempElement = null;
    }

    useTailPointer() {
        let animation = [];
        animation.push({method:this.tailPointerHighlighter.highlight,scope:this.tailPointerHighlighter,params:[],noAnim:true,});
        animation.push({method:this.moveTailTracker,params:[],customEnd:true,explanation:`Tail points to index |RETURN|`,explanationUsesReturn:true,isAnimationStep:true,customUndoEnd:true,customRedoEnd:true,});
        animation.push({method:this.tailPointerHighlighter.unhighlight,scope:this.tailPointerHighlighter,params:[],noAnim:true,});
        animation.push({method:this.tailPointerHighlighter.goTo,scope:this.tailPointerHighlighter,params:[QueueArray.TAIL_LOCATION_X,QueueArray.TAIL_LOCATION_Y,],noAnim:true,returnsUndoData:true});
        return animation;
    }

    moveTailTracker() {
        let pos = this.getElementPosition(this.tailPointerValue);
        this.tailPointerHighlighter.highlight();
        this.tailPointerHighlighter.shift(pos[0], pos[1] + QueueArray.ELEMENT_SIZE);
        this.tailPointerHighlighter.addOnStop((element) => {
            element.unhighlight();
            this.doneAnimating(0);
        });
        return this.tailPointerValue;
    }
    undo_moveTailTracker() {
        this.tailPointerHighlighter.shift(QueueArray.TAIL_LOCATION_X,QueueArray.TAIL_LOCATION_Y);
        this.tailPointerHighlighter.highlight();
        let stopID = ++this.stopID;
        this.tailPointerHighlighter.addOnStop((element) => {
            element.unhighlight();
            this.stopDrawing(stopID);
        });
        return this.tailPointerValue;
    }
    redo_moveTailTracker() {
        let pos = this.getElementPosition(this.tailPointerValue);
        this.tailPointerHighlighter.highlight();
        this.tailPointerHighlighter.shift(pos[0], pos[1] + QueueArray.ELEMENT_SIZE);
        let stopID = ++this.stopID;
        this.tailPointerHighlighter.addOnStop((element) => {
            element.unhighlight();
            this.stopDrawing(stopID);
        });
        return this.tailPointerValue;
    }

    highlightTemp(color = Colors.BLUE) {
        this.tempElement.highlight(color);
    }
    undo_highlightTemp() {
        this.tempElement.unhighlight();
    }

    insertElement() {
        let index = this.tailPointerValue;
        this.backingArray[index] = this.tempElement;
        this.highlightTemp();
        this.tempElement.shift(...this.getElementPosition(index));
        this.tempElement.addOnStop((element) => {
            element.unhighlight();
            this.doneAnimating(0);
        });
        this.tempElement = null;
    }
    undo_insertElement() {
        let index = this.tailPointerValue;// - 1;
        // if (index < 0) {
        //     index += this.backingArray.length;
        // }
        this.tempElement = this.backingArray[index];
        this.highlightTemp();
        this.tempElement.shift(45,45);
        let stopID = ++this.stopID;
        this.tempElement.addOnStop((element) => {
            element.unhighlight();
            this.stopDrawing(stopID);
        });
        this.backingArray[index] = null;
    }
    redo_insertElement() {
        let index = this.tailPointerValue;
        this.backingArray[index] = this.tempElement;
        this.highlightTemp();
        this.tempElement.shift(...this.getElementPosition(index));
        let stopID = ++this.stopID;
        this.tempElement.addOnStop((element) => {
            element.unhighlight();
            this.stopDrawing(stopID);
        });
        this.tempElement = null;
    }

    useHeadPointer() {
        let animation = [];
        animation.push({method:this.headPointerHighlighter.highlight,scope:this.headPointerHighlighter,params:[],noAnim:true,});
        animation.push({method:this.moveHeadTracker,params:[],customEnd:true,explanation:`Head points to index |RETURN|`,explanationUsesReturn:true,isAnimationStep:true,customUndoEnd:true,customRedoEnd:true,});
        animation.push({method:this.headPointerHighlighter.unhighlight,scope:this.headPointerHighlighter,params:[],noAnim:true,});
        animation.push({method:this.headPointerHighlighter.goTo,scope:this.headPointerHighlighter,params:[QueueArray.HEAD_LOCATION_X,QueueArray.HEAD_LOCATION_Y,],noAnim:true,returnsUndoData:true,});
        return animation;
    }

    moveHeadTracker() {
        let pos = this.getElementPosition(this.headPointerValue);
        this.headPointerHighlighter.highlight();
        this.headPointerHighlighter.shift(pos[0], pos[1] + QueueArray.ELEMENT_SIZE);
        this.headPointerHighlighter.addOnStop((element) => {
            element.unhighlight();
            this.doneAnimating(0);
        });
        return this.headPointerValue;
    }
    undo_moveHeadTracker() {
        this.headPointerHighlighter.shift(QueueArray.HEAD_LOCATION_X,QueueArray.HEAD_LOCATION_Y);
        this.headPointerHighlighter.highlight();
        let stopID = ++this.stopID;
        this.headPointerHighlighter.addOnStop((element) => {
            element.unhighlight();
            this.stopDrawing(stopID);
        });
        return this.headPointerValue;
    }
    redo_moveHeadTracker() {
        let pos = this.getElementPosition(this.headPointerValue);
        this.headPointerHighlighter.highlight();
        this.headPointerHighlighter.shift(pos[0], pos[1] + QueueArray.ELEMENT_SIZE);
        let stopID = ++this.stopID;
        this.headPointerHighlighter.addOnStop((element) => {
            element.unhighlight();
            this.stopDrawing(stopID);
        });
        return this.headPointerValue;
    }

    extractElement() {
        this.tempElement = this.backingArray[this.headPointerValue];
        this.backingArray[this.headPointerValue] = null;
        this.tempElement.highlightForMovement();
        this.tempElement.shift(45,45);
        this.tempElement.addOnStop((element) => {
            element.unhighlight();
            this.doneAnimating(0);
        });
    }
    undo_extractElement() {
        this.tempElement.highlightForMovement();
        this.tempElement.shift(...this.getElementPosition(this.headPointerValue));
        let stopID = ++this.stopID;
        this.tempElement.addOnStop((element) => {
            element.unhighlight();
            this.stopDrawing(stopID);
        });
        this.backingArray[this.headPointerValue] = this.tempElement;
        this.tempElement = null;
    }
    redo_extractElement() {
        this.tempElement = this.backingArray[this.headPointerValue];
        this.backingArray[this.headPointerValue] = null;
        this.tempElement.highlightForMovement();
        this.tempElement.shift(45,45);
        let stopID = ++this.stopID;
        this.tempElement.addOnStop((element) => {
            element.unhighlight();
            this.stopDrawing(stopID);
        });
    }

    unmakeElement(index) {
        let oldTemp = this.tempElement;
        this.tempElement = null;
        return [oldTemp];
    }
    undo_unmakeElement(oldTemp) {
        this.tempElement = oldTemp;
    }

    sizeIncr() {
        this.size++;
    }
    undo_sizeIncr() {
        this.size--;
    }

    sizeDecr() {
        this.size--;
    }
    undo_sizeDecr() {
        this.size++;
    }

    updateHeadPointer(newHead) {
        let animation = [];
        animation.push({method:this.headPointerHighlighter.highlight,scope:this.headPointerHighlighter,params:[Colors.RED, AttractedHighlightableObject.HIGHLIGHT_SQUARE],isForwardStep:true,});
        animation.push({method:this.changeHeadPointerValue,params:[newHead],explanation:`Update head pointer to |RETURN|`,explanationUsesReturn:true,returnsUndoData:true,});
        animation.push({method:this.headPointerHighlighter.unhighlight,scope:this.headPointerHighlighter,params:[],noAnim:true,isBackStep:true,undoData:[Colors.RED, AttractedHighlightableObject.HIGHLIGHT_SQUARE],});
        return animation;
    }

    changeHeadPointerValue(newHead) {
        let oldHead = this.headPointerValue;
        if (newHead !== undefined) {
            this.headPointerValue = newHead;
        } else {
            this.headPointerValue++;
            this.headPointerValue %= this.backingArray.length;
        }
        return [this.headPointerValue,[oldHead]];
    }
    undo_changeHeadPointerValue(oldHead) {
        this.headPointerValue = oldHead;
        return this.headPointerValue;
    }

    updateTailPointer(newTail) {
        let animation = [];
        animation.push({method:this.tailPointerHighlighter.highlight,scope:this.tailPointerHighlighter,params:[Colors.RED, AttractedHighlightableObject.HIGHLIGHT_SQUARE],isForwardStep:true,});
        animation.push({method:this.changeTailPointerValue,params:[newTail],explanation:`Update tail pointer to |RETURN|`,explanationUsesReturn:true,returnsUndoData:true,});
        animation.push({method:this.tailPointerHighlighter.unhighlight,scope:this.tailPointerHighlighter,params:[],noAnim:true,isBackStep:true,undoData:[Colors.RED, AttractedHighlightableObject.HIGHLIGHT_SQUARE],});
        return animation;
    }

    changeTailPointerValue(newTail) {
        let oldTail = this.tailPointerValue;
        if (newTail) {
            this.tailPointerValue = newTail;
        } else {
            this.tailPointerValue++;
            this.tailPointerValue %= this.backingArray.length;
        }
        return [this.tailPointerValue,[oldTail]];
    }
    undo_changeTailPointerValue(oldTail) {
        this.tailPointerValue = oldTail;
        return this.tailPointerValue;
    }

    getElementPosition(index, copy = false) {
        let maxPerRow = Math.floor(this.width / QueueArray.ELEMENT_SIZE);
        let x = QueueArray.ELEMENT_SIZE * index;
        let y = 50 + Math.floor(index / maxPerRow) * 2 * QueueArray.ELEMENT_SIZE;
        x = (index % maxPerRow) * QueueArray.ELEMENT_SIZE;
        return [x + QueueArray.ELEMENT_SIZE/2 + this.x,y + QueueArray.ELEMENT_SIZE/2 + this.y + (copy ? (Math.ceil(this.backingArray.length / maxPerRow)*QueueArray.ELEMENT_SIZE*2) : 0)];
    }

    allInPosition() {
        let moving = false;
        for (let i = 0; i < this.backingArray.length; i++) {
            if (this.backingArray[i] && this.backingArray[i].displacement() > 0) {
                moving = true;
            }
        }
        if (this.copyArray) {
            for (let i = 0; i < this.copyArray.length; i++) {
                if (this.copyArray[i] && this.copyArray[i].displacement() > 0) {
                    moving = true;
                }
            }
        }
        return !moving;
    }

    updateElement(element, animationSpeed, p5) {
        if (element) {
            element.update(animationSpeed, p5);
        }
    }

    update(animationSpeed, p5) {
        super.update(() => {
            for (let i = 0; i < this.backingArray.length; i++) {
                this.updateElement(this.backingArray[i], animationSpeed, p5);
            }
            if (this.copyArray) {
                for (let i = 0; i < this.copyArray.length; i++) {
                    this.updateElement(this.copyArray[i], animationSpeed, p5);
                }
            }
            if (this.tempElement) {
                this.updateElement(this.tempElement, animationSpeed, p5);
            }
            this.headPointerHighlighter.update(animationSpeed, p5);
            this.tailPointerHighlighter.update(animationSpeed, p5);
            if (this.resizing && this.allInPosition()) {
                if (!this.animating && this.animationQueue.length === 0) {
                    this.animator.noLoop();
                }
                this.resizing = false;
            }
        }, animationSpeed, p5);
    }

    draw(p5) {
        super.draw(p5);
        p5.push();

        p5.textAlign(p5.CENTER,p5.CENTER);
        p5.textSize(this.ELEMENT_SIZE/3 - 2);

        p5.fill(0);
        p5.text("Head: ", QueueArray.HEAD_LOCATION_X - 50, QueueArray.HEAD_LOCATION_Y, QueueArray.ELEMENT_SIZE);
        p5.text(this.headPointerValue.toString(), QueueArray.HEAD_LOCATION_X-25, QueueArray.HEAD_LOCATION_Y, QueueArray.ELEMENT_SIZE);
        p5.text("Tail: ", QueueArray.TAIL_LOCATION_X - 50, QueueArray.TAIL_LOCATION_Y, QueueArray.ELEMENT_SIZE);
        p5.text(this.tailPointerValue.toString(), QueueArray.TAIL_LOCATION_X-25, QueueArray.TAIL_LOCATION_Y, QueueArray.ELEMENT_SIZE);

        for (let i = 0; i < this.backingArray.length; i++) {
            if (this.backingArray[i]) {
                this.backingArray[i].draw(p5);
            }
            let pos = this.getElementPosition(i);
            p5.noFill();
            p5.stroke(0);
            p5.square(pos[0] - QueueArray.ELEMENT_SIZE/2,pos[1] - QueueArray.ELEMENT_SIZE/2, QueueArray.ELEMENT_SIZE);
            p5.fill(...Colors.BLUE);
            p5.stroke(...Colors.BLUE);
            p5.text(i.toString(), pos[0] - QueueArray.ELEMENT_SIZE/2,pos[1] + QueueArray.ELEMENT_SIZE/2, QueueArray.ELEMENT_SIZE, QueueArray.ELEMENT_SIZE);
        }

        if (this.copyArray) {
            for (let i = 0; i < this.copyArray.length; i++) {
                if (this.copyArray[i]) {
                    this.copyArray[i].draw(p5);
                }
                let pos = this.getElementPosition(i, true);
                p5.noFill();
                p5.stroke(0);
                p5.square(pos[0] - QueueArray.ELEMENT_SIZE/2,pos[1] - QueueArray.ELEMENT_SIZE/2, QueueArray.ELEMENT_SIZE);
                p5.fill(...Colors.BLUE);
                p5.stroke(...Colors.BLUE);
                p5.text(i.toString(), pos[0] - QueueArray.ELEMENT_SIZE/2,pos[1] + QueueArray.ELEMENT_SIZE/2, QueueArray.ELEMENT_SIZE, QueueArray.ELEMENT_SIZE);
            }
        }
        if (this.tempElement) {
            this.tempElement.draw(p5);
        }
        this.headPointerHighlighter.draw(p5);
        this.tailPointerHighlighter.draw(p5);

        p5.pop();
    }

    windowResized(p5, height, numScrollbars) {
        super.windowResized(p5, height, numScrollbars, (this.copyArray ? this.getElementPosition(this.copyArray.length-1, true)[1] : this.getElementPosition(this.backingArray.length-1)[1]) + QueueArray.ELEMENT_SIZE);
        for (let i = 0; i < this.backingArray.length; i++) {
            if (this.backingArray[i]) {
                this.backingArray[i].shift(...this.getElementPosition(i));
            }
        }
        this.resizing = true;
        this.animator.loop();
    }
}


class QueueArrayElement extends AttractedHighlightableObject {

    constructor({data, index, x,y} = {}) {
        super(x,y);

        // this.highlightInnerRadius = QueueArray.ELEMENT_SIZE/2 - 5;
        this.highlightOuterRadius = QueueArray.ELEMENT_SIZE/2;

        this.value = data;
        this.index = index;

        this.toDelete = false;
        this.color = [0,0,0];
    }

    shift(x,y,direction = 0) {
        super.shift(x,y);
        this.index += Math.sign(direction);
    }

    highlightForMovement() {
        super.highlight(Colors.BLUE);
    }

    highlightForDeletion() {
        super.highlight(Colors.RED);
    }

    markForDeletion() {
        this.toDelete = true;
        this.highlightForDeletion();
    }

    update(animationSpeed, p5) {
        super.update(animationSpeed, p5);
    }

    drawValue(p5) {
        p5.push();
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.fill(...this.color);
        p5.stroke(...this.color);
        p5.text(this.value.toString(), this.currentX - QueueArray.ELEMENT_SIZE/2,this.currentY - QueueArray.ELEMENT_SIZE/2, QueueArray.ELEMENT_SIZE, QueueArray.ELEMENT_SIZE);
        p5.pop();
    }
}
