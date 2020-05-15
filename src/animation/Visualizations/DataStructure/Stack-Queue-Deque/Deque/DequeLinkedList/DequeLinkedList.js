import { Visualization } from 'animation';
import { AttractedDraggableObject } from 'animation';
import { Utils, Colors } from 'utils';

export default class DequeLinkedList extends Visualization {
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
    static ITEM_WIDTH = DequeLinkedList.ELEMENT_WIDTH + 2 * DequeLinkedList.POINTER_WIDTH;
    static SPACING = 50;
    static ELEMENT_SIZE = DequeLinkedList.ITEM_WIDTH + DequeLinkedList.SPACING;

    static HEAD_TAIL_SIZE = 35;
    static HEAD_TAIL_X = 130;


    reset() {
        super.reset(() => {
            this.head = null;
            this.tail = null;
            this.size = 0;
            this.nodes = [];
            this.tempNode = null;
            this.pinnedNode = null;

            this.resizing = false;
        });
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
            let stopID = ++this.stopID;
            this.stopDrawing(stopID);
        }
    }


    add(data,front) {
        if (this.animationQueue.length !== 0) {
            return false;
        }
        this.beginDrawLoop();
        if (data === null) {
            this.updateText("Cannot add null to Deque.", Colors.RED);
            return false;
        }
        let animation = [];
        animation.push({method:this.makeNode,params:[data,front],explanation:`Create value: ${data}`,isAnimationStep:true,returnsRedoData:true,});
        if (this.size > 0) {
            if (front) {
                animation.push({method:this.setTempNodeBeforeHead,explanation:`Assign next pointer`,isAnimationStep:true,});
                animation.push({method:this.setHeadAfterTempNode,explanation:`Assign prev pointer`,isAnimationStep:true,});
                animation.push({method:this.shiftHeadForNode,customEnd:true,isAnimationStep:true,customUndoEnd:true,customRedoEnd:true,});
            } else {
                animation.push({method:this.setTempNodeAfterTail,explanation:`Assign next pointer`,isAnimationStep:true,});
                animation.push({method:this.setTailBeforeTempNode,explanation:`Assign prev pointer`,isAnimationStep:true,});
            }
        }
        animation.push({method:this.insertTempNode,params:[front],explanation:`Reset ${front ? "head" : "tail"} pointer`,quick:true,isAnimationStep:true,returnsUndoData:true,});
        if (front) {
            animation.push({method:this.shiftNewHead,isAnimationStep:true,customUndoEnd:true,customRedoEnd:true,});
        } else {
            animation.push({method:this.shiftNewTail,customEnd:true,isBackStep:true,customUndoEnd:true,customRedoEnd:true,});
        }
        animation.push({method:this.sizeIncr,noAnim:true,});
        animation.push({method:this.showText,params:[`Successfully added ${data} to ${front ? "front" : "back"} of deque.`, Colors.GREEN],noAnim:true,});
        this.addAnimation(animation);
        this.endDrawLoop();
        this.stepForward();
        return true;
    }

    addFirst(data) {
        return this.add(data,true);
    }

    addLast(data) {
        return this.add(data,false);
    }

    remove(front) {
        if (this.animationQueue.length !== 0) {
            return false;
        }
        this.beginDrawLoop();
        if (this.size === 0) {
            this.updateText("Cannot dedeque empty Deque", Colors.RED);
            return false;
        }
        let animation = [];
        let data = (front ? this.head : this.tail).data;
        animation.push({method:this.markNodeForDeletion,params:[front],quick:true,});
        animation.push({method:this.unmakeNode,params:[front],explanation:`Extract data`,customEnd:true,isForwardStep:true,customUndoEnd:true,customRedoEnd:true,});
        if (front && this.size > 1) {
            animation.push({method:this.shiftIntoNode,customEnd:true,isAnimationStep:true,customUndoEnd:true,customRedoEnd:true,});
        }
        animation.push({method:this.skipTempNode,params:[front],explanation:`Reset ${front ? "head" : "tail"} pointer`,quick:true,isBackStep:true,returnsUndoData:true,});
        animation.push({method:this.sizeDecr,noAnim:true,});
        animation.push({method:this.showText,params:[`Successfully removed ${data} from ${front ? "front of " : "back of"} deque.`, Colors.GREEN],noAnim:true,});
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

    makeNode(data,front) {
        this.tempNode = new DequeLinkedListNode({data: data, index: front ? 0 : this.size, x:20,y:20,});
        return [this.tempNode];
    }
    undo_makeNode(data) {
        this.tempNode = null;
    }
    redo_makeNode(newTemp) {
        if (typeof newTemp !== "object") {
            return this.makeNode(...arguments);
        }
        this.tempNode = newTemp;
    }

    setTempNodeBeforeHead() {
        this.tempNode.next = this.head;
    }
    undo_setTempNodeBeforeHead() {
        this.tempNode.next = null;
    }

    setHeadAfterTempNode() {
        this.head.prev = this.tempNode;
    }
    undo_setHeadAfterTempNode() {
        this.head.prev = null;
    }

    setTempNodeAfterTail() {
        this.tail.next = this.tempNode;
    }
    undo_setTempNodeAfterTail() {
        this.tail.next = null;
    }

    setTailBeforeTempNode() {
        this.tempNode.prev = this.tail;
    }
    undo_setTailBeforeTempNode() {
        this.tempNode.prev = null;
    }

    insertTempNode(atHead) {
        let oldTail = this.tail;
        if (atHead) {
            this.nodes.splice(0, 0, this.tempNode);
            if (!oldTail) {
                this.tail = this.tempNode;
            }
            this.head = this.tempNode;
        } else {
            this.nodes.splice(this.size, 0, this.tempNode);
            this.tail = this.tempNode;
            if (!oldTail) {
                this.head = this.tempNode;
            }
        }
        return [atHead, oldTail];
    }
    undo_insertTempNode(atHead, oldTail) {
        if (atHead) {
            this.head = this.tempNode.next;
            this.nodes.splice(0, 1);
        } else {
            this.tail = oldTail;
            if (!oldTail) {
                this.head = null;
            }
            this.nodes.splice(this.size, 1);
        }
    }

    shiftNewHead() {
        this.tempNode.shift(...this.getNodePosition(0));
        this.tempNode = null;
    }
    undo_shiftNewHead() {
        this.tempNode = this.nodes[0];
        this.tempNode.shift(20,20);
        let stopID = ++this.stopID;
        this.tempNode.addOnStop(() => {
            this.stopDrawing(stopID);
        });
    }
    redo_shiftNewHead() {
        this.tempNode.shift(...this.getNodePosition(0));
        let temp = this.tempNode;
        let stopID = ++this.stopID;
        temp.addOnStop(() => {
            this.stopDrawing(stopID);
        });
        this.tempNode = null;
    }

    shiftNewTail() {
        this.tempNode.shift(...this.getNodePosition(this.size));
        this.tempNode.addOnStop((element) => {
            this.doneAnimating(0);
        });
        this.tempNode = null;
    }
    undo_shiftNewTail() {
        this.tempNode = this.tail;
        this.tempNode.shift(20,20);
        let stopID = ++this.stopID;
        this.tempNode.addOnStop(() => {
            this.stopDrawing(stopID);
        });
    }
    redo_shiftNewTail() {
        this.tempNode.shift(...this.getNodePosition(this.size));
        let stopID = ++this.stopID;
        this.tempNode.addOnStop(() => {
            this.stopDrawing(stopID);
        });
        this.tempNode = null;
    }

    markNodeForDeletion(front) {
        (front ? this.head : this.tail).markForDeletion();
    }
    undo_markNodeForDeletion(front) {
        (front ? this.head : this.tail).unhighlight();
    }

    unmakeNode(front) {
        this.tempNode = this.nodes.splice(front ? 0 : (this.size - 1), 1)[0];
        this.tempNode.shift(20,20);
        this.tempNode.addOnStop(() => {
            this.doneAnimating(0);
        });
    }
    undo_unmakeNode(front) {
        this.tempNode.shift(...this.getNodePosition(front ? 0 : (this.size - 1)));
        this.nodes.splice(front ? 0 : (this.size - 1), 0, this.tempNode);
        let stopID = ++this.stopID;
        this.tempNode.addOnStop(() => {
            this.stopDrawing(stopID);
        });
        this.tempNode = null;
    }
    redo_unmakeNode(front) {
        this.tempNode = this.nodes.splice(front ? 0 : (this.size - 1), 1)[0];
        this.tempNode.shift(20,20);
        let stopID = ++this.stopID;
        this.tempNode.addOnStop(() => {
            this.stopDrawing(stopID);
        });
    }

    skipTempNode(front) {
        let oldTemp = this.tempNode;
        if (front) {
            this.head = this.head.next;
            if (this.head) {
                this.head.prev = null;
            }
        } else {
            this.tail = this.tail.prev;
            if (this.tail) {
                this.tail.next = null;
            }
        }
        if (!this.head || !this.tail) {
            this.head = this.tail = null;
        }
        this.tempNode = null;
        return [front,oldTemp, this.head === null || this.tail === null];
    }
    undo_skipTempNode(front,oldTemp, noData) {
        this.tempNode = oldTemp;
        if (front) {
            this.tempNode.next = this.head;
            if (this.head) {
                this.head.prev = this.tempNode;
            }
            this.head = this.tempNode;
        } else {
            this.tempNode.prev = this.tail;
            if (this.tail) {
                this.tail.next = this.tempNode;
            }
            this.tail = this.tempNode;
        }
        if (noData) {
            this.head = this.tail = this.tempNode;
        }
        this.tempNode.markForDeletion();
    }

    shiftHeadForNode() {
        let node = this.head;
        let furthest = node;
        while (node) {
            this.shiftNode(node, 1);
            if (node.displacement() > furthest.displacement()) {
                furthest = node;
            }
            node = node.next;
        }
        if (furthest) {
            furthest.addOnStop(() => {
                this.doneAnimating(0);
            });
        }
    }
    undo_shiftHeadForNode() {
        let node = this.head;
        let furthest = node;
        while (node) {
            this.shiftNode(node, -1);
            if (node.displacement() > furthest.displacement()) {
                furthest = node;
            }
            node = node.next;
        }
        if (furthest) {
            let stopID = ++this.stopID;
            furthest.addOnStop(() => {
                this.stopDrawing(stopID);
            });
        }
    }
    redo_shiftHeadForNode() {
        let node = this.head;
        let furthest = node;
        while (node) {
            this.shiftNode(node, 1);
            if (node.displacement() > furthest.displacement()) {
                furthest = node;
            }
            node = node.next;
        }
        if (furthest) {
            let stopID = ++this.stopID;
            furthest.addOnStop(() => {
                this.stopDrawing(stopID);
            });
        }
    }

    shiftIntoNode() {
        let node = this.head.next;
        let furthest = node;
        while (node) {
            this.shiftNode(node, -1);
            if (node.displacement() > furthest.displacement()) {
                furthest = node;
            }
            node = node.next;
        }
        if (furthest) {
            furthest.addOnStop((element) => {
                this.doneAnimating(0);
            });
        }
    }
    undo_shiftIntoNode() {
        let node = this.head.next;
        let furthest = node;
        while (node) {
            this.shiftNode(node, 1);
            if (node.displacement() > furthest.displacement()) {
                furthest = node;
            }
            node = node.next;
        }
        if (furthest) {
            let stopID = ++this.stopID;
            furthest.addOnStop(() => {
                this.stopDrawing(stopID);
            });
        }
    }
    redo_shiftIntoNode() {
        let node = this.head.next;
        let furthest = node;
        while (node) {
            this.shiftNode(node, -1);
            if (node.displacement() > furthest.displacement()) {
                furthest = node;
            }
            node = node.next;
        }
        if (furthest) {
            let stopID = ++this.stopID;
            furthest.addOnStop(() => {
                this.stopDrawing(stopID);
            });
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
        let maxPerRow = Math.max(1, Math.floor(this.width / DequeLinkedList.ELEMENT_SIZE));
        let x = DequeLinkedList.ELEMENT_SIZE * index;
        let y = 75 + Math.floor(index / maxPerRow) * 2 * DequeLinkedList.ELEMENT_HEIGHT;
        x = (index % maxPerRow) * DequeLinkedList.ELEMENT_SIZE;
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
        return this.getNodePosition(this.size)[1] + DequeLinkedList.ELEMENT_HEIGHT + DequeLinkedList.HEAD_TAIL_SIZE;
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
        super.update(animationSpeed, p5, () => {
            let node = this.head;
            while (node) {
                this.updateNode(node, animationSpeed, p5);
                node = node.next;
            }
            if (this.tempNode) {
                this.updateNode(this.tempNode, animationSpeed, p5);
            }
        });
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
        p5.text("Head:",95-5,headY,DequeLinkedList.HEAD_TAIL_SIZE + 10,DequeLinkedList.HEAD_TAIL_SIZE);
        p5.square(DequeLinkedList.HEAD_TAIL_X,headY,DequeLinkedList.HEAD_TAIL_SIZE);
        if (this.head) {
            p5.stroke(Colors.BLUE);
            p5.fill(Colors.BLUE);
            p5.circle(DequeLinkedList.HEAD_TAIL_X + DequeLinkedList.HEAD_TAIL_SIZE / 2, headY + DequeLinkedList.HEAD_TAIL_SIZE / 2, 5);
            p5.line(DequeLinkedList.HEAD_TAIL_X + DequeLinkedList.HEAD_TAIL_SIZE / 2, headY + DequeLinkedList.HEAD_TAIL_SIZE / 2, this.head.currentX + DequeLinkedList.ITEM_WIDTH / 2, this.head.currentY);
            p5.rect(this.head.currentX + DequeLinkedList.ITEM_WIDTH / 2 - 3, this.head.currentY - 3, 6,6);
        } else {
            p5.line(DequeLinkedList.HEAD_TAIL_X,headY,DequeLinkedList.HEAD_TAIL_X + DequeLinkedList.HEAD_TAIL_SIZE,headY + DequeLinkedList.HEAD_TAIL_SIZE);
        }
        p5.noFill();
        p5.stroke(0);
        let tailY = this.getTailY();
        p5.text("Tail:",95,tailY,DequeLinkedList.HEAD_TAIL_SIZE,DequeLinkedList.HEAD_TAIL_SIZE);
        p5.square(DequeLinkedList.HEAD_TAIL_X,tailY,DequeLinkedList.HEAD_TAIL_SIZE);
        if (this.tail) {
            p5.stroke(Colors.BLUE);
            p5.fill(Colors.BLUE);
            p5.circle(DequeLinkedList.HEAD_TAIL_X + DequeLinkedList.HEAD_TAIL_SIZE / 2, tailY + DequeLinkedList.HEAD_TAIL_SIZE / 2, 5);
            p5.line(DequeLinkedList.HEAD_TAIL_X + DequeLinkedList.HEAD_TAIL_SIZE / 2, tailY + DequeLinkedList.HEAD_TAIL_SIZE / 2, this.tail.currentX + DequeLinkedList.ITEM_WIDTH / 2, this.tail.currentY + DequeLinkedList.ELEMENT_HEIGHT);
            p5.rect(this.tail.currentX + DequeLinkedList.ITEM_WIDTH / 2 - 3, this.tail.currentY + DequeLinkedList.ELEMENT_HEIGHT - 3, 6,6);
        } else {
            p5.line(DequeLinkedList.HEAD_TAIL_X,tailY,DequeLinkedList.HEAD_TAIL_X + DequeLinkedList.HEAD_TAIL_SIZE,tailY + DequeLinkedList.HEAD_TAIL_SIZE);
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
        super.windowResized(p5, height, numScrollbars, this.getTailY() + DequeLinkedList.HEAD_TAIL_SIZE + 20,() => {
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


class DequeLinkedListNode extends AttractedDraggableObject {
    static CAN_DRAG = true;

    constructor({data, index, x,y} = {}) {
        super(x,y);

        this.data = data;
        this.index = index;
        this.next = null;
        this.prev = null;

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
        return ((this.currentX <= x && x <= (this.currentX + DequeLinkedList.ITEM_WIDTH)) && (this.currentY <= y && y <= (this.currentY + DequeLinkedList.ELEMENT_HEIGHT)))
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
        p5.rect(this.currentX, this.currentY, DequeLinkedList.ITEM_WIDTH, DequeLinkedList.ELEMENT_HEIGHT);
        p5.line(this.currentX + DequeLinkedList.POINTER_WIDTH, this.currentY, this.currentX + DequeLinkedList.POINTER_WIDTH, this.currentY + DequeLinkedList.ELEMENT_HEIGHT);
        p5.line(this.currentX + DequeLinkedList.POINTER_WIDTH + DequeLinkedList.ELEMENT_WIDTH, this.currentY, this.currentX + DequeLinkedList.POINTER_WIDTH + DequeLinkedList.ELEMENT_WIDTH, this.currentY + DequeLinkedList.ELEMENT_HEIGHT);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.fill(...this.color);
        p5.text(this.data.toString(), this.currentX + DequeLinkedList.POINTER_WIDTH,this.currentY, DequeLinkedList.ELEMENT_WIDTH,DequeLinkedList.ELEMENT_HEIGHT);
        if (this.prev) {
            p5.stroke(...Utils.addArray(this.color, Colors.BLUE));
            p5.fill(...Utils.addArray(this.color, Colors.BLUE));
            p5.circle(this.currentX + DequeLinkedList.POINTER_WIDTH / 2, this.currentY + DequeLinkedList.ELEMENT_HEIGHT *2/3, 5);
            p5.line(this.currentX + DequeLinkedList.POINTER_WIDTH / 2, this.currentY + DequeLinkedList.ELEMENT_HEIGHT *2/3, this.prev.currentX + DequeLinkedList.ITEM_WIDTH, this.prev.currentY + DequeLinkedList.ELEMENT_HEIGHT *2/3)
            p5.rect(this.prev.currentX + DequeLinkedList.ITEM_WIDTH - 3, this.prev.currentY + DequeLinkedList.ELEMENT_HEIGHT *2/3 - 3, 6,6);
        } else {
            p5.line(this.currentX, this.currentY, this.currentX + DequeLinkedList.POINTER_WIDTH, this.currentY + DequeLinkedList.ELEMENT_HEIGHT);
        }
        if (this.next) {
            p5.stroke(...Utils.addArray(this.color, Colors.BLUE));
            p5.fill(...Utils.addArray(this.color, Colors.BLUE));
            p5.circle(this.currentX + DequeLinkedList.ITEM_WIDTH - DequeLinkedList.POINTER_WIDTH / 2, this.currentY + DequeLinkedList.ELEMENT_HEIGHT / 3, 5);
            p5.line(this.currentX + DequeLinkedList.ITEM_WIDTH - DequeLinkedList.POINTER_WIDTH / 2, this.currentY + DequeLinkedList.ELEMENT_HEIGHT / 3, this.next.currentX, this.next.currentY + DequeLinkedList.ELEMENT_HEIGHT / 3)
            p5.rect(this.next.currentX - 3, this.next.currentY + DequeLinkedList.ELEMENT_HEIGHT / 3 - 3, 6,6);
        } else {
            p5.stroke(...this.color);
            p5.line(this.currentX + DequeLinkedList.POINTER_WIDTH + DequeLinkedList.ELEMENT_WIDTH, this.currentY, this.currentX + DequeLinkedList.ITEM_WIDTH, this.currentY + DequeLinkedList.ELEMENT_HEIGHT);
        }
        p5.pop();
    }
}
