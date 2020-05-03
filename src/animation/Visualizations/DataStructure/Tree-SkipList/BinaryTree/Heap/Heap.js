import { Visualization } from 'animation';
import { AttractedHighlightableObject } from 'animation';
import { Colors } from 'utils';

export default class Heap extends Visualization {
    static USE_CANVAS = true;
    static SET_BOUNDS = true;
    static SUPPORTS_NO_LOOP = true;
    static SUPPORTS_CUSTOM_END = true;
    static MAX_ANIM_TIME = 5000;
    static SUPPORTS_TEXT = true;
    static SUPPORTS_ANIMATION_CONTROL = true;
    static SUPPORTS_STOP_ID = true;

    static INITIAL_CAPACITY = 9;

    static ELEMENT_SIZE = 50;
    static FRONT_LOCATION_X = 125;
    static FRONT_LOCATION_Y = 35;
    static SIZE_LOCATION_X = 125;
    static SIZE_LOCATION_Y = 55;

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

        this.backingArray = new Array(Heap.INITIAL_CAPACITY);
        this.size = 0;
        this.copyArray = null;
        this.tempElement = null;
        this.frontPointerValue = 0;
        this.frontPointerHighlighter = new AttractedHighlightableObject(Heap.FRONT_LOCATION_X, Heap.FRONT_LOCATION_Y, {
            highlightOuterRadius: 15
        });
        this.sizePointerHighlighter = new AttractedHighlightableObject(Heap.SIZE_LOCATION_X, Heap.SIZE_LOCATION_Y, {
            highlightOuterRadius: 15
        });

