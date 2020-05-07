import { Visualization, AnimatedObject } from 'animation';

export default class ArrayList extends Visualization {
    static USE_CANVAS = true;

    static ELEMENT_SIZE = 50;
    static INITIAL_CAPACITY = 9;

    constructor(animator) {
        super(animator);

        this.reset();
    }


    reset() {
        super.reset();
        this.backingArray = {};
        this.backingArray.length = ArrayList.INITIAL_CAPACITY;
        for (let i = 0; i < this.backingArray.length; i++) {
            this.backingArray[i] = new ArrayElement("");
        }
        this.size = 0;
    }


    addAtIndex(index, data) {
        if (this.animating) {
            //console.log("animation in progress");
            return false;
        }
        if (index < 0 || index > this.size) {
            //console.log("index out of bounds");
            return false;
        }
        if (data === null) {
            //console.log("Cannot add null to ArrayList.");
            return false;
        }
        this.animating = true;
        let animation = [];
        if (this.size === this.backingArray.length) {
            animation.push(...this.doubleSize());
        }
        if (index < this.size) {
            animation.push(...this.shiftForIndex(index));
        }
        animation.push({method:this.setIndex,params:[index,data,],});
        animation.push({method:this.sizeIncr,params:[],});
        this.addAnimation(animation);
        this.animationHistory.push(animation);
        return true;
    }

    addToFront(data) {
        return this.addAtIndex(0,data);
    }

    addToBack(data) {
        return this.addAtIndex(this.size,data);
    }


    removeFromIndex(index) {
        if (this.animating) {
            //console.log("animation in progress");
            return false;
        }
        if (index < 0 || index >= this.size) {
            //console.log(`Index invalid: ${index} for ArrayList of length ${this.size}. Should be [0,${this.size-1}].`);
            return false;
        }
        this.animating = true;
        let animation = [];
        let element = this.backingArray[index];
        let data = element.data;
        element.data = "";
        if (index < this.size - 1) {
            animation.push(...this.shiftIntoIndex(index));
        }
        animation.push({method:this.sizeDecr,params:[],});
        this.addAnimation(animation);
        this.animationHistory.push(animation)
        return data;
    }

    removeFromFront() {
        return this.removeFromIndex(0);
    }

    removeFromBack() {
        return this.removeFromIndex(this.size-1);
    }


    setIndex(index,data) {
        this.backingArray[index].data = data;
    }


    sizeIncr() {
        this.size++;
    }

    sizeDecr() {
        this.size--;
    }

    doubleSize() {
        let animation = []
        let prevCapacity = this.backingArray.length;
        for (let i = prevCapacity; i < this.backingArray.length * 2; i++) {
            animation.push({method:this.resetElement,params:[i,],});
        }
        animation.push({method:this.incrLength,params:[],});
        return animation;
    }

    incrLength() {
        this.backingArray.length = 2 * this.backingArray.length;
    }

    shiftForIndex(index) {
        let animation = []
        for (let i = this.size - 1; i >= index; i--) {
            animation.push(...this.shiftElement(i,1));
        }
        animation.push({method:this.resetElement,params:[index,],});
        return animation;
    }

    shiftIntoIndex(index) {
        let animation = [];
        for (let i = index + 1; i < this.size; i++) {
            animation.push(...this.shiftElement(i,-1));
        }
        animation.push({method:this.resetElement,params:[this.size-1,],});
        return animation;
    }

    shiftElement(index, direction) {
        let animation = [];
        animation.push({method:this.shiftElementMovement,params:[index,direction,],});
        animation.push({method:this.shiftElementIndex,params:[index,direction,],});
        return animation;
    }

    shiftElementMovement(index, direction) {
        this.backingArray[index].shift(direction);
        // console.log("move",index,JSON.stringify(this.backingArray));
    }

    shiftElementIndex(index, direction) {
        // console.log("index",index,JSON.stringify(this.backingArray));
        // console.log(index+direction, this.backingArray[index].data);
        this.backingArray[index+direction].data = this.backingArray[index].data;
        this.backingArray[index].data = "";
    }


    resetElement(index) {
        if (this.backingArray[index]) {
            this.backingArray[index].data = "";
        } else {
            this.backingArray[index] = new ArrayElement("", ArrayList.ELEMENT_SIZE);
        }
    }

