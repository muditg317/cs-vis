import { Visualization } from 'animation';
import AttractedDraggableObject from 'animation/AttractedDraggableObject';
import { Utils, Colors } from 'utils';

export default class StackLinkedList extends Visualization {
    static USE_CANVAS = true;
    static SET_BOUNDS = true;
    static SUPPORTS_NO_LOOP = true;
    static SUPPORTS_CUSTOM_END = true;
    static MAX_ANIM_TIME = 5000;
    static SUPPORTS_TEXT = true;
    // static SUPPORTS_ANIMATION_CONTROL = true;

    static ELEMENT_HEIGHT = 35;
    static ELEMENT_WIDTH = 50;
    static POINTER_WIDTH = 15;
    static ITEM_WIDTH = StackLinkedList.ELEMENT_WIDTH + StackLinkedList.POINTER_WIDTH;
    static SPACING = 50;
    static ELEMENT_SIZE = StackLinkedList.ITEM_WIDTH + StackLinkedList.SPACING;

    static MAX_DIST_REMOVE = 300;

    constructor(animator) {
        super(animator);

        this.reset();
        this.made = true;
    }

    reset() {
        if (this.made) {
            this.beginDrawLoop();
        }
        this.head = null;
        this.size = 0;
        this.nodes = [];
        this.tempNode = null;
        this.pinnedNode = null;

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
        animation.push({method:this.makeNode,params:[data,],explanation:`Create value: ${data}`,});
        animation.push({method:this.setTempNodeBefore,params:[this.head,],explanation:`Assign next pointer`,});
        if (this.size > 0) {
            animation.push({method:this.shiftForNode,params:[this.head,],});
        }
        animation.push({method:this.insertTempNode,params:[],explanation:`Reset top pointer to new head`,});
        animation.push({method:this.shiftHead,params:[],});
        animation.push({method:this.sizeIncr,params:[],noAnim:true,});
        this.addAnimation(animation);
        this.updateText(`Successfully pushed ${data} to stack.`, Colors.GREEN);
        this.endDrawLoop();
        return true;
    }


