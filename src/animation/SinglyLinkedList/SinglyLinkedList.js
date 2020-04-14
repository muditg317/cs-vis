import AttractedDraggableObject from 'animation/AttractedDraggableObject';
import Visualizer from 'components/visualizer';

export default class SinglyLinkedList {
    static USE_CANVAS = true;

    static ELEMENT_HEIGHT = 35;
    static ELEMENT_WIDTH = 50;
    static POINTER_WIDTH = 15;
    static ITEM_WIDTH = SinglyLinkedList.ELEMENT_WIDTH + SinglyLinkedList.POINTER_WIDTH;
    static SPACING = 50;
    static ELEMENT_SIZE = SinglyLinkedList.ITEM_WIDTH + SinglyLinkedList.SPACING;

    static MAX_DIST_REMOVE = 300;

    constructor(animator) {

        this.x = 20;
        this.y = 20;

        this.reset();

        this.animator = animator;

        this.animationHistory = [];
        this.animationQueue = [];
        this.animating = false;

        console.log(this);
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
        let animation = [];
        let node = null;
        let nextNode = this.head;
        for (let i = 0; i < index; i++) {
            animation.push({method:this.moveHighlight,params:[node,nextNode,],});
            node = nextNode;
            nextNode = nextNode.next;
        }
        animation.push({method:this.makeNode,params:[index,data,],});
        animation.push({method:this.moveHighlight,params:[node,null,],});
        animation.push({method:this.setTempNodeBefore,params:[nextNode,],});
        animation.push({method:this.setTempNodePrev,params:[node,],});
        if (index < this.size) {
            animation.push({method:this.shiftForNode,params:[nextNode,],});
        }
        animation.push({method:this.insertTempNode,params:[index,],});
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
        let animation = [];
        let prev;
        let toDelete;
        let next;
        if (index === 0) {
            prev = null;
            toDelete = this.head;
            next = toDelete.next;
        } else {
            let node = this.head;
            animation.push({method:this.moveHighlight,params:[null,node,],});
            for (let i = 0; i < index - 1; i++) {
                animation.push({method:this.moveHighlight,params:[node,node.next,],});
                node = node.next;
            }
            prev = node;
            toDelete = prev.next;
            next = toDelete.next;
        }
        let data = toDelete.data;
        animation.push({method:this.markNodeForDeletion,params:[prev,toDelete,],});
        animation.push({method:this.unmakeNode,params:[toDelete,],customEnd:true,});
        if (index < this.size - 1) {
            animation.push({method:this.shiftIntoNode,params:[next,],});
        }
        animation.push({method:this.skipTempNode,params:[prev,],});
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
        this.head = null;
        this.size = 0;
        this.nodes = [];
        this.tempNode = null;
        this.pinnedNode = null;
    }


    makeNode(index, data) {
        this.tempNode = new SinglyLinkedListNode({data: data, index: index, x:20,y:20,},);
    }

    setTempNodeBefore(next) {
        this.tempNode.next = next;
    }

    setTempNodePrev(prev) {
        if (prev) {
            prev.next = this.tempNode;
        } else {
            // this.head = this.tempNode;
        }
    }

    insertTempNode(index) {
        this.nodes.splice(index, 0, this.tempNode);
        if (index === 0) {
            this.head = this.tempNode;
        }
        this.tempNode.shift(...this.getNodePosition(index));
        this.tempNode = null;
    }

    moveHighlight(fromNode, toNode) {
        if (fromNode) {
            fromNode.unHighlight();
        }
        if (toNode) {
            toNode.highlight();
        }
    }

    markNodeForDeletion(highlighted, nodeToDelete) {
        if (highlighted) {
            highlighted.unHighlight();
        }
        nodeToDelete.markForDeletion();
    }

    unmakeNode(node) {
        this.tempNode = this.nodes.splice(node.index, 1)[0];
        this.tempNode.shift(20,20);
        this.tempNode.setOnStop(() => {
            this.doneAnimating();
        });
    }

    skipTempNode(prev) {
        if (prev) {
            prev.next = this.tempNode.next;
        }
        this.tempNode = null;
    }