        if (this.made) {
            // this.updateText("Animation Ready");
            this.endDrawLoop();
        }
    }

    ensureDrawn(skipDraw = false) {
        this.beginDrawLoop();
        let furthestObject = this.tempElement || this.frontPointerHighlighter;
        if (this.frontPointerHighlighter.displacement() > furthestObject.displacement()) {
            furthestObject = this.frontPointerHighlighter;
        }
        if (this.sizePointerHighlighter.displacement() > furthestObject.displacement()) {
            furthestObject = this.sizePointerHighlighter;
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
            let stopID = ++this.stopID;console.log(stopID);
            furthestObject.addOnStop(() => {
                this.stopDrawing(stopID);
            });
            if (skipDraw) {
                if (this.tempElement) {
                    this.tempElement.stop();
                }
                this.frontPointerHighlighter.stop();
                this.sizePointerHighlighter.stop();
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
            let stopID = ++this.stopID;console.log(stopID);
            this.stopDrawing(stopID);
        }
    }


    add(data,front) {
        if (this.animating) {
            console.log("animation in progress");
            return false;
        }
        this.beginDrawLoop();
        if (data === null) {
            this.updateText("Cannot add null to Deque.", Colors.RED);
            return false;
        }
        let animation = [];
        if (this.size === this.backingArray.length) {
            animation.push({method:this.showText,params:[`Deque full, resizing to length ${this.backingArray.length*2}`,Colors.GREEN,],});
            animation.push(...this.createCopyArray());
        }
        animation.push({method:this.createElement,params:[data,front],explanation:`Create value: ${data}`,isAnimationStep:true,returnsRedoData:true,});
        animation.push(...this.useFrontPointer());
        if (front) {
            animation.push(...this.useFrontDecrementPointer(true));
        } else {
            animation.push(...this.useFrontSizePointer(true));
        }
        animation.push({method:this.highlightTemp,noAnim:true});
        animation.push({method:this.insertElement,customEnd:true,explanation:`Added ${data} to backingArray`,isAnimationStep:true,returnsUndoData:true,customUndoEnd:true,customRedoEnd:true,});
        if (front) {
            // animation.push({method:this.noAction,noAnim:true,isBackStep:true});
            animation.push(...this.updateFrontPointer(-1));
        }
        animation.push(...this.updateSizePointer(1));
        animation.push({method:this.showText,params:[`Successfully added ${data} to ${front ? "front" : "back"} of deque.`,Colors.GREEN,],});
        this.addAnimation(animation);
        this.endDrawLoop();
        this.stepForward();
        return true;
    }

    addFirst(data) {
        return this.add(data, true);
    }

    addLast(data) {
        return this.add(data, false);
    }

    remove(front) {
        if (this.animating) {
            console.log("animation in progress");
            return false;
        }
        this.beginDrawLoop();
        if (this.size === 0) {
            this.updateText("Cannot pop empty Deque", Colors.RED);
            return false;
        }
        let animation = [];
        let data = this.backingArray[front ? this.frontPointerValue : this.getIndex(this.frontPointerValue + this.size - 1)].value;
        animation.push({method:this.showText,params:[`Dequeuing from index ${this.frontPointerValue}.`]});
        animation.push(...this.useFrontPointer(front));
        if (!front) {
            animation.push(...this.useFrontSizePointer(false,false));
            animation.push(...this.useFrontDecrementPointer(false));
        }
        animation.push({method:this.extractElement,params:[front],explanation:`Remove value: ${data} from deque`,customEnd:true,isAnimationStep:true,customUndoEnd:true,customRedoEnd:true,});
        animation.push({method:this.unmakeElement,noAnim:true,returnsUndoData:true});
        if (front) {
            animation.push(...this.updateFrontPointer(1));
        }
        animation.push(...this.updateSizePointer(-1));
        animation.push({method:this.showText,params:[`Successfully removed ${data} from ${front ? "front of " : "back of"} deque.`,Colors.GREEN],noAnim:true});
        this.addAnimation(animation);
        this.endDrawLoop();
        this.stepForward();
        return data;
    }

    removeFirst() {
        return this.remove(true);
    }

    removeLast() {
        return this.remove(false);
    }

    createCopyArray() {
        let animation = [];
        animation.push({method:this.initCopyArray,noAnim:true,explanation:`Deque full, resizing to length ${this.backingArray.length*2}`,isForwardStep:true,});
        animation.push(...this.useFrontPointer(true));
        for (let i = 0; i < this.size; i++) {
            animation.push(...this.addItemToCopy(i));
        }
        animation.push(...this.useCopyArr());
        animation.push(...this.updateFrontPointer(0));
        return animation;
    }

    initCopyArray() {
        this.copyArray = new Array(this.backingArray.length * 2);
        for (let i = 0; i < this.size; i++) {
            let arrIndex = (i + this.frontPointerValue) % this.backingArray.length;
            let pos = this.getElementPosition(arrIndex);
            this.copyArray[i] = new HeapElement({data: this.backingArray[arrIndex].value, index: i, x:pos[0],y:pos[1],},);
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
            let stopID = ++this.stopID;console.log(stopID);
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
            let stopID = ++this.stopID;console.log(stopID);
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
        animation.push({method:this.assignCopyArray,noAnim:true,isBackStep:true,customUndoEnd:true,returnsUndoData:true});
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
            let stopID = ++this.stopID;console.log(stopID);
            element.addOnStop((el) => {
                this.stopDrawing(stopID);
            })
        }
    }
    redo_shiftElementToBackingArray(index) {
        let element = this.backingArray[index];
        element.shift(...this.getElementPosition(element.index));
        if (index === this.size - 1) {
            let stopID = ++this.stopID;console.log(stopID);
            element.addOnStop((el) => {
                this.stopDrawing(stopID);
            })
        }
    }

    createElement(data, front) {
        this.tempElement = new HeapElement({data: data, index: this.getIndex(front ? this.frontPointerValue - 1 : this.frontPointerValue + this.size), x:45,y:45,},);
        return [this.tempElement];
    }
    undo_createElement() {
        this.tempElement = null;
    }
    redo_createElement(newTemp) {
        this.tempElement = newTemp;
        this.tempElement.goTo(45,45);
    }

    useSizePointer() {
        let animation = [];
        animation.push({method:this.sizePointerHighlighter.highlight,scope:this.sizePointerHighlighter,noAnim:true,});
        animation.push({method:this.moveSizeTracker,customEnd:true,explanation:`Size points to index |RETURN|`,explanationUsesReturn:true,isAnimationStep:true,customUndoEnd:true,customRedoEnd:true,});
        animation.push({method:this.sizePointerHighlighter.unhighlight,scope:this.sizePointerHighlighter,noAnim:true,});
        animation.push({method:this.sizePointerHighlighter.goTo,scope:this.sizePointerHighlighter,params:[Heap.SIZE_LOCATION_X,Heap.SIZE_LOCATION_Y,],noAnim:true,returnsUndoData:true});
        return animation;
    }

    // moveSizeTracker() {
    //     let pos = this.getElementPosition(this.size);
    //     this.sizePointerHighlighter.highlight();
    //     this.sizePointerHighlighter.shift(pos[0], pos[1] + Heap.ELEMENT_SIZE);
    //     this.sizePointerHighlighter.addOnStop((element) => {
    //         element.unhighlight();
    //         this.doneAnimating(0);
    //     });
    //     return this.size;
    // }
    // undo_moveSizeTracker() {
    //     this.sizePointerHighlighter.shift(Heap.SIZE_LOCATION_X,Heap.SIZE_LOCATION_Y);
    //     this.sizePointerHighlighter.highlight();
    //     let stopID = ++this.stopID;console.log(stopID);
    //     this.sizePointerHighlighter.addOnStop((element) => {
    //         element.unhighlight();
    //         this.stopDrawing(stopID);
    //     });
    //     return this.size;
    // }
    // redo_moveSizeTracker() {
    //     let pos = this.getElementPosition(this.size);
    //     this.sizePointerHighlighter.highlight();
    //     this.sizePointerHighlighter.shift(pos[0], pos[1] + Heap.ELEMENT_SIZE);
    //     let stopID = ++this.stopID;console.log(stopID);
    //     this.sizePointerHighlighter.addOnStop((element) => {
    //         element.unhighlight();
    //         this.stopDrawing(stopID);
    //     });
    //     return this.size;
    // }

    highlightTemp(color = Colors.BLUE) {
        this.tempElement.highlight(color);
    }
    undo_highlightTemp() {
        this.tempElement.unhighlight();
    }

    insertElement() {
        let index = this.tempElement.index;
        this.backingArray[index] = this.tempElement;
        this.highlightTemp();
        this.tempElement.shift(...this.getElementPosition(index));
        this.tempElement.addOnStop((element) => {
            element.unhighlight();
            this.doneAnimating(0);
        });
        let oldTemp = this.tempElement;
        this.tempElement = null;
        return [oldTemp];
    }
    undo_insertElement(oldTemp) {
        this.tempElement = oldTemp;
        let index = this.tempElement.index;
        this.highlightTemp();
        this.tempElement.shift(45,45);
        let stopID = ++this.stopID;console.log(stopID);
        this.tempElement.addOnStop((element) => {
            element.unhighlight();
            this.stopDrawing(stopID);
        });
        this.backingArray[index] = null;
    }
    redo_insertElement() {
        let index = this.tempElement.index;
        this.backingArray[index] = this.tempElement;
        this.highlightTemp();
        this.tempElement.shift(...this.getElementPosition(index));
        let stopID = ++this.stopID;console.log(stopID);
        console.log(stopID);
        this.tempElement.addOnStop((element) => {
            element.unhighlight();
            this.stopDrawing(stopID);
        });
        this.tempElement = null;
    }

    useFrontPointer(end = false) {
        let animation = [];
        animation.push({method:this.frontPointerHighlighter.highlight,scope:this.frontPointerHighlighter,noAnim:true,});
        animation.push({method:this.moveFrontTracker,params:[0,false],customEnd:true,explanation:`Front points to index |RETURN|`,explanationUsesReturn:true,isAnimationStep:true,returnsUndoData:true,customUndoEnd:true,customRedoEnd:true,});
        animation.push({method:this.frontPointerHighlighter.unhighlight,scope:this.frontPointerHighlighter,noAnim:true,});
        if (end) {
            animation.push({method:this.frontPointerHighlighter.goTo,scope:this.frontPointerHighlighter,params:[Heap.FRONT_LOCATION_X,Heap.FRONT_LOCATION_Y,],noAnim:true,returnsUndoData:true,});
        }
        return animation;
    }
    useFrontDecrementPointer(add) {
        let animation = [];
        // animation.push({method:this.frontPointerHighlighter.goTo,scope:this.frontPointerHighlighter,params:[...this.getElementPosition(this.frontPointerValue)],noAnim:true,returnsUndoData:true,});
        animation.push({method:this.frontPointerHighlighter.highlight,scope:this.frontPointerHighlighter,noAnim:true,});
        animation.push({method:this.moveFrontTracker,params:[-1,!add],customEnd:true,explanation:`${add ? "Add at" : "Remove from"} index (front${add ? " " : " + size "}- 1) % backingArray.length = |RETURN|`,explanationUsesReturn:true,isForwardStep:true,isBackStep:add,returnsUndoData:true,customUndoEnd:true,customRedoEnd:true,});
        animation.push({method:this.frontPointerHighlighter.unhighlight,scope:this.frontPointerHighlighter,noAnim:true,});
        animation.push({method:this.frontPointerHighlighter.goTo,scope:this.frontPointerHighlighter,params:[Heap.FRONT_LOCATION_X,Heap.FRONT_LOCATION_Y,],noAnim:true,returnsUndoData:true,});
        return animation;
    }
    useFrontSizePointer(add, end = true) {
        let animation = [];
        // animation.push({method:this.frontPointerHighlighter.goTo,scope:this.frontPointerHighlighter,params:[...this.getElementPosition(this.frontPointerValue)],noAnim:true,returnsUndoData:true,});
        animation.push({method:this.frontPointerHighlighter.highlight,scope:this.frontPointerHighlighter,noAnim:true,});
        animation.push({method:this.moveFrontTracker,params:[0,true],customEnd:true,explanation:`${add ? "Add at" : "Remove from"} index (front + size${add ? "" : " - 1"}) % backingArray.length = |RETURN|`,explanationUsesReturn:true,isForwardStep:end,isBackStep:true,returnsUndoData:true,customUndoEnd:true,customRedoEnd:true,});
        animation.push({method:this.frontPointerHighlighter.unhighlight,scope:this.frontPointerHighlighter,noAnim:true,});
        if (end) {
            animation.push({method:this.frontPointerHighlighter.goTo,scope:this.frontPointerHighlighter,params:[Heap.FRONT_LOCATION_X,Heap.FRONT_LOCATION_Y,],noAnim:true,returnsUndoData:true,});
        }
        return animation;
    }

    moveFrontTracker(offset, fromSize) {
        let oldX = this.frontPointerHighlighter.desiredX;
        let oldY = this.frontPointerHighlighter.desiredY;
        let index = this.getIndex(this.frontPointerValue + offset + (fromSize ? this.size : 0));
        let pos = this.getElementPosition(index);
        this.frontPointerHighlighter.highlight();
        this.frontPointerHighlighter.shift(pos[0], pos[1] + Heap.ELEMENT_SIZE);
        this.frontPointerHighlighter.addOnStop((element) => {
            element.unhighlight();
            this.doneAnimating(0);
        });
        return [index, [oldX,oldY]];
    }
    undo_moveFrontTracker(oldX,oldY) {
        this.frontPointerHighlighter.highlight();
        this.frontPointerHighlighter.shift(oldX, oldY);
        let stopID = ++this.stopID;console.log(stopID);
        this.frontPointerHighlighter.addOnStop((element) => {
            element.unhighlight();
            this.stopDrawing(stopID);
        });
    }
    redo_moveFrontTracker(offset, fromSize) {
        let index = this.getIndex(this.frontPointerValue + offset + (fromSize ? this.size : 0));
        let pos = this.getElementPosition(index);
        this.frontPointerHighlighter.highlight();
        this.frontPointerHighlighter.shift(pos[0], pos[1] + Heap.ELEMENT_SIZE);
        let stopID = ++this.stopID;console.log(stopID);
        this.frontPointerHighlighter.addOnStop((element) => {
            element.unhighlight();
            this.stopDrawing(stopID);
        });
    }

    extractElement(front) {
        let index = this.getIndex(this.frontPointerValue + (front ? 0 : this.size - 1));
        this.tempElement = this.backingArray[index];
        this.backingArray[index] = null;
        this.tempElement.highlightForMovement();
        this.tempElement.shift(45,45);
        this.tempElement.addOnStop((element) => {
            element.unhighlight();
            this.doneAnimating(0);
        });
    }
    undo_extractElement(front) {
        let index = this.getIndex(this.frontPointerValue + (front ? 0 : this.size - 1));
        this.tempElement.highlightForMovement();
        this.tempElement.shift(...this.getElementPosition(index));
        let stopID = ++this.stopID;console.log(stopID);
        this.tempElement.addOnStop((element) => {
            element.unhighlight();
            this.stopDrawing(stopID);
        });
        this.backingArray[index] = this.tempElement;
        this.tempElement = null;
    }
    redo_extractElement(front) {
        let index = this.getIndex(this.frontPointerValue + (front ? 0 : this.size - 1));
        this.tempElement = this.backingArray[index];
        this.backingArray[index] = null;
        this.tempElement.highlightForMovement();
        this.tempElement.shift(45,45);
        let stopID = ++this.stopID;console.log(stopID);
        this.tempElement.addOnStop((element) => {
            element.unhighlight();
            this.stopDrawing(stopID);
        });
    }

    unmakeElement() {
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

    updateFrontPointer(offset) {
        let animation = [];
        animation.push({method:this.frontPointerHighlighter.highlight,scope:this.frontPointerHighlighter,params:[Colors.RED, AttractedHighlightableObject.HIGHLIGHT_SQUARE],isForwardStep:false,});
        animation.push({method:this.changeFrontPointerValue,params:[offset],explanation:`Update front pointer to |RETURN|`,explanationUsesReturn:true,isAnimationStep:true,returnsUndoData:true,});
        animation.push({method:this.frontPointerHighlighter.unhighlight,scope:this.frontPointerHighlighter,noAnim:true,isBackStep:false,undoData:[Colors.RED, AttractedHighlightableObject.HIGHLIGHT_SQUARE],});
        return animation;
    }

    changeFrontPointerValue(offset) {
        let oldFront = this.frontPointerValue;
        if (offset === 0) {
            this.frontPointerValue = 0;
        } else {
            this.frontPointerValue = this.getIndex(this.frontPointerValue + offset);
        }
        return [this.frontPointerValue,[oldFront]];
    }
    undo_changeFrontPointerValue(oldFront) {
        this.frontPointerValue = oldFront;
        return this.frontPointerValue;
    }

    updateSizePointer(offset) {
        let animation = [];
        animation.push({method:this.sizePointerHighlighter.highlight,scope:this.sizePointerHighlighter,params:[Colors.RED, AttractedHighlightableObject.HIGHLIGHT_SQUARE],isForwardStep:false,});
        animation.push({method:this.changeSizePointerValue,params:[offset],explanation:`Update size to |RETURN|`,explanationUsesReturn:true,isAnimationStep:true,returnsUndoData:true,});
        animation.push({method:this.sizePointerHighlighter.unhighlight,scope:this.sizePointerHighlighter,noAnim:true,isBackStep:false,undoData:[Colors.RED, AttractedHighlightableObject.HIGHLIGHT_SQUARE],});
        return animation;
    }

    changeSizePointerValue(offset) {
        let oldSize = this.size;
        this.size += offset;
        return [this.size,[oldSize]];
    }
    undo_changeSizePointerValue(oldSize) {
        this.size = oldSize;
        return this.size;
    }


    getIndex(index, copy = false) {
        let array = copy ? this.copyArray : this.backingArray;
        index %= array.length;
        if (index < 0) {
            index += array.length;
        }
        return index;
    }

    getElementPosition(index, copy = false) {
        let maxPerRow = Math.floor(this.width / Heap.ELEMENT_SIZE);
        let x = Heap.ELEMENT_SIZE * index;
        let y = 50 + Math.floor(index / maxPerRow) * 2 * Heap.ELEMENT_SIZE;
        x = (index % maxPerRow) * Heap.ELEMENT_SIZE;
        return [x + Heap.ELEMENT_SIZE/2 + this.x,y + Heap.ELEMENT_SIZE/2 + this.y + (copy ? (Math.ceil(this.backingArray.length / maxPerRow)*Heap.ELEMENT_SIZE*2) : 0)];
    }

    updateElement(element, animationSpeed, p5) {
        if (element) {
            element.update(animationSpeed, p5);
        }
    }

    update(animationSpeed, p5) {
        super.update(animationSpeed, p5, () => {
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
            this.frontPointerHighlighter.update(animationSpeed, p5);
            this.sizePointerHighlighter.update(animationSpeed, p5);
        });
    }

    draw(p5) {
        super.draw(p5);
        p5.push();

        p5.textAlign(p5.CENTER,p5.CENTER);
        p5.textSize(this.ELEMENT_SIZE/3 - 2);

        p5.fill(0);
        p5.text("Front: ", Heap.FRONT_LOCATION_X - 50, Heap.FRONT_LOCATION_Y, Heap.ELEMENT_SIZE);
        p5.text(this.frontPointerValue.toString(), Heap.FRONT_LOCATION_X-25, Heap.FRONT_LOCATION_Y, Heap.ELEMENT_SIZE);
        p5.text("Size: ", Heap.SIZE_LOCATION_X - 50, Heap.SIZE_LOCATION_Y, Heap.ELEMENT_SIZE);
        p5.text(this.size.toString(), Heap.SIZE_LOCATION_X-25, Heap.SIZE_LOCATION_Y, Heap.ELEMENT_SIZE);

        for (let i = 0; i < this.backingArray.length; i++) {
            if (this.backingArray[i]) {
                this.backingArray[i].draw(p5);
            }
            let pos = this.getElementPosition(i);
            p5.noFill();
            p5.stroke(0);
            p5.square(pos[0] - Heap.ELEMENT_SIZE/2,pos[1] - Heap.ELEMENT_SIZE/2, Heap.ELEMENT_SIZE);
            p5.fill(...Colors.BLUE);
            p5.stroke(...Colors.BLUE);
            p5.text(i.toString(), pos[0] - Heap.ELEMENT_SIZE/2,pos[1] + Heap.ELEMENT_SIZE/2, Heap.ELEMENT_SIZE, Heap.ELEMENT_SIZE);
        }

        if (this.copyArray) {
            for (let i = 0; i < this.copyArray.length; i++) {
                if (this.copyArray[i]) {
                    this.copyArray[i].draw(p5);
                }
                let pos = this.getElementPosition(i, true);
                p5.noFill();
                p5.stroke(0);
                p5.square(pos[0] - Heap.ELEMENT_SIZE/2,pos[1] - Heap.ELEMENT_SIZE/2, Heap.ELEMENT_SIZE);
                p5.fill(...Colors.BLUE);
                p5.stroke(...Colors.BLUE);
                p5.text(i.toString(), pos[0] - Heap.ELEMENT_SIZE/2,pos[1] + Heap.ELEMENT_SIZE/2, Heap.ELEMENT_SIZE, Heap.ELEMENT_SIZE);
            }
        }
        if (this.tempElement) {
            this.tempElement.draw(p5);
        }
        this.frontPointerHighlighter.draw(p5);
        this.sizePointerHighlighter.draw(p5);

        p5.pop();
    }

    windowResized(p5, height, numScrollbars) {
        super.windowResized(p5, height, numScrollbars, (this.copyArray ? this.getElementPosition(this.copyArray.length-1, true)[1] : this.getElementPosition(this.backingArray.length-1)[1]) + Heap.ELEMENT_SIZE, () => {
            for (let i = 0; i < this.backingArray.length; i++) {
                if (this.backingArray[i]) {
                    this.backingArray[i].shift(...this.getElementPosition(i));
                }
            }
            if (this.copyArray) {
                for (let i = 0; i < this.copyArray.length; i++) {
                    if (this.copyArray[i]) {
                        this.copyArray[i].shift(...this.getElementPosition(i,true));
                    }
                }
            }
        });
    }
}


class HeapElement extends AttractedHighlightableObject {

    constructor({data, index, x,y} = {}) {
        super(x,y);

        // this.highlightInnerRadius = Heap.ELEMENT_SIZE/2 - 5;
        this.highlightOuterRadius = Heap.ELEMENT_SIZE/2;

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
        p5.text(this.value.toString(), this.currentX - Heap.ELEMENT_SIZE/2,this.currentY - Heap.ELEMENT_SIZE/2, Heap.ELEMENT_SIZE, Heap.ELEMENT_SIZE);
        p5.pop();
    }
}