    update(animationSpeed, p5) {
        super.update(animationSpeed, p5, () => {
            for (let i = 0; i < this.backingArray.length; i++) {
                if (this.backingArray[i]) {
                    this.backingArray[i].update(animationSpeed);
                }
            }
            let foundAnimElement = false;
            for (let i = 0; i < this.size; i++) {
                if (!this.backingArray[i].inPosition()) {
                    foundAnimElement = true;
                    break;
                }
            }
            this.animating = foundAnimElement;
        });
    }

    draw(p5) {
        let maxPerRow = Math.floor((p5.width - 2 * this.x) / ArrayList.ELEMENT_SIZE);
        let rows = Math.ceil(this.backingArray.length / maxPerRow);

        p5.push();
        p5.translate(this.x,this.y);

        for (let row = 0; row < rows; row++) {
            let numElements = row !== rows-1 ? maxPerRow
                    : (this.backingArray.length % maxPerRow === 0 ? maxPerRow : (this.backingArray.length % maxPerRow));
            p5.noStroke();
            p5.fill(200);
            p5.rect(ArrayList.ELEMENT_SIZE/10,ArrayList.ELEMENT_SIZE/10 + (2 * ArrayList.ELEMENT_SIZE * row),ArrayList.ELEMENT_SIZE*numElements,ArrayList.ELEMENT_SIZE,ArrayList.ELEMENT_SIZE/20);

            p5.stroke(0);
            p5.fill(255);
            p5.rect(0,(2 * ArrayList.ELEMENT_SIZE * row), ArrayList.ELEMENT_SIZE*numElements,ArrayList.ELEMENT_SIZE);
        }

        p5.textAlign(p5.CENTER,p5.CENTER);
        p5.textSize(ArrayList.ELEMENT_SIZE/3 - 2);

        let i = 0;
        for (let row = 0; row < rows; row++) {
            let numElements = row !== rows-1 ? maxPerRow
                    : (this.backingArray.length % maxPerRow === 0 ? maxPerRow : (this.backingArray.length % maxPerRow));
            let x = 0;
            let y = 2 * row * ArrayList.ELEMENT_SIZE;
            for (let block = 0; block < numElements; block++) {
                p5.stroke(0);
                p5.line(x,y, x, y+ArrayList.ELEMENT_SIZE);

                p5.noStroke();
                p5.fill(0,0,255);
                p5.text(i.toString(), x,y+ArrayList.ELEMENT_SIZE, ArrayList.ELEMENT_SIZE,ArrayList.ELEMENT_SIZE);

                let element = this.backingArray[i++];
                let nextX = block < (numElements - 1) ? x + ArrayList.ELEMENT_SIZE : 0;
                let nextY = block < (numElements - 1) ? y : (y + (ArrayList.ELEMENT_SIZE*2));
                if (element.data) {
                    element.draw(p5, x,y,nextX,nextY);
                }
                x = nextX;
                y = nextY;
                if (y >= document.querySelector(".canvas-container").getBoundingClientRect().height - ArrayList.ELEMENT_SIZE) {
                    // this.windowResized(p5, document.querySelector(".canvas-container").getBoundingClientRect().height);
                }
            }
        }


        p5.pop();
    }

    windowResized(p5, height, numScrollbars) {
        super.windowResized(p5, height, numScrollbars, (Math.ceil(this.backingArray.length / (Math.floor((p5.width - 2 * this.x) / ArrayList.ELEMENT_SIZE))))*2*ArrayList.ELEMENT_SIZE);
    }
}


class ArrayElement extends AnimatedObject {
    constructor(data) {
        super();

        this.data = data;
    }

    shift(direction) {
        super.travel(direction);
    }

    draw(p5, x,y, toX,toY) {
        p5.push();
        p5.fill(0);
        p5.stroke(50);
        if (!this.inPosition()) {
            let posX = (toX-x)*this.xProgress + x;
            let posY = (toY-y)*this.yProgress + y;
            p5.text(this.data.toString(), posX,posY, ArrayList.ELEMENT_SIZE,ArrayList.ELEMENT_SIZE);
        } else {
            p5.text(this.data.toString(), x,y, ArrayList.ELEMENT_SIZE,ArrayList.ELEMENT_SIZE)
        }
        p5.pop();
    }
}