    pop() {
        if (this.animating) {
            console.log("animation in progress");
            return false;
        }
        this.beginDrawLoop();
        let index = 0;
        if (this.size === 0) {
            this.updateText("Cannot pop empty Stack", Colors.RED);
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
        this.updateText(`Successfully popped ${data} from stack.`, Colors.GREEN);
        this.endDrawLoop();
        return data;
    }


    makeNode(data) {
        this.tempNode = new StackLinkedListNode({data: data, index: 0, x:20,y:20,},);
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

    insertTempNode() {
        this.nodes.splice(0, 0, this.tempNode);
        this.head = this.tempNode;
    }

    shiftHead() {
        this.tempNode.shift(...this.getNodePosition(0));
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
        this.tempNode.addOnStop(() => {
            this.doneAnimating(0);
        });
    }

    skipTempNode(prev) {
        if (prev) {
            prev.next = this.tempNode.next;
        } else {
            this.head = this.head.next;
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

    getNodePosition(index) {
        let maxPerRow = Math.max(1, Math.floor(this.width / StackLinkedList.ELEMENT_SIZE));
        let x = StackLinkedList.ELEMENT_SIZE * index;
        let y = 75 + Math.floor(index / maxPerRow) * 2 * StackLinkedList.ELEMENT_HEIGHT;
        x = (index % maxPerRow) * StackLinkedList.ELEMENT_SIZE;
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

    pin(node, x,y) {
        this.pinnedNode = node;
        node.pin(x,y);
    }

    unpin() {
        if (this.pinnedNode.unpin()) {
            this.removeFromIndex(this.pinnedNode.index);
            this.pinnedNode.markBroken();
        }
        this.pinnedNode = null;
    }

    updateNode(node, animationSpeed, p5) {
        let update = node.update(animationSpeed, p5);
        if (this.animationQueue.length === 0) {
            if (update) {
                node.highlightForDeletion();
            } else if (node.pinnedToMouse && !node.toDelete) {
                node.unHighlight();
            }
        }
    }

    update(animationSpeed, p5) {
        super.update(() => {
            let node = this.head;
            while (node) {
                this.updateNode(node, animationSpeed, p5);
                node = node.next;
            }
            if (this.tempNode) {
                this.updateNode(this.tempNode, animationSpeed, p5);
            }
        }, animationSpeed, p5);
    }

    draw(p5) {
        super.draw(p5);
        p5.push();

        p5.textAlign(p5.CENTER,p5.CENTER);
        p5.textSize(this.ELEMENT_WIDTH/3 - 2);

        // p5.noFill();
        p5.stroke(0);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.text("Top:",95,20,35,35);
        p5.square(130,20,35);
        if (this.head) {
            p5.stroke(Colors.BLUE);
            p5.fill(Colors.BLUE);
            p5.circle(130 + 35 / 2, 20 + 35 / 2, 5);
            p5.line(130 + 35 / 2, 20 + 35 / 2, this.head.currentX + StackLinkedList.ITEM_WIDTH / 2, this.head.currentY);
            p5.rect(this.head.currentX + StackLinkedList.ITEM_WIDTH / 2 - 3, this.head.currentY - 3, 6,6);
        } else {
            p5.line(130,20,165,55);
        }

        let node = this.head;
        while (node) {
            node.draw(p5, node.next === this.head);
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
            this.pin(pressedNode, p5.mouseX,p5.mouseY);
        }
        return false;
    }

    mouseReleased(p5) {
        if (this.pinnedNode) {
            this.unpin();
        }
        return false;
    }

    windowResized(p5, height) {
        super.windowResized(p5, height, this.getNodePosition(this.size-1)[1] + StackLinkedList.ELEMENT_HEIGHT);

        let node = this.head;
        while (node) {
            node.shift(...this.getNodePosition(node.index));
            node = node.next;
        }
    }
}


class StackLinkedListNode extends AttractedDraggableObject {
    static CAN_DRAG = true;

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
        return ((this.currentX <= x && x <= (this.currentX + StackLinkedList.ITEM_WIDTH)) && (this.currentY <= y && y <= (this.currentY + StackLinkedList.ELEMENT_HEIGHT)))
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
        return this.displacement() > StackLinkedList.MAX_DIST_REMOVE;
    }

    update(animationSpeed, p5) {
        let dist = super.update(animationSpeed, p5);
        return this.pinnedToMouse && !this.handBroken && dist > StackLinkedList.MAX_DIST_REMOVE;
    }

    draw(p5) {
        // console.log(this);
        p5.push();
        p5.fill(255);
        p5.stroke(...this.color);
        p5.rect(this.currentX, this.currentY, StackLinkedList.ITEM_WIDTH, StackLinkedList.ELEMENT_HEIGHT);
        p5.line(this.currentX + StackLinkedList.ELEMENT_WIDTH, this.currentY, this.currentX + StackLinkedList.ELEMENT_WIDTH, this.currentY + StackLinkedList.ELEMENT_HEIGHT);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.fill(...this.color);
        p5.text(this.data.toString(), this.currentX,this.currentY, StackLinkedList.ELEMENT_WIDTH,StackLinkedList.ELEMENT_HEIGHT);
        if (this.next) {
            p5.stroke(...Utils.addArray(this.color, [0,0,255]));
            p5.fill(...Utils.addArray(this.color, [0,0,255]));
            p5.circle(this.currentX + StackLinkedList.ELEMENT_WIDTH + StackLinkedList.POINTER_WIDTH / 2, this.currentY + StackLinkedList.ELEMENT_HEIGHT / 2, 5);
            p5.line(this.currentX + StackLinkedList.ELEMENT_WIDTH + StackLinkedList.POINTER_WIDTH / 2, this.currentY + StackLinkedList.ELEMENT_HEIGHT / 2, this.next.currentX, this.next.currentY + StackLinkedList.ELEMENT_HEIGHT / 2);
            p5.rect(this.next.currentX - 3, this.next.currentY + StackLinkedList.ELEMENT_HEIGHT / 2 - 3, 6,6);
        } else {
            p5.line(this.currentX + StackLinkedList.ELEMENT_WIDTH, this.currentY, this.currentX + StackLinkedList.ITEM_WIDTH, this.currentY + StackLinkedList.ELEMENT_HEIGHT);
        }
        p5.pop();
    }
}
