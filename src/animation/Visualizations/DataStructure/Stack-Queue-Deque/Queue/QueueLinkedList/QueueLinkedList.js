import { Visualization } from 'animation';
import { AttractedDraggableObject } from 'animation';
import { Utils, Colors } from 'utils';

export default class QueueLinkedList extends Visualization {
    static USE_CANVAS = true;
    static SET_BOUNDS = true;
    static CAN_DRAG = true;
    static SUPPORTS_NO_LOOP = true;
    static SUPPORTS_CUSTOM_END = true;
    static MAX_ANIM_TIME = 5000;
    static SUPPORTS_TEXT = true;
    static SUPPORTS_ANIMATION_CONTROL = true;
    static SUPPORTS_STOP_ID = true;

    static ELEMENT_HEIGHT = 35;
    static ELEMENT_WIDTH = 50;
    static POINTER_WIDTH = 15;
    static ITEM_WIDTH = QueueLinkedList.ELEMENT_WIDTH + QueueLinkedList.POINTER_WIDTH;
    static SPACING = 50;
    static ELEMENT_SIZE = QueueLinkedList.ITEM_WIDTH + QueueLinkedList.SPACING;

    static HEAD_TAIL_SIZE = 35;
    static HEAD_TAIL_X = 130;


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
        this.tail = null;
        this.size = 0;
        this.nodes = [];
        this.tempNode = null;
        this.pinnedNode = null;

