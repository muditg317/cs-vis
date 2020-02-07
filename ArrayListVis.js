let list;

let add;
let remove;


const ELEMENT_SIZE = 50;

function setup() {
    createCanvas(1500,200);
    //background(240);
    list = new ArrayList();
    add = createButton("add");
    add.mousePressed(addToList);
    remove = createButton("remove");
    remove.mousePressed(removeToList);
    console.log(list.backingArray);
}


function draw() {
    stroke(255);
    //strokeWeight(5);
    line(0,0,mouseX,mouseY);
    list.update();
    list.draw();
}


const addToList = () => {
    if (!list.animating) {
    }
}


const removeToList = () => {
    if (!list.animating) {
    }
}


class ArrayList {

    constructor() {
        this.x = 20;
        this.y = 20;


        this.INITIAL_CAPACITY = 9;
        this.backingArray = {};
        this.backingArray.length = 9;
        for (let i = 0; i < this.backingArray.length; i++) {
            this.backingArray[i] = new ArrayElement(i,"",this.x,this.y);
        }
        this.size = 0;

        this.animationQueue = [];
        this.animating = false;

    }

    addAtIndex(index, data) {
        if (this.animating) {
            console.log("animation in progress");
            return;
        }
        if (index < 0 || index > this.size) {
            console.log("index out of bounds");
            return;
        }
        if (data == null) {
            console.log("Cannot add null to ArrayList.");
            return;
        }
        if (this.size == this.backingArray.length) {
            this.animationQueue.push({method:this.doubleSize,params:[],});
        }
        if (index < this.size) {
            this.animationQueue.push({method:this.shiftForIndex,params:[index,],});
        }
        this.animationQueue.push({method:this.setIndex,params:[index,data,],});
        this.animationQueue.push({method:this.sizeIncr,params:[],});
    }

    addToFront(data) {
        this.addAtIndex(0,data);
    }

    addToBack(data) {
        this.addAtIndex(this.size,data);
    }

    add(data) {
        this.addAtIndex(this.size,data);
    }



    removeFromIndex(index) {
        if (this.animating) {
            console.log("animation in progress");
            return;
        }
        if (index < 0 || index >= this.size) {
            console.log(`Index invalid: ${index} for ArrayList of length ${this.size}. Should be [0,${this.size-1}].`);
            return;
        }
        let element = this.backingArray[index];
        let data = element.data;
        element.data = "";
        this.animationQueue.push({method:this.shiftIntoIndex,params:[index,],});
        this.animationQueue.push({method:this.sizeDecr,params:[],});
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
        let prevCapacity = this.backingArray.length;
        this.backingArray.length = 2 * prevCapacity;
        for (let i = prevCapacity; i < this.backingArray.length; i++) {
            this.backingArray[i] = new ArrayElement(i,"",this.x,this.y);
        }
    }

    shiftForIndex(index) {
        for (let i = this.size - 1; i >= index; i--) {
            this.backingArray[i].shift(1);
            this.backingArray[i+1] = this.backingArray[i];
        }
        this.backingArray[index] = new ArrayElement(index,"",this.x,this.y);
    }

    shiftIntoIndex(index) {
        for (let i = index + 1; i < this.size; i++) {
            this.backingArray[i].shift(-1);
            this.backingArray[i-1] = this.backingArray[i];
        }
        this.backingArray[this.size - 1] = new ArrayElement(this.size - 1,"",this.x,this.y);
    }

    update() {
        for (let i = 0; i < this.backingArray.length; i++) {
            this.backingArray[i].update();
        }
        if (!this.animating) {
            if (this.animationQueue.length > 0) {
                let animation = this.animationQueue.shift();
                this.animating = true;
                console.log(animation.method);
                animation.method.apply(this,animation.params);
            }
        } else {
            let foundAnimElement = false;
            for (let i = 0; i < this.size; i++) {
                if (this.backingArray[i].animating) {
                    foundAnimElement = true;
                    break;
                }
            }
            this.animating = foundAnimElement;
        }
    }

    draw() {
        push();
        translate(this.x,this.y);
        push();
        noStroke();
        fill(200);
        rect(ELEMENT_SIZE/10,ELEMENT_SIZE/10,ELEMENT_SIZE*this.backingArray.length,ELEMENT_SIZE,ELEMENT_SIZE/20);
        pop();
        stroke(0);
        rect(0,0,ELEMENT_SIZE*this.backingArray.length,ELEMENT_SIZE);
        for (let i = 1; i < this.backingArray.length; i++) {
            line(ELEMENT_SIZE*i,0, ELEMENT_SIZE*i,ELEMENT_SIZE);
        }
        pop();
        for (let i = 0; i < this.backingArray.length; i++) {
            this.backingArray[i].draw();
        }
    }



}


class ArrayElement {
    constructor(index,data, x,y) {
        this.WIDTH = ELEMENT_SIZE;
        this.HEIGHT = ELEMENT_SIZE;

        this.x = x;
        this.y = y;


        this.index = index;
        this.data = data;

        this.animating = false;
        this.target = 0;
    }

    shift(target) {
        this.target = target;
        this.animating = true;
    }

    update() {
        if (this.target != 0) {
            let delta = Math.sign(this.target)*0.05;
            if (Math.abs(this.target) < 0.01) {
                this.index = Math.round(this.index);
                this.target = 0;
            } else {
                this.index += delta;
                this.target -= delta;
            }
        } else {
            this.animating = false;
        }
    }


    draw() {
        push();
        translate(createVector(this.x+this.WIDTH*this.index,this.y));
        stroke(50);
        textAlign(CENTER,CENTER);
        textSize(this.HEIGHT/3 - 2);
        text(this.data.toString(),0,0,this.WIDTH,this.HEIGHT);
        if (!this.animating) {
            fill(0,0,255);
            noStroke();
            text(this.index.toString(),0,this.HEIGHT,this.WIDTH,this.HEIGHT);
        }
        pop();
    }
}
