import { Visualization } from 'animation';
import { TreeNode, TrackingHighlighter } from 'animation';
import { Colors } from 'utils';

export default class BST extends Visualization {
    static USE_CANVAS = true;
    static SET_BOUNDS = true;
    static CAN_DRAG = true;
    static SUPPORTS_NO_LOOP = true;
    static SUPPORTS_CUSTOM_END = true;
    static MAX_ANIM_TIME = 5000;
    static SUPPORTS_TEXT = true;
    static SUPPORTS_ANIMATION_CONTROL = true;
    static SUPPORTS_STOP_ID = true;
    static SUPPORTS_INFREQUENT_RESIZE = true;
    static HAS_MIN_WIDTH = true;

    static ELEMENT_SIZE = 40;
    static VERTICAL_SPACING = 7.5;
    static HORIZONTAL_SPACING = -17.5;

    static ROOT_SIZE = 25;
    static ROOT_X = 130;
    static ROOT_Y = 20;
    static ROOT_HIGHLIGHT_DIAMETER = 10;


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

        this.root = null;
        this.size = 0;
        this.nodes = [];
        this.tempNode = null;
        this.pinnedNode = null;
        this.highlighter = new TrackingHighlighter(null, BST.ELEMENT_SIZE/2, {
            highlightInnerRadius: BST.ELEMENT_SIZE/2
        });
        this.rootPointerPos = {currentX: BST.ROOT_X + BST.ROOT_SIZE / 2 - BST.ROOT_HIGHLIGHT_DIAMETER / 2, currentY: BST.ROOT_Y + BST.ROOT_SIZE / 2 - BST.ROOT_HIGHLIGHT_DIAMETER / 2};

