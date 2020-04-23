import { Visualization } from 'animation';
import { AttractedHighlightableObject } from 'animation';
import { Colors } from 'utils';

export default class StackArray extends Visualization {
    static USE_CANVAS = true;
    static SET_BOUNDS = true;
    static SUPPORTS_NO_LOOP = true;
    static SUPPORTS_CUSTOM_END = true;
    static MAX_ANIM_TIME = 5000;
    static SUPPORTS_TEXT = true;

    static INITIAL_CAPACITY = 9;

    static ELEMENT_SIZE = 50;
    static TOP_LOCATION_X = 125;
    static TOP_LOCATION_Y = 45;

    constructor(animator) {
        super(animator);

        this.reset();
        this.made = true;
    }

    reset() {
        if (this.made) {
            this.beginDrawLoop();
        }
        super.reset();
        this.backingArray = new Array(StackArray.INITIAL_CAPACITY);
        this.size = 0;
        this.copyArray = null;
        this.tempElement = null;
        this.topPointerValue = 0;
        this.topPointerHighlighter = new AttractedHighlightableObject(StackArray.TOP_LOCATION_X, StackArray.TOP_LOCATION_Y, {
            highlightOuterRadius: 15//StackArray.ELEMENT_SIZE/2,
        });

        this.resizing = false;
        if (this.made) {
            this.updateText("Animation Ready");
            this.endDrawLoop();
        }
    }

    push(data) {
        if (this.animating) {
            console.log("animation in progress");
            return false;
        }
        this.beginDrawLoop();
        if (data === null) {
            this.updateText("Cannot add null to Stack.", Colors.RED);
            return false;
        }
        let animation = [];
        if (this.size === this.backingArray.length) {
            this.updateText(`Stack full, resizing to length ${this.backingArray.length*2}`);
            animation.push(...this.createCopyArray());
        }
        animation.push({method:this.makeElement,params:[this.size,data],explanation:`Create value: ${data}`,});
        animation.push(...this.useTopPointer());
        animation.push({method:this.highlightTemp,params:[],noAnim:true});
        animation.push({method:this.insertElement,params:[this.size],customEnd:true,explanation:`Added ${data} to backingArray`});
        animation.push({method:this.sizeIncr,params:[],noAnim:true});
        animation.push(...this.updateTopPointer());
        this.animationQueue.push({method:this.showText,params:[`Successfully pushed ${data} to stack.`,Colors.GREEN,],});
        this.addAnimation(animation);
        this.endDrawLoop();
        return true;
    }

    pop() {
        if (this.animating) {
            console.log("animation in progress");
            return false;
        }
        this.beginDrawLoop();
        if (this.size === 0) {
            this.updateText("Cannot pop empty Stack", Colors.RED);
            return false;
        }
        let animation = [];
        let data = this.backingArray[this.size - 1].value;
        animation.push({method:this.sizeDecr,params:[],noAnim:true});
        animation.push(...this.updateTopPointer());
        animation.push(...this.useTopPointer());
        animation.push({method:this.extractElement,params:[],explanation:`Pop value: ${data} from stack`,customEnd:true});
        animation.push({method:this.unmakeElement,params:[],noAnim:true});
        // animation.push({method:this.highlightTemp,params:[],noAnim:true});
        // animation.push({method:this.insertElement,params:[this.size],customEnd:true,explanation:`Added ${data} to backingArray`});
        // animation.push({method:this.makeElement,params:[this.size,data],explanation:`Create value: ${data}`});

        // if (index === 0) {
        //     data = this.head.data;
        //     animation.push({method:this.moveHighlight,params:[null,this.head,],});
        //     animation.push({method:this.changeHeadData,params:[this.head.next.data],});
        //     index = 1;
        // }
        // let prev;
        // let toDelete;
        // let next;
        // let node = this.head;
        // animation.push({method:this.moveHighlight,params:[null,node,],});
        // for (let i = 0; i < index - 1; i++) {
        //     animation.push({method:this.moveHighlight,params:[node,node.next,],});
        //     node = node.next;
        // }
        // prev = node;
        // toDelete = prev.next;
        // next = toDelete.next;
        // if (!data) {
        //     data = toDelete.data;
        // }
        // animation.push({method:this.markNodeForDeletion,params:[prev,toDelete,],});
        // animation.push({method:this.unmakeNode,params:[toDelete,],customEnd:true,});
        // if (index < this.size - 1) {
        //     animation.push({method:this.shiftIntoNode,params:[next,],});
        // }
        // animation.push({method:this.skipTempNode,params:[prev,],});
        // animation.push({method:this.sizeDecr,params:[],});
        this.addAnimation(animation);
        this.updateText(`Successfully popped ${data} from stack.`, Colors.GREEN);
        this.endDrawLoop();
        // this.animationHistory.push(animation)
        return data;
    }