    shiftForNode(node) {
        while (node) {
            this.shiftNode(node, 1);
            node = node.next;
        }
    }

    shiftIntoNode(node) {
        while (node) {
            this.shiftNode(node, -1);
            node = node.next;
        }
    }

    shiftNode(node, direction) {
        node.shift(...this.getNodePosition(node.index + direction), direction);
    }

    sizeIncr() {
        this.size++;
    }

    sizeDecr() {
        this.size--;
    }

    addAnimation(animation) {
        this.animationQueue.push({method:this.animator.emit,scope:this.animator,params:["anim-start",],});
        this.animationQueue.push(...animation);
        this.animationQueue.push({method:this.animator.emit,scope:this.animator,params:["anim-end",],});
    }

    doneAnimating() {
        this.animating = false;
    }

    getNodePosition(index) {
        let maxPerRow = Math.floor(this.width / SinglyLinkedList.ELEMENT_SIZE);
        let x = SinglyLinkedList.ELEMENT_SIZE * index;
        let y = 50 + Math.floor(index / maxPerRow) * 2 * SinglyLinkedList.ELEMENT_HEIGHT;
        x = (index % maxPerRow) * SinglyLinkedList.ELEMENT_SIZE;
        return [x + this.x,y + this.y];
    }

    getNodeAtPos(x,y) {
        let node = this.head;
        while (node) {
            if (node.containsPos(x,y)) {
                return node;
            }
            node = node.next;
        }
        if (this.tempNode && this.tempNode.containsPos(x,y)) {
            return this.tempNode;
        }
        return null;
    }

    pin(node) {
        this.pinnedNode = node;
        node.pin();
    }

    unpin() {
        if (this.pinnedNode.unpin()) {
            this.removeFromIndex(this.pinnedNode.index);
            this.pinnedNode.markBroken();
        }
        this.pinnedNode = null;
    }

    update(animationSpeed, p5) {
        this.width = p5.width - 2 * this.x;
        this.height = p5.height - 2 * this.y;
        let node = this.head;
        while (node) {
            if (node.update(animationSpeed, p5)) {
                node.highlightForDeletion();
            } else if (!node.toDelete) {
                node.unHighlight();
            }
            node = node.next;
        }
        if (this.tempNode) {
            if (this.tempNode.update(animationSpeed, p5)) {
                this.tempNode.highlightForDeletion();
            } else if (!this.tempNode.toDelete) {
                this.tempNode.unHighlight();
            }
        }
        if (!this.animating) {
            if (this.animationQueue.length > 0) {
                let animation = this.animationQueue.shift();
                this.animating = true;
                animation.method.apply(animation.scope || this, animation.params);
                if (!animation.customEnd) {
                    if (animationSpeed >= Math.floor(Visualizer.maxAnimationSpeed())) {
                        this.animating = false;
                    } else {
                        let time = 5000 / animationSpeed;
                        setTimeout(() => {
                            this.animating = false;
                        }, time);
                    }
                }
            }
        }
    }

    draw(p5) {
        // let maxPerRow = Math.floor(this.width / SinglyLinkedList.ELEMENT_SIZE);
        // let rows = Math.ceil(this.nodes.length / maxPerRow);

        p5.push();

        p5.textAlign(p5.CENTER,p5.CENTER);
        p5.textSize(this.ELEMENT_WIDTH/3 - 2);

        let node = this.head;
        while (node) {
            node.draw(p5);
            node = node.next;
        }
        if (this.tempNode) {
            this.tempNode.draw(p5);
        }

        p5.pop();
    }

    mousePressed(p5) {
        let pressedNode = this.getNodeAtPos(p5.mouseX, p5.mouseY);
        if (pressedNode) {
            this.pin(pressedNode);
        }
    }

    mouseReleased(p5) {
        if (this.pinnedNode) {
            this.unpin();
        }
    }