        if (this.made) {
            this.endDrawLoop();
        }
    }

    mostDisplacedRecursive(curr) {
        if (curr) {
            let left = this.mostDisplacedRecursive(curr.left) || curr;
            let right = this.mostDisplacedRecursive(curr.right) || curr;
            return [left, curr, right].sort((a,b) => b.displacement() - a.displacement())[0];
        }
        return null;
    }

    stopNodesRecursive(curr) {
        if (curr) {
            curr.stop();
            curr.left && curr.left.stop();
            curr.right && curr.right.stop();
        }
    }

    ensureDrawn(skipDraw = false) {
        this.beginDrawLoop();
        let maxNode = this.highlighter;
        if (this.tempNode && this.tempNode.displacement() > maxNode.displacement()) {
            maxNode = this.tempNode;
        }
        let furthestTreeNode = this.mostDisplacedRecursive(this.root);
        if (furthestTreeNode && furthestTreeNode.displacement() > maxNode.displacement()) {
            maxNode = furthestTreeNode;
        }
        if (maxNode && maxNode.displacement() > 0) {
            let stopID = ++this.stopID;
            maxNode.addOnStop(() => {
                this.stopDrawing(stopID);
            });
            if (skipDraw) {
                this.stopNodesRecursive(this.root);
                if (this.tempNode) {
                    this.tempNode.stop();
                }
                this.highlighter.stop();
            }
        } else {
            let stopID = ++this.stopID;
            this.stopDrawing(stopID);
        }
    }


    insert(data) {
        if (this.animating) {
            //console.log("animation in progress");
            return false;
        }
        this.beginDrawLoop();
        if (data === null) {
            this.updateText("Cannot add null to BST.", Colors.RED);
            return false;
        }
        let animation = [];
        animation.push({method:this.showText,params:[`Attempt add: ${data} to BST`],noAnim:true});
        animation.push({method:this.setHighlighter,params:[this.rootPointerPos],customEnd:true,customRedoEnd:true,returnsUndoData:true,});
        animation.push({method:this.showText,params:[`Searching tree for value: ${data}`],quick:true,isForwardStep:true,customRedoEnd:true});
        let [ recurredAnimation, newRoot, nodeJustAdded, added ] = this.insertRecursive(this.root, data);
        animation.push(...recurredAnimation);
        animation.push({method:this.setHighlighter,params:[this.rootPointerPos],customEnd:true,isBackStep:true,customUndoEnd:true,customRedoEnd:true,returnsUndoData:true,});
        animation.push({method:this.setRoot,params:[newRoot],explanation:`${this.root ? "Res" : "S"}et root pointer to node containing ${newRoot.data}`,quick:true,isForwardStep:true,returnsUndoData:true,customRedoEnd:true});
        if (nodeJustAdded) {
            animation.push({method:this.shiftByLevelOrder,testsWindowSize:true,explanation:`Add node:${data} to root of tree`,customEnd:true,isAnimationStep:true,customUndoEnd:true,customRedoEnd:true,returnsUndoData:true});
        }
        animation.push({method:this.setHighlighter,params:[null],noAnim:true,isBackStep:true,customUndoEnd:true,returnsUndoData:true,});
        animation.push({method:this.clearTemp,noAnim:true,returnsUndoData:true,});
        if (added) {
            animation.push({method:this.showText,params:[`Successfully inserted ${data} into BST.`, Colors.GREEN],noAnim:true});
        } else {
            animation.push({method:this.showText,params:[`Failed to insert duplicate ${data} into BST.`, Colors.RED],noAnim:true});
        }
        this.addAnimation(animation);
        this.endDrawLoop();
        this.stepForward();
        return true;
    }

    delete() {
        if (this.animating) {
            //console.log("animation in progress");
            return false;
        }
        this.beginDrawLoop();
        if (this.size === 0) {
            this.updateText("Cannot delete from empty BST", Colors.RED);
            return false;
        }
        let animation = [];
        let data = this.root.data;
        animation.push({method:this.markRootForDeletion,noAnim:true,});
        animation.push({method:this.unmakeRoot,explanation:`Extract data`,customEnd:true,isAnimationStep:true,customUndoEnd:true,customRedoEnd:true,});
        if (this.size > 1) {
            animation.push({method:this.shiftIntoNode,isAnimationStep:true,customUndoEnd:true,customRedoEnd:true,});
        }
        animation.push({method:this.skipTempNode,explanation:`${data ? "Res" : "S"}et root pointer to new root`,isAnimationStep:true,returnsUndoData:true,});
        animation.push({method:this.sizeDecr,noAnim:true,});
        animation.push({method:this.showText,params:[`Successfully deleted ${data} from BST.`, Colors.GREEN],noAnim:true,});
        this.addAnimation(animation);
        this.endDrawLoop();
        this.stepForward();
        return data;
    }

    find(data) {

    }

    print() {

    }

    insertRecursive(curr, value) {
        let animation = [];
        let justAdded = false;
        let added = false;
        animation.push({method:this.setHighlighter,params:[curr],customEnd:curr!==null,noAnim:curr===null,isBackStep:true,customUndoEnd:true,customRedoEnd:curr!==null,returnsUndoData:true});
        if (!curr) {
            animation.push({method:this.showText,params:[`Reached null: ${value} not found in tree`],quick:true,isForwardStep:true,});
            curr = new BSTNode({data: value});
            animation.push({method:this.makeNode,params:[curr],explanation:`Create value: ${value}`,quick:true,isAnimationStep:true,returnsRedoData:true});
            animation.push({method:this.sizeIncr,noAnim:true,});
            justAdded = true;
            added = true;
        } else if (value === curr.data) {
            animation.push({method:this.showText,params:[`${value} == ${curr.data}: value found in tree`],quick:true,isForwardStep:true,customRedoEnd:true,});
            animation.push({method:this.showText,params:[`${value} already in BST, failed to add.`],noAnim:true,isAnimationStep:true,});
        } else if (value < curr.data) {
            animation.push({method:this.showText,params:[`${value} < ${curr.data}: look to left subtree`],quick:true,isForwardStep:true,customRedoEnd:true,});
            let [recurredAnimation, newLeft, nodeJustAdded, nodeAdded] = this.insertRecursive(curr.left, value);
            animation.push(...recurredAnimation);
            animation.push({method:this.setHighlighter,params:[curr],customEnd:true,isBackStep:true,customUndoEnd:true,customRedoEnd:true,returnsUndoData:true,});
            animation.push({method:this.setLeft,params:[curr, newLeft],explanation:`${curr.left ? "Res" : "S"}et left pointer to node containing ${newLeft.data}`,quick:true,returnsUndoData:true,isForwardStep:true,customRedoEnd:true});
            if (nodeJustAdded) {
                animation.push({method:this.shiftByLevelOrder,testsWindowSize:true,explanation:`Add node:${value} to left of node:${curr.data}`,customEnd:true,isAnimationStep:true,returnsUndoData:true});
            }
            added = nodeAdded;
        } else if (value > curr.data) {
            animation.push({method:this.showText,params:[`${value} > ${curr.data}: look to right subtree`],quick:true,isForwardStep:true,customRedoEnd:true,});
            let [recurredAnimation, newRight, nodeJustAdded, nodeAdded] = this.insertRecursive(curr.right, value);
            animation.push(...recurredAnimation);
            animation.push({method:this.setHighlighter,params:[curr],customEnd:true,isBackStep:true,customUndoEnd:true,customRedoEnd:true,returnsUndoData:true,});
            animation.push({method:this.setRight,params:[curr, newRight],explanation:`${curr.right ? "Res" : "S"}et right pointer to node containing ${newRight.data}`,quick:true,returnsUndoData:true,isForwardStep:true,customRedoEnd:true,});
            if (nodeJustAdded) {
                animation.push({method:this.shiftByLevelOrder,testsWindowSize:true,explanation:`Add node:${value} to right of node:${curr.data}`,customEnd:true,isAnimationStep:true,returnsUndoData:true});
            }
            added = nodeAdded;
        }
        return [animation, curr, justAdded, added];
    }

    setRoot(newRoot) {
        let oldRoot = this.root;
        this.root = newRoot;
        let oldParamsOfNewRoot = {parent: newRoot.parent, depth: newRoot.depth};
        this.root.parent = null;
        this.root.depth = 0;
        return [oldRoot,oldParamsOfNewRoot];
    }
    undo_setRoot(oldRoot, oldParamsOfNewRoot) {
        for (let param in oldParamsOfNewRoot) {
            this.root[param] = oldParamsOfNewRoot[param];
        }
        this.root = oldRoot;
    }

    setLeft(parent, newLeft) {
        let oldLeft = parent.left;
        parent.left = newLeft;
        let oldParamsOfNewLeft = {parent: newLeft.parent, depth: newLeft.depth};
        let oldParamsOfParent = {height: parent.height};
        let oldRightOfLeftOfNew = null;
        newLeft.parent = parent;
        newLeft.depth = parent.depth + 1;
        parent.height = Math.max(newLeft.height, (parent.right && parent.right.height) || -1) + 1;
        if (!oldLeft) {
            Object.assign(oldParamsOfNewLeft, {leftBoundingNode: newLeft.leftBoundingNode, rightBoundingNode: newLeft.rightBoundingNode});
            Object.assign(oldParamsOfParent, {leftBoundingNode: parent.leftBoundingNode});
            newLeft.leftBoundingNode = parent.leftBoundingNode;
            parent.leftBoundingNode = newLeft;
            newLeft.rightBoundingNode = parent;
            if (newLeft.leftBoundingNode) {
                oldRightOfLeftOfNew = newLeft.leftBoundingNode.rightBoundingNode;
                newLeft.leftBoundingNode.rightBoundingNode = newLeft;
            }
        }
        return [parent, oldLeft, oldParamsOfNewLeft, oldParamsOfParent, oldRightOfLeftOfNew];
    }
    undo_setLeft(parent, oldLeft, oldParamsOfNewLeft, oldParamsOfParent, oldRightOfLeftOfNew) {
        if (oldRightOfLeftOfNew) {
            parent.left.leftBoundingNode.rightBoundingNode = oldRightOfLeftOfNew;
        }
        for (let param in oldParamsOfNewLeft) {
            parent.left[param] = oldParamsOfNewLeft[param];
        }
        parent.left = oldLeft;
        for (let param in oldParamsOfParent) {
            parent[param] = oldParamsOfParent[param];
        }
    }

    setRight(parent, newRight) {
        let oldRight = parent.right;
        parent.right = newRight;
        let oldParamsOfNewRight = {parent: newRight.parent, depth: newRight.depth};
        let oldParamsOfParent = {height: parent.height};
        let oldLeftOfRightOfNew = null;
        newRight.parent = parent;
        newRight.depth = parent.depth + 1;
        parent.height = Math.max(newRight.height, (parent.left && parent.left.height) || -1) + 1;
        if (!oldRight) {
            Object.assign(oldParamsOfNewRight, {leftBoundingNode: newRight.leftBoundingNode, rightBoundingNode: newRight.rightBoundingNode});
            Object.assign(oldParamsOfParent, {rightBoundingNode: parent.rightBoundingNode});
            newRight.rightBoundingNode = parent.rightBoundingNode;
            parent.rightBoundingNode = newRight;
            newRight.leftBoundingNode = parent;
            if (newRight.rightBoundingNode) {
                oldLeftOfRightOfNew = newRight.rightBoundingNode.leftBoundingNode;
                newRight.rightBoundingNode.leftBoundingNode = newRight;
            }
        }
        return [parent, oldRight, oldParamsOfNewRight, oldParamsOfParent, oldLeftOfRightOfNew];
    }
    undo_setRight(parent, oldRight, oldParamsOfNewRight, oldParamsOfParent, oldLeftOfRightOfNew) {
        if (oldLeftOfRightOfNew) {
            parent.right.rightBoundingNode.leftBoundingNode = oldLeftOfRightOfNew;
        }
        for (let param in oldParamsOfNewRight) {
            parent.right[param] = oldParamsOfNewRight[param];
        }
        parent.right = oldRight;
        for (let param in oldParamsOfParent) {
            parent[param] = oldParamsOfParent[param];
        }
    }

    setHighlighter(node) {
        let oldTarget = this.highlighter.target;
        this.highlighter.setTarget(node, node === this.rootPointerPos ? BST.ROOT_HIGHLIGHT_DIAMETER/2 : BST.ELEMENT_SIZE/2);
        if (node) {
            this.highlighter.addOnStop((highlighter) => {
                this.doneAnimating(0);
            });
        }
        return [oldTarget];
    }
    undo_setHighlighter(oldTarget) {
        this.highlighter.setTarget(oldTarget, oldTarget === this.rootPointerPos ? BST.ROOT_HIGHLIGHT_DIAMETER/2 : BST.ELEMENT_SIZE/2);
        if (oldTarget) {
            let stopID = ++this.stopID;
            this.highlighter.addOnStop((highlighter) => {
                this.stopDrawing(stopID);
            });
        }
    }
    redo_setHighlighter(node) {
        let oldTarget = this.highlighter.target;
        this.highlighter.setTarget(node, node === this.rootPointerPos ? BST.ROOT_HIGHLIGHT_DIAMETER/2 : BST.ELEMENT_SIZE/2);
        if (node) {
            let stopID = ++this.stopID;
            this.highlighter.addOnStop((highlighter) => {
                this.stopDrawing(stopID);
            });
        }
        return [oldTarget];
    }

    clearTemp() {
        let oldTemp = this.tempNode;
        this.tempNode = null;
        return [oldTemp];
    }
    undo_clearTemp(oldTemp) {
        this.tempNode = oldTemp;
    }

    shiftByLevelOrder() {
        let order = [];
        let oldPositions = [];
        let curr = this.root;
        while (curr.left) {
            curr = curr.left;
        }
        let centerIndex = 0;
        while (curr) {
            order.push(curr);
            oldPositions.push([curr.desiredX - ((this.width - BST.ELEMENT_SIZE)/2),curr.desiredY]);
            curr = curr.rightBoundingNode;
            if (curr === this.root) {
                centerIndex = order.length;
            }
        }
        let displaced = null;
        // console.log(centerIndex);
        order.forEach((node, i) => {
            // console.log(node.data,":",i - centerIndex, ((this.width - BST.ELEMENT_SIZE)/2), node.constructor.HSPACE);
            node.shiftX(((this.width - BST.ELEMENT_SIZE)/2) + (i - centerIndex) * node.constructor.HSPACE);
            node.setY(this.getNodeY(node.depth));
            if ((!displaced && node.displacement()) || (displaced && node.displacement() > displaced.displacement())) {
                node.addOnStop((element) => {
                    this.doneAnimating(0);
                });
                displaced = node;
            }
        });
        if (!displaced) {
            this.doneAnimating(0);
        }
        return [order, oldPositions];
    }
    undo_shiftByLevelOrder(order, oldPositions) {
        let stopID = ++this.stopID;
        if (order) {
            // console.log(oldPositions);
            let displaced = null;
            order.forEach((node, i) => {
                node.shift(((this.width - BST.ELEMENT_SIZE)/2) + oldPositions[i][0], oldPositions[i][1]);
                if ((!displaced && node.displacement()) || (displaced && node.displacement() > displaced.displacement())) {
                    node.addOnStop((element) => {
                        this.stopDrawing(stopID);
                    });
                    displaced = node;
                }
            });
            if (!displaced) {
                this.stopDrawing(stopID);
            }
        } else {
            this.stopDrawing(stopID);
        }
    }

    highlightNodesUntilValueFound(value) {
        let animation = [];
        animation.push({method:this.showText,params:[`Searching tree for value: ${value}`],quick:true});
        let node = null;
        if (this.root) {
            // animation.push({method:this.setHighlighter,params:[this.root],customEnd:true,});
        }
        let [recurredAnimation, found, foundNode] = this.recursiveNodeFinder(this.root, value);
        animation.push(...recurredAnimation);
        animation.push({method:this.setHighlighter,params:[null],customEnd:true,customUndoEnd:true,customRedoEnd:true});
        node = foundNode;
        return [animation, found, node];
    }

    recursiveNodeFinder(curr, value) {
        let animation = [];
        let found = false;
        let foundNode = curr;
        if (curr) {
            animation.push({method:this.setHighlighter,params:[curr],customEnd:true,customUndoEnd:true,customRedoEnd:true,});
        }
        if (!curr) {
            animation.push({method:this.showText,params:[`Reached null: ${value} not found in tree`],quick:true,});
        } else if (value === curr.data) {
            animation.push({method:this.showText,params:[`${value} == ${curr.data}: value found in tree`],quick:true,});
            found = true;
        } else if (value < curr.data) {
            animation.push({method:this.showText,params:[`${value} < ${curr.data}: look to left subtree`],quick:true,});
            // console.log(curr.data, "look left", curr.left && curr.left.data);
            let [recurredAnimation, foundLeft, node] = this.recursiveNodeFinder(curr.left, value);
            animation.push(...recurredAnimation);
            // console.log(curr.data, foundLeft, node ? node : curr);
            return [animation, foundLeft, node ? node : curr];
        } else if (value > curr.data) {
            animation.push({method:this.showText,params:[`${value} > ${curr.data}: look to right subtree`],quick:true,});
            let [recurredAnimation, foundRight, node] = this.recursiveNodeFinder(curr.right, value);
            animation.push(...recurredAnimation);
            return [animation, foundRight, node ? node : curr]
        }
        //console.log(found, foundNode);
        return [animation, found, foundNode];
    }


    makeNode(newTemp) {
        this.tempNode = newTemp;
        return [this.tempNode];
    }
    undo_makeNode(data, parent) {
        this.tempNode = null;
    }
    redo_makeNode(newTemp) {
        this.tempNode = newTemp;
        this.tempNode.goTo(20,20);
    }

    markRootForDeletion() {
        this.root.markForDeletion();
    }
    undo_markRootForDeletion() {
        this.root.unhighlight();
    }

    unmakeRoot() {
        this.tempNode = this.nodes.splice(0, 1)[0];
        this.tempNode.shift(20,20);
        this.tempNode.addOnStop((element) => {
            element.frozen = true;
            this.doneAnimating(0);
        });
    }
    undo_unmakeRoot() {
        this.tempNode.shift((this.width - BST.ELEMENT_SIZE)/2, this.getNodeY(0));
        this.tempNode.frozen = false;
        this.nodes.splice(0, 0, this.tempNode);
        let stopID = ++this.stopID;
        this.tempNode.addOnStop(() => {
            this.stopDrawing(stopID);
        });
        this.tempNode = null;
    }
    redo_unmakeRoot() {
        this.tempNode = this.nodes.splice(0, 1)[0];
        this.tempNode.shift(20,20);
        let stopID = ++this.stopID;
        this.tempNode.addOnStop((element) => {
            element.frozen = true;
            this.stopDrawing(stopID);
        });
    }

    skipTempNode() {
        let oldTemp = this.tempNode;
        this.root = this.root.next;
        this.tempNode = null;
        if (!this.root) {
            this.tail = null;
        }
        return [oldTemp, this.tail === null]
    }
    undo_skipTempNode(oldTemp, noTail) {
        this.tempNode = oldTemp;
        this.tempNode.next = this.root;
        this.tempNode.markForDeletion();
        this.root = this.tempNode;
        if (noTail) {
            this.tail = this.tempNode;
        }
    }

    shiftIntoNode() {
        let node = this.root.next;
        while (node) {
            this.shiftNode(node, -1);
            node = node.next;
        }
    }
    undo_shiftIntoNode() {
        let node = this.root.next;
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
        let node = this.root.next;
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
        if (direction > 0) {
            node.shiftUp();
        } else {
            node.shiftDown();
        }
    }
    undo_shiftNode(node, direction) {
        if (direction > 0) {
            node.shiftDown();
        } else {
            node.shiftUp();
        }
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

    getNodeY(depth) {
        let y = depth * (BST.ELEMENT_SIZE + BST.VERTICAL_SPACING);
        return y + this.y;
    }

    getTreeNodeAtPosRecursive(curr, x,y) {
        if (curr) {
            if (curr.containsPos(x,y)) {
                return curr;
            }
            return this.getTreeNodeAtPosRecursive(curr.left, x,y) || this.getTreeNodeAtPosRecursive(curr.right, x,y);
        }
        return null;
    }

    getNodeAtPos(x,y) {
        if (this.tempNode && this.tempNode.containsPos(x,y)) {
            return this.tempNode;
        }
        return this.getTreeNodeAtPosRecursive(this.root, x,y);
    }

    getMaxY() {
        return this.getNodeY(this.root ? this.root.height + 1 : 1) + 20;
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
        if (node) {
            node.update(animationSpeed, p5);
        }
    }

    update(animationSpeed, p5) {
        super.update(animationSpeed, p5, () => {
            this.updateNode(this.root, animationSpeed, p5);
            this.updateNode(this.tempNode, animationSpeed, p5);
            this.highlighter.update(animationSpeed, p5);
        });
    }

    draw(p5) {
        // console.log("draw");
        super.draw(p5);
        p5.push();
        // p5.translate(this.x,this.y);

        p5.textAlign(p5.CENTER,p5.CENTER);
        p5.textSize(this.ELEMENT_SIZE/3 - 2);

        p5.noFill();
        p5.stroke(0);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.text("Root:",95-5,BST.ROOT_Y,BST.ROOT_SIZE + 10,BST.ROOT_SIZE);
        p5.square(BST.ROOT_X,BST.ROOT_Y,BST.ROOT_SIZE);
        if (this.root) {
            p5.stroke(Colors.BLUE);
            p5.fill(Colors.BLUE);
            p5.circle(BST.ROOT_X + BST.ROOT_SIZE / 2, BST.ROOT_Y + BST.ROOT_SIZE / 2, 5);
            p5.line(BST.ROOT_X + BST.ROOT_SIZE / 2, BST.ROOT_Y + BST.ROOT_SIZE / 2, this.root.currentX + BST.ELEMENT_SIZE / 2, this.root.currentY);
            // p5.rect(this.root.currentX + BST.ELEMENT_SIZE / 2 - 3, this.root.currentY - 3, 6,6);
        } else {
            p5.line(BST.ROOT_X,BST.ROOT_Y,BST.ROOT_X + BST.ROOT_SIZE,BST.ROOT_Y + BST.ROOT_SIZE);
        }


        if (this.root) {
            this.root.draw(p5);
        }
        if (this.tempNode) {
            this.tempNode.draw(p5);
        }
        this.highlighter.draw(p5);

        p5.pop();
    }

    mousePressed(p5) {
        // this.drawingBeforeMouseDown = this.drawing;
        let pressedNode = this.getNodeAtPos(p5.mouseX, p5.mouseY);
        if (pressedNode) {
            this.animator.loop();
            this.pin(pressedNode, p5.mouseX,p5.mouseY);
            //console.log(pressedNode,`\nleft:`,pressedNode.leftBoundingNode && pressedNode.leftBoundingNode.data,`\nright:`,pressedNode.rightBoundingNode && pressedNode.rightBoundingNode.data);
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
        super.windowResized(p5, height, numScrollbars, this.getMaxY(),() => {
            let shiftTemp = this.tempNode && this.tempNode.desiredX === 20 && this.tempNode.desiredY === 20;
            if (this.root) {
                let order = [];
                let curr = this.root;
                while (curr.left) {
                    curr = curr.left;
                }
                let centerIndex = 0;
                while (curr) {
                    order.push(curr);
                    curr = curr.rightBoundingNode;
                    if (curr === this.root) {
                        centerIndex = order.length;
                    }
                }
                order.forEach((node, i) => {
                    node.shiftX(((this.width - BST.ELEMENT_SIZE)/2) + (i - centerIndex) * node.constructor.HSPACE);
                    node.setY(this.getNodeY(node.depth));
                });
            }
            if (shiftTemp) {
                this.tempNode.shift(20,20);
            }
        });
    }
}


class BSTNode extends TreeNode {
    static CAN_DRAG = true;
    static SIZE = BST.ELEMENT_SIZE;
    static VSPACE = BST.ELEMENT_SIZE + BST.VERTICAL_SPACING;
    static HSPACE = BST.ELEMENT_SIZE + BST.HORIZONTAL_SPACING;

    constructor({x=20,y=20,depth, data, parent, leftBoundingNode,rightBoundingNode} = {}) {
        super(x,y,depth, data, parent, leftBoundingNode,rightBoundingNode);

        this.toDelete = false;
        this.handBroken = false;
        this.color = [0,0,0];
    }

    highlightForDeletion() {
        this.color[0] = 255;
    }

    markForDeletion() {
        this.toDelete = true;
        this.highlightForDeletion();
    }
}