    createCopyArray() {
        let animation = [];
        animation.push({method:this.initCopyArray,params:[],noAnim:true});
        for (let i = 0; i < this.size; i++) {
            animation.push(...this.addItemToCopy(i));
        }
        animation.push(...this.useCopyArr());
        return animation;
    }

    initCopyArray() {
        this.copyArray = new Array(this.backingArray.length * 2);
        for (let i = 0; i < this.size; i++) {
            let pos = this.getElementPosition(i);
            this.copyArray[i] = new StackArrayElement({data: this.backingArray[i].value, index: i, x:pos[0],y:pos[1],},);
        }
    }

    addItemToCopy(index) {
        let animation = [];
        animation.push({method:this.customEndingElementShift,params:[index,...this.getElementPosition(index,true),true],customEnd:true});
        return animation;
    }

    useCopyArr() {
        let animation = [];
        animation.push({method:this.assignCopyArray,params:[],noAnim:true});
        for (let i = 0; i < this.size; i++) {
            animation.push({method:this.shiftElementToBackingArray,params:[i,],noAnim:true});
        }
        return animation;
    }

    assignCopyArray() {
        this.backingArray = this.copyArray;
        this.copyArray = null;
    }

    shiftElementToBackingArray(index) {
        let element = this.backingArray[index];
        element.shift(...this.getElementPosition(element.index));
    }

    makeElement(index, data, immediateHighlight = false) {
        this.tempElement = new StackArrayElement({data: data, index: index, x:45,y:45,},);
        if (immediateHighlight) {
            this.tempElement.highlightForMovement();
        }
    }

    useTopPointer() {
        let animation = [];
        animation.push({method:this.topPointerHighlighter.highlight,scope:this.topPointerHighlighter,params:[],noAnim:true});
        animation.push({method:this.moveTopTracker,params:[],customEnd:true,explanation:`Top points to index |RETURN|`,explanationUsesReturn:true});
        animation.push({method:this.topPointerHighlighter.unhighlight,scope:this.topPointerHighlighter,params:[],noAnim:true});
        animation.push({method:this.topPointerHighlighter.goTo,scope:this.topPointerHighlighter,params:[StackArray.TOP_LOCATION_X,StackArray.TOP_LOCATION_Y,],noAnim:true});
        return animation;
    }

    moveTopTracker() {
        let pos = this.getElementPosition(this.topPointerValue);
        this.topPointerHighlighter.shift(pos[0], pos[1] + StackArray.ELEMENT_SIZE);
        this.topPointerHighlighter.addOnStop(() => {
            this.doneAnimating(0);
        });
        return this.topPointerValue;
    }

    highlightTemp(color = Colors.BLUE) {
        this.tempElement.highlight(color);
    }

    insertElement(index) {
        this.backingArray[index] = this.tempElement;
        this.tempElement.shift(...this.getElementPosition(index));
        this.tempElement.addOnStop((element) => {
            element.unhighlight();
            this.doneAnimating(0);
        });
        this.tempElement = null;
    }

    extractElement() {
        this.tempElement = this.backingArray[this.topPointerValue];
        this.backingArray[this.topPointerValue] = null;
        this.tempElement.highlightForMovement();
        this.tempElement.shift(45,45);
        this.tempElement.addOnStop(() => {
            this.tempElement.unhighlight();
            this.doneAnimating();
        });
    }

