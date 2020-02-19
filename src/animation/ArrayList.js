import AnimatedObject from './AnimatedObject';

export default class ArrayList extends AnimatedObject {

    constructor(animator) {
        super();

        this.x = 20;
        this.y = 20;


        //config
        this.ELEMENT_SIZE = 50;

        this.INITIAL_CAPACITY = 9;
        this.backingArray = {};
        this.backingArray.length = 9;
        for (let i = 0; i < this.backingArray.length; i++) {
            this.backingArray[i] = new ArrayElement("", this.ELEMENT_SIZE*i,0, this.ELEMENT_SIZE);
        }
        this.size = 0;

        this.animator = animator;

        this.animationHistory = [];
        this.animationQueue = [];
        this.animating = false;

    }


    addAtIndex(index, data) {
        if (this.animating) {
            console.log("animation in progress");
            return false;
        }
        if (index < 0 || index > this.size) {
            console.log("index out of bounds");
            return false;
        }
        if (data === null) {
            console.log("Cannot add null to ArrayList.");
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
            console.log("animation in progress");
            return false;
        }
        if (index < 0 || index >= this.size) {
            console.log(`Index invalid: ${index} for ArrayList of length ${this.size}. Should be [0,${this.size-1}].`);
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


    reset() {
        this.backingArray = {};
        this.backingArray.length = 9;
        for (let i = 0; i < this.backingArray.length; i++) {
            this.backingArray[i] = new ArrayElement("", this.ELEMENT_SIZE*i,0, this.ELEMENT_SIZE);
        }
        this.size = 0;
        this.animationHistory = [];
        this.animationQueue = [];
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
        console.log(index+direction, this.backingArray[index].data);
        this.backingArray[index+direction].data = this.backingArray[index].data;
        this.backingArray[index].data = "";
    }


    resetElement(index) {
        this.backingArray[index].data = "";
    }

    addAnimation(animation) {
        this.animationQueue.push({method:this.animator.emit,scope:this.animator,params:["anim-start",],});
        this.animationQueue.push(...animation);
        this.animationQueue.push({method:this.animator.emit,scope:this.animator,params:["anim-end",],});
    }

    update(animationSpeed) {
        super.update();
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
        if (!this.animating) {
            if (this.animationQueue.length > 0) {
                let animation = this.animationQueue.shift();
                this.animating = true;
                animation.method.apply(animation.scope || this, animation.params);
            }
        }
    }

    draw(p5) {
        let maxPerRow = Math.floor((p5.width - 2 * this.x) / this.ELEMENT_SIZE);
        let rows = Math.ceil(this.backingArray.length / maxPerRow);

        // let width = p5.height;
        // let height = p5.height;
        // if (rows*2*this.ELEMENT_SIZE > (height - (2*this.y))) {
        //     height = (rows*2*this.ELEMENT_SIZE + (3*this.y))
        //     width -= 16;
        //     document.querySelector(".canvas-container").classList.add("overflow");
        //     p5.resizeCanvas(width, height);
        // } else {
        //     document.querySelector(".canvas-container").classList.remove("overflow");
        // }

        p5.push();
        p5.translate(this.x,this.y);

        for (let row = 0; row < rows; row++) {
            let numElements = row !== rows-1 ? maxPerRow
                    : (this.backingArray.length % maxPerRow === 0 ? maxPerRow : (this.backingArray.length % maxPerRow));
            p5.noStroke();
            p5.fill(200);
            p5.rect(this.ELEMENT_SIZE/10,this.ELEMENT_SIZE/10 + (2 * this.ELEMENT_SIZE * row),this.ELEMENT_SIZE*numElements,this.ELEMENT_SIZE,this.ELEMENT_SIZE/20);

            p5.stroke(0);
            p5.fill(255);
            p5.rect(0,(2 * this.ELEMENT_SIZE * row), this.ELEMENT_SIZE*numElements,this.ELEMENT_SIZE);
        }

        p5.textAlign(p5.CENTER,p5.CENTER);
        p5.textSize(this.ELEMENT_SIZE/3 - 2);

        let i = 0;
        for (let row = 0; row < rows; row++) {
            let numElements = row !== rows-1 ? maxPerRow
                    : (this.backingArray.length % maxPerRow === 0 ? maxPerRow : (this.backingArray.length % maxPerRow));
            let x = 0;
            let y = 2 * row * this.ELEMENT_SIZE;
            for (let block = 0; block < numElements; block++) {
                p5.stroke(0);
                p5.line(x,y, x, y+this.ELEMENT_SIZE);

                p5.noStroke();
                p5.fill(0,0,255);
                p5.text(i.toString(), x,y+this.ELEMENT_SIZE, this.ELEMENT_SIZE,this.ELEMENT_SIZE);

                let element = this.backingArray[i++];
                let nextX = block < (numElements - 1) ? x + this.ELEMENT_SIZE : 0;
                let nextY = block < (numElements - 1) ? y : (y + (this.ELEMENT_SIZE*2));
                if (element.data) {
                    element.draw(p5, x,y,nextX,nextY);
                }
                x = nextX;
                y = nextY;
            }
        }


        p5.pop();
    }

    windowResized(p5, height) {
        let maxPerRow = Math.floor((p5.width - 2 * this.x) / this.ELEMENT_SIZE);
        let rows = Math.ceil(this.backingArray.length / maxPerRow);

        let width = p5.windowWidth;
        // let height = p5.height;
        if (rows*2*this.ELEMENT_SIZE > (height - (2*this.y))) {
            height = (rows*2*this.ELEMENT_SIZE + (3*this.y))
            width -= 16;
            document.querySelector(".canvas-container").classList.add("overflow");
        } else {
            document.querySelector(".canvas-container").classList.remove("overflow");
        }
        p5.resizeCanvas(width, height);
    }
}


class ArrayElement extends AnimatedObject {
    constructor(data, x,y, SIZE) {
        super();
        // this.x = x;
        // this.y = y;

        this.data = data;

        this.SIZE = SIZE;
    }

    shift(direction) {
        super.travel();
    }

    update(animationSpeed) {
        super.update(animationSpeed);
    }


    draw(p5, x,y, toX,toY) {
        p5.push();
        p5.fill(0);
        p5.stroke(50);
        if (!this.inPosition()) {
            let posX = (toX-x)*this.xProgress + x;
            let posY = (toY-y)*this.yProgress + y;
            p5.text(this.data.toString(), posX,posY, this.SIZE,this.SIZE);
        } else {
            p5.text(this.data.toString(), x,y, this.SIZE,this.SIZE)
        }
        p5.pop();
    }
}
