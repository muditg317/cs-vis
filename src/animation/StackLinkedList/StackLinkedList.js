import { Visualization } from 'animation';
import AttractedDraggableObject from 'animation/AttractedDraggableObject';
import { Utils, Colors } from 'utils';

export default class StackLinkedList extends Visualization {
    static USE_CANVAS = true;
    static SET_BOUNDS = true;
    static CAN_DRAG = true;
    static SUPPORTS_NO_LOOP = true;
    static SUPPORTS_CUSTOM_END = true;
    static MAX_ANIM_TIME = 5000;
    static SUPPORTS_TEXT = true;
    static SUPPORTS_ANIMATION_CONTROL = true;

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
        super.reset();
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
        animation.push({method:this.makeNode,params:[data,],explanation:`Create value: ${data}`,isAnimationStep:true,});
        if (this.size > 0) {
            animation.push({method:this.setTempNodeBeforeHead,params:[],explanation:`Assign next pointer`,isAnimationStep:true,});
            animation.push({method:this.shiftHeadForNode,params:[],isAnimationStep:true,customUndoEnd:true,customRedoEnd:true,});
        }
        animation.push({method:this.insertTempNode,params:[],explanation:`Reset top pointer to new head`,isAnimationStep:true,});
        animation.push({method:this.shiftHead,params:[],isAnimationStep:true,customUndoEnd:true,customRedoEnd:true,});
        animation.push({method:this.sizeIncr,params:[],noAnim:true,});
        animation.push({method:this.showText,params:[`Successfully pushed ${data} to stack.`, Colors.GREEN],noAnim:true,});
        this.addAnimation(animation);
        this.endDrawLoop();
        this.stepForward();
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
        let data = this.head.data;
        animation.push({method:this.markHeadForDeletion,params:[],});
        animation.push({method:this.unmakeHead,params:[],customEnd:true,isAnimationStep:true,customUndoEnd:true,customRedoEnd:true,});
        if (this.size > 1) {
            animation.push({method:this.shiftIntoNode,params:[],isAnimationStep:true,customUndoEnd:true,customRedoEnd:true,});
        }
        animation.push({method:this.skipTempNode,params:[],isAnimationStep:true,undoData:[this.head.data,],});
        animation.push({method:this.sizeDecr,params:[],});
        animation.push({method:this.showText,params:[`Successfully popped ${data} from stack.`, Colors.GREEN],noAnim:true,});
        this.addAnimation(animation);
        this.endDrawLoop();
        this.stepForward();
        return data;
    }


    makeNode(data) {
        this.tempNode = new StackLinkedListNode({data: data, index: 0, x:20,y:20,});
    }
    undo_makeNode(data) {
        this.tempNode = null;
    }

    setTempNodeBeforeHead() {
        this.tempNode.next = this.head;
    }
    undo_setTempNodeBeforeHead() {
        this.tempNode.next = null;
    }

    insertTempNode() {
        this.nodes.splice(0, 0, this.tempNode);
        this.head = this.tempNode;
    }
    undo_insertTempNode() {
        this.head = this.tempNode.next;
        this.nodes.splice(0, 1);
    }

    shiftHead() {
        this.tempNode.shift(...this.getNodePosition(0));
        this.tempNode = null;
    }
    undo_shiftHead() {
        this.tempNode = this.nodes[0];
        this.tempNode.shift(20,20);
        this.tempNode.addOnStop(() => {
            this.stopDrawing();
        });
    }
    redo_shiftHead() {
        this.tempNode.shift(...this.getNodePosition(0));
        let temp = this.tempNode;
        temp.addOnStop(() => {
            this.stopDrawing();
        });
        this.tempNode = null;
    }

    markHeadForDeletion() {
        this.head.markForDeletion();
    }
    undo_markHeadForDeletion() {
        this.head.unhighlight();
    }

    unmakeHead() {
        this.tempNode = this.nodes.splice(0, 1)[0];
        this.tempNode.shift(20,20);
        this.tempNode.addOnStop(() => {
            this.doneAnimating(0);
        });
    }
    undo_unmakeHead() {
        this.tempNode.shift(...this.getNodePosition(0));
        this.nodes.splice(0, 0, this.tempNode);
        this.tempNode.addOnStop(() => {
            this.stopDrawing();
        });
        this.tempNode = null;
    }
    redo_unmakeHead() {
        this.tempNode = this.nodes.splice(0, 1)[0];
        this.tempNode.shift(20,20);
        this.tempNode.addOnStop(() => {
            this.stopDrawing();
        });
    }

    skipTempNode() {
        this.head = this.head.next;
        this.tempNode = null;
    }
    undo_skipTempNode(oldData) {
        this.tempNode = new StackLinkedListNode({data: oldData, index: 0, x:20,y:20,});
        this.tempNode.next = this.head;
        this.tempNode.markForDeletion();
        this.head = this.tempNode;
    }

    shiftHeadForNode() {
        let node = this.head;
        while (node) {
            this.shiftNode(node, 1);
            node = node.next;
        }
    }
    undo_shiftHeadForNode() {
        let node = this.head;
        while (node) {
            this.shiftNode(node, -1);
            if (!node.next) {
                node.addOnStop(() => {
                    this.stopDrawing();
                });
            }
            node = node.next;
        }
    }
    redo_shiftHeadForNode() {
        let node = this.head;
        while (node) {
            this.shiftNode(node, 1);
            if (!node.next) {
                node.addOnStop(() => {
                    this.stopDrawing();
                });
            }
            node = node.next;
        }
    }

    shiftIntoNode() {
        let node = this.head.next;
        while (node) {
            this.shiftNode(node, -1);
            node = node.next;
        }
    }
    undo_shiftIntoNode() {
        let node = this.head.next;
        while (node) {
            this.shiftNode(node, 1);
            if (!node.next) {
                node.addOnStop(() => {
                    this.stopDrawing();
                });
            }
            node = node.next;
        }
    }
    redo_shiftIntoNode() {
        let node = this.head.next;
        while (node) {
            this.shiftNode(node, -1);
            if (!node.next) {
                node.addOnStop(() => {
                    this.stopDrawing();
                });
            }
            node = node.next;
        }
    }

    shiftNode(node, direction) {
        node.shift(...this.getNodePosition(node.index + direction), direction);
    }
    undo_shiftNode(node, direction) {
        // console.log("undo_shiftNode");
        this.shiftNode(node, -direction);
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
        this.pinnedNode.unpin();
        this.pinnedNode = null;
    }

    updateNode(node, animationSpeed, p5) {
        node.update(animationSpeed, p5);
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
        // this.drawingBeforeMouseDown = this.drawing;
        let pressedNode = this.getNodeAtPos(p5.mouseX, p5.mouseY);
        if (pressedNode) {
            this.animator.loop();
            this.pin(pressedNode, p5.mouseX,p5.mouseY);
        }
        return false;
    }

    mouseReleased(p5) {
        if (this.pinnedNode) {
            this.pinnedNode.addOnStop(() => {
                if (!this.drawing) {
                    this.stopDrawing();
                }
            });
            this.unpin();
        } else {
            // if (!this.drawing) {
            //     this.stopDrawing();
            // }
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

    unhighlight() {
        this.color = [0,0,0];
    }

    highlightForDeletion() {
        this.color[0] = 255;
    }

    markForDeletion() {
        this.toDelete = true;
        this.highlightForDeletion();
    }

    draw(p5) {
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