        this.resizing = false;
        if (this.made) {
            this.endDrawLoop();
        }
    }

    ensureDrawn(skipDraw = false) {
        this.beginDrawLoop();
        let maxNode = this.tempNode || this.head;
        let curr = this.head;
        while (curr) {
            if (curr.displacement() > maxNode.displacement()) {
                maxNode = curr;
            }
            curr = curr.next;
        }
        if (maxNode && maxNode.displacement() > 0) {
            let stopID = ++this.stopID;
            maxNode.addOnStop(() => {
                this.stopDrawing(stopID);
            });
            if (skipDraw) {
                let curr = this.head;
                while (curr) {
                    curr.stop();
                    curr = curr.next;
                }
                if (this.tempNode) {
                    this.tempNode.stop();
                }
            }
        } else {
            this.stopDrawing(++this.stopID);
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
        animation.push({method:this.makeNode,params:[data,],explanation:`Create value: ${data}`,isAnimationStep:true,returnsRedoData:true});
        if (this.size > 0) {
            animation.push({method:this.setTempNodeAfterTail,explanation:`Assign next pointer`,isAnimationStep:true,});
        }
        animation.push({method:this.insertTempNode,explanation:`Reset tail pointer`,isAnimationStep:true,returnsUndoData:true,});
        animation.push({method:this.shiftTail,customEnd:true,isBackStep:true,customUndoEnd:true,customRedoEnd:true,});
        animation.push({method:this.sizeIncr,noAnim:true,});
        animation.push({method:this.showText,params:[`Successfully enqueued ${data} to queue.`, Colors.GREEN],noAnim:true,});
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
            this.updateText("Cannot dequeue empty Queue", Colors.RED);
            return false;
        }
        let animation = [];
        let data = this.head.data;
        animation.push({method:this.markHeadForDeletion,noAnim:true,});
        animation.push({method:this.unmakeHead,explanation:`Extract data`,customEnd:true,isAnimationStep:true,customUndoEnd:true,customRedoEnd:true,});
        if (this.size > 1) {
            animation.push({method:this.shiftIntoNode,isAnimationStep:true,customUndoEnd:true,customRedoEnd:true,});
        }
        animation.push({method:this.skipTempNode,explanation:`Reset head pointer to new head`,isAnimationStep:true,returnsUndoData:true,});
        animation.push({method:this.sizeDecr,noAnim:true,});
        animation.push({method:this.showText,params:[`Successfully dequeued ${data} from queue.`, Colors.GREEN],noAnim:true,});
        this.addAnimation(animation);
        this.endDrawLoop();
        this.stepForward();
        return data;
    }


    makeNode(data) {
        this.tempNode = new QueueLinkedListNode({data: data, index: this.size, x:20,y:20,});
        return [this.tempNode];
    }
    undo_makeNode(data) {
        this.tempNode = null;
    }
    redo_makeNode(newTemp) {
        this.tempNode = newTemp;
    }

    setTempNodeAfterTail() {
        this.tail.next = this.tempNode;
    }
    undo_setTempNodeAfterTail() {
        this.tail.next = null;
    }

    insertTempNode() {
        let oldTail = this.tail;
        this.nodes.splice(this.size, 0, this.tempNode);
        this.tail = this.tempNode;
        if (!oldTail) {
            this.head = this.tempNode;
        }
        return [oldTail];
    }
    undo_insertTempNode(oldTail) {
        this.tail = oldTail;
        if (!oldTail) {
            this.head = null;
        }
        this.nodes.splice(this.size, 1);
    }

    shiftTail() {
        this.tempNode.shift(...this.getNodePosition(this.size));
        this.tempNode.addOnStop((element) => {
            this.doneAnimating(0);
        });
        this.tempNode = null;
    }
    undo_shiftTail() {
        this.tempNode = this.tail;
        this.tempNode.shift(20,20);
        let stopID = ++this.stopID;
        this.tempNode.addOnStop(() => {
            this.stopDrawing(stopID);
        });
    }
    redo_shiftTail() {
        this.tempNode.shift(...this.getNodePosition(this.size));
        let stopID = ++this.stopID;
        this.tempNode.addOnStop(() => {
            this.stopDrawing(stopID);
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
        let stopID = ++this.stopID;
        this.tempNode.addOnStop(() => {
            this.stopDrawing(stopID);
        });
        this.tempNode = null;
    }
    redo_unmakeHead() {
        this.tempNode = this.nodes.splice(0, 1)[0];
        this.tempNode.shift(20,20);
        let stopID = ++this.stopID;
        this.tempNode.addOnStop(() => {
            this.stopDrawing(stopID);
        });
    }

    skipTempNode() {
        let oldTemp = this.tempNode;
        this.head = this.head.next;
        this.tempNode = null;
        return [oldTemp]
    }
    undo_skipTempNode(oldTemp) {
        this.tempNode = oldTemp;
        this.tempNode.next = this.head;
        this.tempNode.markForDeletion();
        this.head = this.tempNode;
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
                let stopID = ++this.stopID;
                node.addOnStop(() => {
                    this.stopDrawing(stopID);
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
                let stopID = ++this.stopID;
                node.addOnStop(() => {
                    this.stopDrawing(stopID);
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
        let maxPerRow = Math.max(1, Math.floor(this.width / QueueLinkedList.ELEMENT_SIZE));
        let x = QueueLinkedList.ELEMENT_SIZE * index;
        let y = 75 + Math.floor(index / maxPerRow) * 2 * QueueLinkedList.ELEMENT_HEIGHT;
        x = (index % maxPerRow) * QueueLinkedList.ELEMENT_SIZE;
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

    getTailY() {
        return this.getNodePosition(this.size-1)[1] + QueueLinkedList.ELEMENT_HEIGHT + QueueLinkedList.HEAD_TAIL_SIZE;
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
        // console.log("draw");
        super.draw(p5);
        p5.push();

        p5.textAlign(p5.CENTER,p5.CENTER);
        p5.textSize(this.ELEMENT_WIDTH/3 - 2);

        p5.noFill();
        p5.stroke(0);
        p5.textAlign(p5.CENTER, p5.CENTER);
        let headY = 20;
        p5.text("Head:",95-5,headY,QueueLinkedList.HEAD_TAIL_SIZE + 10,QueueLinkedList.HEAD_TAIL_SIZE);
        p5.square(QueueLinkedList.HEAD_TAIL_X,headY,QueueLinkedList.HEAD_TAIL_SIZE);
        if (this.head) {
            p5.stroke(Colors.BLUE);
            p5.fill(Colors.BLUE);
            p5.circle(QueueLinkedList.HEAD_TAIL_X + QueueLinkedList.HEAD_TAIL_SIZE / 2, headY + QueueLinkedList.HEAD_TAIL_SIZE / 2, 5);
            p5.line(QueueLinkedList.HEAD_TAIL_X + QueueLinkedList.HEAD_TAIL_SIZE / 2, headY + QueueLinkedList.HEAD_TAIL_SIZE / 2, this.head.currentX + QueueLinkedList.ITEM_WIDTH / 2, this.head.currentY);
            p5.rect(this.head.currentX + QueueLinkedList.ITEM_WIDTH / 2 - 3, this.head.currentY - 3, 6,6);
        } else {
            p5.line(QueueLinkedList.HEAD_TAIL_X,headY,QueueLinkedList.HEAD_TAIL_X + QueueLinkedList.HEAD_TAIL_SIZE,headY + QueueLinkedList.HEAD_TAIL_SIZE);
        }
        p5.noFill();
        p5.stroke(0);
        let tailY = this.getTailY();
        p5.text("Tail:",95,tailY,QueueLinkedList.HEAD_TAIL_SIZE,QueueLinkedList.HEAD_TAIL_SIZE);
        p5.square(QueueLinkedList.HEAD_TAIL_X,tailY,QueueLinkedList.HEAD_TAIL_SIZE);
        if (this.tail) {
            p5.stroke(Colors.BLUE);
            p5.fill(Colors.BLUE);
            p5.circle(QueueLinkedList.HEAD_TAIL_X + QueueLinkedList.HEAD_TAIL_SIZE / 2, tailY + QueueLinkedList.HEAD_TAIL_SIZE / 2, 5);
            p5.line(QueueLinkedList.HEAD_TAIL_X + QueueLinkedList.HEAD_TAIL_SIZE / 2, tailY + QueueLinkedList.HEAD_TAIL_SIZE / 2, this.tail.currentX + QueueLinkedList.ITEM_WIDTH / 2, this.tail.currentY + QueueLinkedList.ELEMENT_HEIGHT);
            p5.rect(this.tail.currentX + QueueLinkedList.ITEM_WIDTH / 2 - 3, this.tail.currentY + QueueLinkedList.ELEMENT_HEIGHT - 3, 6,6);
        } else {
            p5.line(QueueLinkedList.HEAD_TAIL_X,tailY,QueueLinkedList.HEAD_TAIL_X + QueueLinkedList.HEAD_TAIL_SIZE,tailY + QueueLinkedList.HEAD_TAIL_SIZE);
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
                this.ensureDrawn();
            });
            this.unpin();
        } else {
            // this.ensureDrawn();
        }
        return false;
    }

    windowResized(p5, height, numScrollbars) {
        super.windowResized(p5, height, numScrollbars, this.getTailY() + QueueLinkedList.HEAD_TAIL_SIZE + 20,() => {
            let shiftTemp = this.tempNode && this.tempNode.desiredX === 20 && this.tempNode.desiredY === 20;
            let node = this.head;
            while (node) {
                node.shift(...this.getNodePosition(node.index));
                node = node.next;
            }
            if (shiftTemp) {
                this.tempNode.shift(20,20);
            }
        });
    }
}


class QueueLinkedListNode extends AttractedDraggableObject {
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
        return ((this.currentX <= x && x <= (this.currentX + QueueLinkedList.ITEM_WIDTH)) && (this.currentY <= y && y <= (this.currentY + QueueLinkedList.ELEMENT_HEIGHT)))
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
        p5.rect(this.currentX, this.currentY, QueueLinkedList.ITEM_WIDTH, QueueLinkedList.ELEMENT_HEIGHT);
        p5.line(this.currentX + QueueLinkedList.ELEMENT_WIDTH, this.currentY, this.currentX + QueueLinkedList.ELEMENT_WIDTH, this.currentY + QueueLinkedList.ELEMENT_HEIGHT);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.fill(...this.color);
        p5.text(this.data.toString(), this.currentX,this.currentY, QueueLinkedList.ELEMENT_WIDTH,QueueLinkedList.ELEMENT_HEIGHT);
        if (this.next) {
            p5.stroke(...Utils.addArray(this.color, [0,0,255]));
            p5.fill(...Utils.addArray(this.color, [0,0,255]));
            p5.circle(this.currentX + QueueLinkedList.ELEMENT_WIDTH + QueueLinkedList.POINTER_WIDTH / 2, this.currentY + QueueLinkedList.ELEMENT_HEIGHT / 2, 5);
            p5.line(this.currentX + QueueLinkedList.ELEMENT_WIDTH + QueueLinkedList.POINTER_WIDTH / 2, this.currentY + QueueLinkedList.ELEMENT_HEIGHT / 2, this.next.currentX, this.next.currentY + QueueLinkedList.ELEMENT_HEIGHT / 2);
            p5.rect(this.next.currentX - 3, this.next.currentY + QueueLinkedList.ELEMENT_HEIGHT / 2 - 3, 6,6);
        } else {
            p5.line(this.currentX + QueueLinkedList.ELEMENT_WIDTH, this.currentY, this.currentX + QueueLinkedList.ITEM_WIDTH, this.currentY + QueueLinkedList.ELEMENT_HEIGHT);
        }
        p5.pop();
    }
}