    windowResized(p5, height) {
        // let maxPerRow = Math.floor(this.width / SinglyLinkedList.ELEMENT_SIZE);
        // let rows = Math.ceil(this.nodes.length / maxPerRow);

        let width = p5.windowWidth;
        if ((this.getNodePosition(this.size-1)[1] + SinglyLinkedList.ELEMENT_HEIGHT) > (height - (2*this.y))) {
            height = (this.getNodePosition(this.size-1)[1] + SinglyLinkedList.ELEMENT_HEIGHT + (3*this.y))
            width -= 16;
            document.querySelector(".canvas-container").classList.add("overflow");
        } else {
            document.querySelector(".canvas-container").classList.remove("overflow");
        }

        p5.resizeCanvas(width, height);

        this.width = p5.width - 2 * this.x;
        this.height = p5.height - 2 * this.y;
        let node = this.head;
        while (node) {
            node.shift(...this.getNodePosition(node.index));
            node = node.next;
        }
    }
}


class SinglyLinkedListNode extends AttractedDraggableObject {
    constructor({data, index, x,y} = {}) {
        super(x,y);

        this.data = data;
        this.index = index;
        this.next = null;

        this.toDelete = false;
        this.handBroken = false;
        this.frozen = false;
        this.color = [0,0,0];
    }

    shift(x,y,direction = 0) {
        super.shift(x,y);
        this.index += Math.sign(direction);
    }

    containsPos(x,y) {
        return ((this.currentX <= x && x <= (this.currentX + SinglyLinkedList.ITEM_WIDTH)) && (this.currentY <= y && y <= (this.currentY + SinglyLinkedList.ELEMENT_HEIGHT)))
    }

    highlight() {
        this.color = [255,165,0];
    }

    unHighlight() {
        this.color = [0,0,0];
    }

    highlightForDeletion() {
        this.color[0] = 255;
    }

    markForDeletion() {
        this.toDelete = true;
        this.highlightForDeletion();
    }

    markBroken() {
        this.markForDeletion();
        this.frozen = true;
        this.handBroken = true;
    }

    unpin() {
        super.unpin();
        return this.displacement() > SinglyLinkedList.MAX_DIST_REMOVE;
    }

    update(animationSpeed, p5) {
        let dist = super.update(animationSpeed, p5);
        return this.pinnedToMouse && !this.handBroken && dist > SinglyLinkedList.MAX_DIST_REMOVE;
    }

    draw(p5) {
        // console.log(this);
        p5.push();
        p5.fill(255);
        p5.stroke(...this.color);
        p5.rect(this.currentX, this.currentY, SinglyLinkedList.ITEM_WIDTH, SinglyLinkedList.ELEMENT_HEIGHT);
        p5.line(this.currentX + SinglyLinkedList.ELEMENT_WIDTH, this.currentY, this.currentX + SinglyLinkedList.ELEMENT_WIDTH, this.currentY + SinglyLinkedList.ELEMENT_HEIGHT);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.fill(...this.color);
        p5.text(this.data.toString(), this.currentX,this.currentY, SinglyLinkedList.ELEMENT_WIDTH,SinglyLinkedList.ELEMENT_HEIGHT);
        if (this.next) {
            p5.stroke(0,0,255);
            p5.fill(0,0,255);
            p5.circle(this.currentX + SinglyLinkedList.ELEMENT_WIDTH + SinglyLinkedList.POINTER_WIDTH / 2, this.currentY + SinglyLinkedList.ELEMENT_HEIGHT / 2, 5);
            p5.line(this.currentX + SinglyLinkedList.ELEMENT_WIDTH + SinglyLinkedList.POINTER_WIDTH / 2, this.currentY + SinglyLinkedList.ELEMENT_HEIGHT / 2, this.next.currentX, this.next.currentY + SinglyLinkedList.ELEMENT_HEIGHT / 2)
            p5.rect(this.next.currentX - 3, this.next.currentY + SinglyLinkedList.ELEMENT_HEIGHT / 2 - 3, 6,6);
        } else {
            p5.line(this.currentX + SinglyLinkedList.ELEMENT_WIDTH, this.currentY, this.currentX + SinglyLinkedList.ITEM_WIDTH, this.currentY + SinglyLinkedList.ELEMENT_HEIGHT);
        }
        p5.pop();
    }
}