    unmakeElement(index) {
        this.tempElement = null;
    }

    shiftElement(element, direction = 0) {
        element.shift(...this.getElementPosition(element.index + direction), direction);
    }

    customEndingElementShift(index, x, y, copy = false) {
        let element = (copy ? this.copyArray : this.backingArray)[index];
        element.highlightForMovement();
        element.shift(x,y);
        element.addOnStop(() => {
            element.unhighlight();
            this.doneAnimating(0);
        });
    }

    sizeIncr() {
        this.size++;
    }

    sizeDecr() {
        this.size--;
    }

    updateTopPointer() {
        let animation = [];
        animation.push({method:this.topPointerHighlighter.highlight,scope:this.topPointerHighlighter,params:[Colors.RED, AttractedHighlightableObject.HIGHLIGHT_SQUARE]});
        animation.push({method:this.changeTopPointerValue,params:[],explanation:`Update top pointer to |RETURN|`,explanationUsesReturn:true});
        animation.push({method:this.topPointerHighlighter.unhighlight,scope:this.topPointerHighlighter,params:[],noAnim:true});
        return animation;
    }

    changeTopPointerValue() {
        this.topPointerValue = this.size;
        return this.size;
    }

    getElementPosition(index, copy = false) {
        let maxPerRow = Math.floor(this.width / StackArray.ELEMENT_SIZE);
        let x = StackArray.ELEMENT_SIZE * index;
        let y = 50 + Math.floor(index / maxPerRow) * 2 * StackArray.ELEMENT_SIZE;
        x = (index % maxPerRow) * StackArray.ELEMENT_SIZE;
        return [x + StackArray.ELEMENT_SIZE/2 + this.x,y + StackArray.ELEMENT_SIZE/2 + this.y + (copy ? (Math.ceil(this.backingArray.length / maxPerRow)*StackArray.ELEMENT_SIZE*2) : 0)];
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
            this.topPointerHighlighter.update(animationSpeed, p5);
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
        // console.log("draw");
        p5.push();
        // let maxPerRow = Math.max(1, Math.floor((p5.width - 2 * this.x) / StackArray.ELEMENT_SIZE));
        // let rows = Math.ceil(this.backingArray.length / maxPerRow);

        // p5.translate(this.x,this.y+50);
        //
        p5.textAlign(p5.CENTER,p5.CENTER);
        p5.textSize(this.ELEMENT_SIZE/3 - 2);
        //
        // for (let row = 0; row < rows; row++) {
        //     let numElements = row !== rows-1 ? maxPerRow
        //             : (this.backingArray.length % maxPerRow === 0 ? maxPerRow : (this.backingArray.length % maxPerRow));
        //     p5.noStroke();
        //     p5.fill(200);
        //     p5.rect(StackArray.ELEMENT_SIZE/10,StackArray.ELEMENT_SIZE/10 + (2 * StackArray.ELEMENT_SIZE * row),StackArray.ELEMENT_SIZE*numElements,StackArray.ELEMENT_SIZE,StackArray.ELEMENT_SIZE/20);
        //
        //     p5.stroke(0);
        //     p5.fill(255);
        //     p5.rect(0,(2 * StackArray.ELEMENT_SIZE * row), StackArray.ELEMENT_SIZE*numElements,StackArray.ELEMENT_SIZE);
        // }
        //
        // let i = 0;
        // for (let row = 0; row < rows; row++) {
        //     let numElements = row !== rows-1 ? maxPerRow
        //             : (this.backingArray.length % maxPerRow === 0 ? maxPerRow : (this.backingArray.length % maxPerRow));
        //     let x = 0;
        //     let y = 2 * row * StackArray.ELEMENT_SIZE;
        //     for (let block = 0; block < numElements; block++) {
        //         p5.stroke(0);
        //         p5.line(x,y, x, y+StackArray.ELEMENT_SIZE);
        //
        //         p5.noStroke();
        //         p5.fill(0,0,255);
        //         p5.text(i.toString(), x,y+StackArray.ELEMENT_SIZE, StackArray.ELEMENT_SIZE,StackArray.ELEMENT_SIZE);
        //         //
        //         // let element = this.backingArray[i++];
        //         i++;
        //         let nextX = block < (numElements - 1) ? x + StackArray.ELEMENT_SIZE : 0;
        //         let nextY = block < (numElements - 1) ? y : (y + (StackArray.ELEMENT_SIZE*2));
        //         // if (element.data) {
        //         //     element.draw(p5, x,y,nextX,nextY);
        //         // }
        //         x = nextX;
        //         y = nextY;
        //         // if (y >= document.querySelector(".canvas-container").getBoundingClientRect().height - StackArray.ELEMENT_SIZE) {
        //         //     // this.windowResized(p5, document.querySelector(".canvas-container").getBoundingClientRect().height);
        //         // }
        //     }
        // }
        //
        // p5.translate(-this.x, -this.y - 50);

        p5.fill(0);
        p5.text("Top: ", StackArray.TOP_LOCATION_X - 50, StackArray.TOP_LOCATION_Y, StackArray.ELEMENT_SIZE);

        p5.text(this.topPointerValue.toString(), StackArray.TOP_LOCATION_X-25, StackArray.TOP_LOCATION_Y, StackArray.ELEMENT_SIZE);

        for (let i = 0; i < this.backingArray.length; i++) {
            if (this.backingArray[i]) {
                this.backingArray[i].draw(p5);
            }
            let pos = this.getElementPosition(i);
            p5.noFill();
            p5.stroke(0);
            p5.square(pos[0] - StackArray.ELEMENT_SIZE/2,pos[1] - StackArray.ELEMENT_SIZE/2, StackArray.ELEMENT_SIZE);
            p5.fill(...Colors.BLUE);
            p5.stroke(...Colors.BLUE);
            p5.text(i.toString(), pos[0] - StackArray.ELEMENT_SIZE/2,pos[1] + StackArray.ELEMENT_SIZE/2, StackArray.ELEMENT_SIZE, StackArray.ELEMENT_SIZE);
        }

        if (this.copyArray) {
            for (let i = 0; i < this.copyArray.length; i++) {
                if (this.copyArray[i]) {
                    this.copyArray[i].draw(p5);
                }
                let pos = this.getElementPosition(i, true);
                p5.noFill();
                p5.stroke(0);
                p5.square(pos[0] - StackArray.ELEMENT_SIZE/2,pos[1] - StackArray.ELEMENT_SIZE/2, StackArray.ELEMENT_SIZE);
                p5.fill(...Colors.BLUE);
                p5.stroke(...Colors.BLUE);
                p5.text(i.toString(), pos[0] - StackArray.ELEMENT_SIZE/2,pos[1] + StackArray.ELEMENT_SIZE/2, StackArray.ELEMENT_SIZE, StackArray.ELEMENT_SIZE);
            }
        }
        if (this.tempElement) {
            this.tempElement.draw(p5);
        }
        this.topPointerHighlighter.draw(p5);

        p5.pop();
    }

    windowResized(p5, height, numScrollbars) {
        super.windowResized(p5, height, numScrollbars, (this.copyArray ? this.getElementPosition(this.copyArray.length-1, true)[1] : this.getElementPosition(this.backingArray.length-1)[1]) + StackArray.ELEMENT_SIZE);
        for (let i = 0; i < this.backingArray.length; i++) {
            if (this.backingArray[i]) {
                this.backingArray[i].shift(...this.getElementPosition(i));
            }
        }
        this.resizing = true;
        this.animator.loop();
    }
}


class StackArrayElement extends AttractedHighlightableObject {

    constructor({data, index, x,y} = {}) {
        super(x,y);

        // this.highlightInnerRadius = StackArray.ELEMENT_SIZE/2 - 5;
        this.highlightOuterRadius = StackArray.ELEMENT_SIZE/2;

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
        p5.text(this.value.toString(), this.currentX - StackArray.ELEMENT_SIZE/2,this.currentY - StackArray.ELEMENT_SIZE/2, StackArray.ELEMENT_SIZE, StackArray.ELEMENT_SIZE);
        p5.pop();
    }
}
