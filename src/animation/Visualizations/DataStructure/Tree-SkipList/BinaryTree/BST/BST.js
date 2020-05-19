import { Visualization } from 'animation';
import { TreeNode, TrackingHighlighter, AttractedHighlightableObject } from 'animation';
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
    static ROOT_X_MIN = 50;
    static ROOT_X_OFFSET = -40;
    static ROOT_Y = 20;
    static ROOT_HIGHLIGHT_DIAMETER = 10;

    reset() {
        super.reset(() => {
            this.root = null;
            this.inOrder = [];
            this.size = 0;
            this.predSuccMode = this.predSuccMode !== undefined ? this.predSuccMode : true;
            this.tempNode = null;
            this.pinnedNode = null;
            this.highlighter = new TrackingHighlighter(null, this.constructor.ELEMENT_SIZE/2, {
                highlightInnerRadius: this.constructor.ELEMENT_SIZE/2
            });
            this.rootPointerPos = {currentX: this.getRootPointerX() + this.constructor.ROOT_SIZE / 2 - this.constructor.ROOT_HIGHLIGHT_DIAMETER / 2, currentY: this.constructor.ROOT_Y + this.constructor.ROOT_SIZE / 2 - this.constructor.ROOT_HIGHLIGHT_DIAMETER / 2};
        });

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
        if (this.dataMover && this.dataMover.displacement() > maxNode.displacement()) {
            maxNode = this.dataMover;
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
                if (this.dataMover) {
                    this.dataMover.stop();
                }
                this.highlighter.stop();
            }
        } else {
            let stopID = ++this.stopID;
            this.stopDrawing(stopID);
        }
    }


    insert(data, callback, calledFromCallback) {
        if (this.animationQueue.length !== 0) {
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
            animation.push({method:this.shiftByInOrder,testsWindowSize:true,explanation:`Add node:${data} to root of tree`,customEnd:true,isAnimationStep:true,customUndoEnd:true,customRedoEnd:true,returnsUndoData:true});
        }
        animation.push({method:this.setHighlighter,params:[null],noAnim:true,isBackStep:true,customUndoEnd:true,returnsUndoData:true,});
        animation.push({method:this.clearTemp,noAnim:true,returnsUndoData:true,});
        if (added) {
            animation.push({method:this.showText,params:[`Successfully inserted ${data} into BST.`, Colors.GREEN],noAnim:true});
        } else {
            animation.push({method:this.showText,params:[`Failed to insert duplicate ${data} into BST.`, Colors.RED],noAnim:true});
        }
        this.addAnimation(animation);
        this.endDrawLoop(callback);
        if (!calledFromCallback || !this.paused) {
            this.stepForward();
        }
        return true;
    }

    delete(data, callback, calledFromCallback) {
        if (this.animationQueue.length !== 0) {
            return false;
        }
        this.beginDrawLoop();
        if (data === null) {
            this.updateText("Cannot remove null from BST.", Colors.RED);
            return false;
        }
        if (this.size === 0) {
            this.updateText("Cannot delete from empty BST", Colors.RED);
            return false;
        }
        let animation = [];
        animation.push({method:this.showText,params:[`Attempt delete: ${data} to BST`],noAnim:true});
        animation.push({method:this.setHighlighter,params:[this.rootPointerPos],customEnd:true,customRedoEnd:true,returnsUndoData:true,});
        animation.push({method:this.showText,params:[`Searching tree for value: ${data}`],quick:true,isForwardStep:true,customRedoEnd:true});
        let [ recurredAnimation, newRoot, nodeJustDeleted, deleted ] = this.deleteRecursive(this.root, data);
        animation.push(...recurredAnimation);
        animation.push({method:this.setHighlighter,params:[this.rootPointerPos],customEnd:true,isBackStep:true,customUndoEnd:true,customRedoEnd:true,returnsUndoData:true,});
        animation.push({method:this.setRoot,params:[newRoot],explanation:`${this.root ? "Res" : "S"}et root pointer to ${newRoot ? `node containing ${newRoot.data}` : "null"}`,quick:true,isForwardStep:true,returnsUndoData:true,customRedoEnd:true});
        if (nodeJustDeleted) {
            animation.push({method:this.clearTemp,noAnim:true,returnsUndoData:true,});
            animation.push({method:this.shiftByInOrder,testsWindowSize:true,explanation:`Remove node:${data} from root of tree`,customEnd:true,isAnimationStep:true,customUndoEnd:true,customRedoEnd:true,returnsUndoData:true});
        }
        animation.push({method:this.setHighlighter,params:[null],noAnim:true,isBackStep:true,customUndoEnd:true,returnsUndoData:true,});
        if (deleted) {
            animation.push({method:this.showText,params:[`Successfully deleted ${data} from BST.`, Colors.GREEN],noAnim:true});
        } else {
            animation.push({method:this.showText,params:[`Failed to delete ${data} from BST.`, Colors.RED],noAnim:true});
        }
        this.addAnimation(animation);
        this.endDrawLoop(callback);
        if (!calledFromCallback || !this.paused) {
            this.stepForward();
        }
        return true;
    }

    find(data, callback, calledFromCallback) {
        if (this.animationQueue.length !== 0) {
            return false;
        }
        this.beginDrawLoop();
        if (data === null) {
            this.updateText("Cannot search for null in BST.", Colors.RED);
            return false;
        }
        let animation = [];
        animation.push({method:this.showText,params:[`Search for ${data} in BST`],noAnim:true});
        animation.push({method:this.setHighlighter,params:[this.rootPointerPos],customEnd:true,customRedoEnd:true,returnsUndoData:true,});
        animation.push({method:this.showText,params:[`Searching tree for value: ${data}`],quick:true,isForwardStep:true,customRedoEnd:true});
        let [ recurredAnimation ] = this.findRecursive(this.root, data);
        animation.push(...recurredAnimation);
        animation.push({method:this.setHighlighter,params:[null],noAnim:true,customUndoEnd:true,returnsUndoData:true,});
        this.addAnimation(animation);
        this.endDrawLoop(callback);
        if (!calledFromCallback || !this.paused) {
            this.stepForward();
        }
        return true;
    }

    print(callback, calledFromCallback) {
        if (this.animationQueue.length !== 0) {
            return false;
        }
        this.beginDrawLoop();
        if (this.size === 0) {
            this.updateText("Cannot print in order for empty BST.", Colors.RED);
            return false;
        }
        let animation = [];
        animation.push({method:this.showText,params:[`Print BST in order`],noAnim:true});
        animation.push({method:this.setHighlighter,params:[this.rootPointerPos],customEnd:true,customRedoEnd:true,returnsUndoData:true,isForwardStep:true});
        let inOrder = [];
        let [ recurredAnimation ] = this.printInOrderRecursive(this.root, inOrder);
        animation.push(...recurredAnimation);
        animation.push({method:this.setHighlighter,params:[null],noAnim:true,customUndoEnd:true,returnsUndoData:true,isBackStep:true,});
        animation.push({method:this.showText,params:[`[${inOrder.join(",    ")}]`],quick:true});
        this.addAnimation(animation);
        this.endDrawLoop(callback);
        if (!calledFromCallback || !this.paused) {
            this.stepForward();
        }
        return true;
    }

    togglePredecessorSuccessor(which, callback, calledFromCallback) {
        if (this.animationQueue.length !== 0) {
            return false;
        }
        this.beginDrawLoop();
        let animation = [];
        animation.push({method:this.switchMode,params:[which],explanation:`Switching BST modes`,quick:true});
        animation.push({method:this.showText,params:[`Successfully changed to ${which} mode.`, Colors.GREEN],noAnim:true});
        this.addAnimation(animation);
        this.endDrawLoop(callback);
        if (!calledFromCallback || !this.paused) {
            this.stepForward();
        }
        return true;
    }


    setRoot(newRoot) {
        let oldRoot = this.root;
        this.root = newRoot;
        return [oldRoot];
    }
    undo_setRoot(oldRoot) {
        this.root = oldRoot;
    }

    setLeft(parent, newLeft) {
        let oldLeft = parent.left;
        parent.left = newLeft;
        return [parent, oldLeft];
    }
    undo_setLeft(parent, oldLeft) {
        parent.left = oldLeft;
    }

    setRight(parent, newRight) {
        let oldRight = parent.right;
        parent.right = newRight;
        return [parent, oldRight];
    }
    undo_setRight(parent, oldRight) {
        parent.right = oldRight;
    }

    setHighlighter(node,color = Colors.BLUE) {
        let oldTarget = this.highlighter.target;
        let oldColor = this.highlighter.highlightColor;
        this.highlighter.setTarget(node, node === this.rootPointerPos ? this.constructor.ROOT_HIGHLIGHT_DIAMETER/2 : this.constructor.ELEMENT_SIZE/2);
        this.highlighter.highlightColor = color;
        if (node) {
            this.highlighter.addOnStop((highlighter) => {
                this.doneAnimating(0, "setHighlighter"+(node ? node.data : ""));
            });
        }
        return [oldTarget, oldColor];
    }
    undo_setHighlighter(oldTarget, oldColor) {
        this.highlighter.setTarget(oldTarget, oldTarget === this.rootPointerPos ? this.constructor.ROOT_HIGHLIGHT_DIAMETER/2 : this.constructor.ELEMENT_SIZE/2);
        this.highlighter.highlightColor = oldColor;
        if (oldTarget) {
            let stopID = ++this.stopID;
            this.highlighter.addOnStop((highlighter) => {
                this.stopDrawing(stopID);
            });
        }
    }
    redo_setHighlighter(node, color = Colors.BLUE) {
        let oldTarget = this.highlighter.target;
        let oldColor = this.highlighter.highlightColor;
        this.highlighter.setTarget(node, node === this.rootPointerPos ? this.constructor.ROOT_HIGHLIGHT_DIAMETER/2 : this.constructor.ELEMENT_SIZE/2);
        this.highlighter.highlightColor = color;
        if (node) {
            let stopID = ++this.stopID;
            this.highlighter.addOnStop((highlighter) => {
                this.stopDrawing(stopID);
            });
        }
        return [oldTarget, oldColor];
    }

    getInOrder(recalculate) {
        return this.inOrder = (recalculate ? this.getInOrderRecursive(this.root, 0, []) : this.inOrder);
    }
    getInOrderRecursive(curr, depth, list) {
        if (curr) {
            this.getInOrderRecursive(curr.left, depth + 1, list);
            curr.depth = depth;
            list.push(curr);
            this.getInOrderRecursive(curr.right, depth + 1, list);
        }
        return list;
    }

    shiftByInOrder() {
        let order = this.getInOrder(true);
        let oldPositions = order.map(node => [node.desiredX - ((this.width - this.constructor.ELEMENT_SIZE)/2),node.desiredY]);
        let centerIndex = order.indexOf(this.root);
        let displaced = null;
        // console.log(centerIndex);
        order.forEach((node, i) => {
            // console.log(node.data,":",i - centerIndex, ((this.width - this.constructor.ELEMENT_SIZE)/2), node.constructor.HSPACE);
            node.shiftX(((this.width - this.constructor.ELEMENT_SIZE)/2) + (i - centerIndex) * node.constructor.HSPACE);
            node.setY(this.getNodeY(node.depth));
            if ((!displaced && node.displacement()) || (displaced && node.displacement() > displaced.displacement())) {
                displaced = node;
            }
        });
        if (!displaced) {
            this.doneAnimating(0, "shift by order none displaced");
        } else {
            displaced.addOnStop((element) => {
                this.doneAnimating(0, "shift by order:end with "+element.data);
            });
        }
        return [order, oldPositions];
    }
    undo_shiftByInOrder(order, oldPositions) {
        let stopID = ++this.stopID;
        if (order) {
            // console.log(oldPositions);
            let displaced = null;
            order.forEach((node, i) => {
                node.shift(((this.width - this.constructor.ELEMENT_SIZE)/2) + oldPositions[i][0], oldPositions[i][1]);
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
    redo_shiftByInOrder() {
        let order = this.getInOrder(true);
        let oldPositions = order.map(node => [node.desiredX - ((this.width - this.constructor.ELEMENT_SIZE)/2),node.desiredY]);
        let centerIndex = order.indexOf(this.root);
        let displaced = null;
        // console.log(centerIndex);
        order.forEach((node, i) => {
            // console.log(node.data,":",i - centerIndex, ((this.width - this.constructor.ELEMENT_SIZE)/2), node.constructor.HSPACE);
            node.shiftX(((this.width - this.constructor.ELEMENT_SIZE)/2) + (i - centerIndex) * node.constructor.HSPACE);
            node.setY(this.getNodeY(node.depth));
            if ((!displaced && node.displacement()) || (displaced && node.displacement() > displaced.displacement())) {
                let stopID = ++this.stopID;
                node.addOnStop((element) => {
                    this.stopDrawing(stopID);
                });
                displaced = node;
            }
        });
        if (!displaced) {
            let stopID = ++this.stopID;
            this.stopDrawing(stopID);
        }
        return [order, oldPositions];
    }

    insertRecursive(curr, value) {
        let animation = [];
        let justAdded = false;
        let added = false;
        animation.push({method:this.setHighlighter,params:[curr],customEnd:curr!==null,noAnim:curr===null,isBackStep:true,customUndoEnd:true,customRedoEnd:curr!==null,returnsUndoData:true});
        if (!curr) {
            animation.push({method:this.showText,params:[`Reached null: ${value} not found in tree`],isForwardStep:true,});
            curr = new BSTNode({data: value});
            animation.push({method:this.makeNode,params:[curr],explanation:`Create value: ${value}`,isAnimationStep:true});
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
                animation.push({method:this.shiftByInOrder,testsWindowSize:true,explanation:`Add node:${value} to left of node:${curr.data}`,customEnd:true,isAnimationStep:true,returnsUndoData:true});
            }
            added = nodeAdded;
        } else if (value > curr.data) {
            animation.push({method:this.showText,params:[`${value} > ${curr.data}: look to right subtree`],quick:true,isForwardStep:true,customRedoEnd:true,});
            let [recurredAnimation, newRight, nodeJustAdded, nodeAdded] = this.insertRecursive(curr.right, value);
            animation.push(...recurredAnimation);
            animation.push({method:this.setHighlighter,params:[curr],customEnd:true,isBackStep:true,customUndoEnd:true,customRedoEnd:true,returnsUndoData:true,});
            animation.push({method:this.setRight,params:[curr, newRight],explanation:`${curr.right ? "Res" : "S"}et right pointer to node containing ${newRight.data}`,quick:true,returnsUndoData:true,isForwardStep:true,customRedoEnd:true,});
            if (nodeJustAdded) {
                animation.push({method:this.shiftByInOrder,testsWindowSize:true,explanation:`Add node:${value} to right of node:${curr.data}`,customEnd:true,isAnimationStep:true,returnsUndoData:true});
            }
            added = nodeAdded;
        }
        return [animation, curr, justAdded, added];
    }

    makeNode(newTemp) {
        this.tempNode = newTemp;
        this.tempNode.goTo(20,20);
    }
    undo_makeNode(data, parent) {
        this.tempNode = null;
    }

    deleteRecursive(curr, value) {
        let animation = [];
        let justDeleted = false;
        let deleted = false;
        animation.push({method:this.setHighlighter,params:[curr],customEnd:curr!==null,noAnim:curr===null,isBackStep:true,customUndoEnd:true,customRedoEnd:curr!==null,returnsUndoData:true});
        if (!curr) {
            animation.push({method:this.showText,params:[`Reached null: ${value} not found in tree`],quick:true,isForwardStep:true,});
        } else if (value === curr.data) {
            animation.push({method:this.showText,params:[`${value} == ${curr.data}: value found in tree`],isForwardStep:true,customRedoEnd:true,});
            // animation.push({method:this.showText,params:[`Deleting ${value} from BST.`],noAnim:true,isAnimationStep:true,});
            if (!curr.left || !curr.right) {
                if (!curr.left && !curr.right) {
                    animation.push({method:this.unmakeNode,params:[curr],explanation:`Remove leaf node:${value} from BST`,customEnd:true,isAnimationStep:true,returnsUndoData:true,customUndoEnd:true,customRedoEnd:true});
                    curr = null;
                } else {
                    animation.push({method:this.unmakeNode,params:[curr],explanation:`Replace node:${value} with single child:${curr.left ? curr.left.data : curr.right.data}`,customEnd:true,isAnimationStep:true,returnsUndoData:true,customUndoEnd:true,customRedoEnd:true});
                    curr = curr.left || curr.right;
                }
                animation.push({method:this.setHighlighter,params:[null],customUndoEnd:true,returnsUndoData:true,});
                justDeleted = true;
            } else {
                animation.push({method:this.showText,params:[`2 children: finding ${this.predSuccMode ? "predecessor" : "successor"}`],quick:true,customRedoEnd:true,});
                // console.log([`find${this.predSuccMode ? "Predecessor" : "Successor"}Recursive`], this[`find${this.predSuccMode ? "Predecessor" : "Successor"}Recursive`], [`${this.predSuccMode ? "left" : "right"}`]);
                let [recurredAnimation, newChild, justFoundPredSucc, predSuccValue] = this[`find${this.predSuccMode ? "Predecessor" : "Successor"}Recursive`](curr[`${this.predSuccMode ? "left" : "right"}`]);
                animation.push(...recurredAnimation);
                animation.push({method:this.setHighlighter,params:[curr],customEnd:true,isBackStep:true,customUndoEnd:true,customRedoEnd:true,returnsUndoData:true,});
                animation.push({method:this[`set${this.predSuccMode ? "Left" : "Right"}`],params:[curr,newChild],
                        explanation:`${curr[`${this.predSuccMode ? "left" : "right"}`] ? "Res" : "S"}et ${this.predSuccMode ? "left" : "right"} pointer to ${newChild ? `node containing ${newChild.data}` : "null"}`,
                        customEnd:false,quick:true,returnsUndoData:true,isForwardStep:true,customRedoEnd:true});
                animation.push({method:this.pullTempDataToCurr,params:[curr],explanation:`Set curr data to dummy data from ${this.predSuccMode ? "predecessor" : "successor"}`,customEnd:true,isAnimationStep:true,customUndoEnd:true,customRedoEnd:true,returnsUndoData:true,});
                animation.push({method:this.clearTemp,noAnim:true,returnsUndoData:true,});
                if (justFoundPredSucc) {
                    animation.push({method:this.shiftByInOrder,testsWindowSize:true,explanation:`Remove ${this.predSuccMode ? "predecessor" : "successor"}:${predSuccValue} of node:${curr.data}`,customEnd:true,isAnimationStep:true,returnsUndoData:true});
                }
            }
            animation.push({method:this.sizeDecr,noAnim:true,});
            deleted = true;
        } else if (value < curr.data) {
            animation.push({method:this.showText,params:[`${value} < ${curr.data}: look to left subtree`],quick:true,isForwardStep:true,customRedoEnd:true,});
            let [recurredAnimation, newLeft, nodeJustDeleted, nodeDeleted] = this.deleteRecursive(curr.left, value);
            animation.push(...recurredAnimation);
            animation.push({method:this.setHighlighter,params:[curr],customEnd:true,isBackStep:true,customUndoEnd:true,customRedoEnd:true,returnsUndoData:true,});
            animation.push({method:this.setLeft,params:[curr, newLeft],explanation:`${curr.left ? "Res" : "S"}et left pointer to ${newLeft ? `node containing ${newLeft.data}` : "null"}`,quick:true,returnsUndoData:true,isForwardStep:true,customRedoEnd:true});
            if (nodeJustDeleted) {
                animation.push({method:this.clearTemp,noAnim:true,returnsUndoData:true,});
                animation.push({method:this.shiftByInOrder,testsWindowSize:true,explanation:`Remove node:${value} from left of node:${curr.data}`,customEnd:true,isAnimationStep:true,returnsUndoData:true});
            }
            deleted = nodeDeleted;
        } else if (value > curr.data) {
            animation.push({method:this.showText,params:[`${value} > ${curr.data}: look to right subtree`],quick:true,isForwardStep:true,customRedoEnd:true,});
            let [recurredAnimation, newRight, nodeJustDeleted, nodeDeleted] = this.deleteRecursive(curr.right, value);
            animation.push(...recurredAnimation);
            animation.push({method:this.setHighlighter,params:[curr],customEnd:true,isBackStep:true,customUndoEnd:true,customRedoEnd:true,returnsUndoData:true,});
            animation.push({method:this.setRight,params:[curr, newRight],explanation:`${curr.right ? "Res" : "S"}et right pointer to ${newRight ? `node containing ${newRight.data}` : "null"}`,quick:true,returnsUndoData:true,isForwardStep:true,customRedoEnd:true,});
            if (nodeJustDeleted) {
                animation.push({method:this.clearTemp,noAnim:true,returnsUndoData:true,});
                animation.push({method:this.shiftByInOrder,testsWindowSize:true,explanation:`Remove node:${value} from right of node:${curr.data}`,customEnd:true,isAnimationStep:true,returnsUndoData:true});
            }
            deleted = nodeDeleted;
        }
        return [animation, curr, justDeleted, deleted];
    }

    findPredecessorRecursive(curr) {
        let animation = [];
        let justFound = false;
        let predecessorValue = null;
        animation.push({method:this.setHighlighter,params:[curr],customEnd:true,isBackStep:true,customUndoEnd:true,customRedoEnd:true,returnsUndoData:true});
        if (!curr.right) {
            animation.push({method:this.showText,params:[`Predecessor found: ${curr.data}`],quick:true,isForwardStep:true,});
            animation.push({method:this.unmakeNode,params:[curr],explanation:`${curr.left ? `Replace predecessor with left child:${curr.left.data}` : `Remove predecessor`}`,customEnd:true,isAnimationStep:true,returnsUndoData:true,customUndoEnd:true,customRedoEnd:true});
            animation.push({method:this.setHighlighter,params:[null],customUndoEnd:true,returnsUndoData:true,});
            // animation.push({method:this.setRight,params:[curr, null],noAnim:true,returnsUndoData:true,isForwardStep:true,customRedoEnd:true,});
            predecessorValue = curr.data;
            curr = curr.left;
            justFound = true;
        } else {
            animation.push({method:this.showText,params:[`Node ${curr.data} has right child, look right for successor`],quick:true,isForwardStep:true,customRedoEnd:true,});
            let [recurredAnimation, newRight, justFoundPredSucc, predValue] = this.findPredecessorRecursive(curr.right);
            animation.push(...recurredAnimation);
            animation.push({method:this.setHighlighter,params:[curr],customEnd:true,isBackStep:true,customUndoEnd:true,customRedoEnd:true,returnsUndoData:true,});
            animation.push({method:this.setRight,params:[curr,newRight],explanation:`Reset right pointer to ${newRight ? `node containing ${newRight.data}` : "null"}`,quick:true,returnsUndoData:true,isForwardStep:true,customRedoEnd:true});
            // animation.push({method:this.pullTempDataToCurr,params:[curr],customEnd:true,isAnimationStep:true,customUndoEnd:true,customRedoEnd:true,returnsUndoData:true,});
            // animation.push({method:this.clearTemp,noAnim:true,returnsUndoData:true,});
            if (justFoundPredSucc) {
                animation.push({method:this.shiftByInOrder,testsWindowSize:true,explanation:`Remove predecessor:${predValue} of node:${curr.data}`,customEnd:true,isAnimationStep:true,returnsUndoData:true});
            }
            predecessorValue = predValue;
        }
        return [animation, curr, justFound, predecessorValue];
    }

    findSuccessorRecursive(curr) {
        let animation = [];
        let justFound = false;
        let successorValue = null;
        animation.push({method:this.setHighlighter,params:[curr],customEnd:true,isBackStep:true,customUndoEnd:true,customRedoEnd:true,returnsUndoData:true});
        if (!curr.left) {
            animation.push({method:this.showText,params:[`Successor found: ${curr.data}`],quick:true,isForwardStep:true,});
            animation.push({method:this.unmakeNode,params:[curr],explanation:`${curr.right ? `Replace successor with right child:${curr.right.data}` : `Remove successor`}`,customEnd:true,isAnimationStep:true,returnsUndoData:true,customUndoEnd:true,customRedoEnd:true});
            animation.push({method:this.setHighlighter,params:[null],customUndoEnd:true,returnsUndoData:true,});
            // animation.push({method:this.setRight,params:[curr, null],noAnim:true,returnsUndoData:true,isForwardStep:true,customRedoEnd:true,});
            successorValue = curr.data;
            curr = curr.right;
            justFound = true;
        } else {
            animation.push({method:this.showText,params:[`Node ${curr.data} has left child, look left for successor`],quick:true,isForwardStep:true,customRedoEnd:true,});
            let [recurredAnimation, newLeft, justFoundPredSucc, succValue] = this.findSuccessorRecursive(curr.left);
            animation.push(...recurredAnimation);
            animation.push({method:this.setHighlighter,params:[curr],customEnd:true,isBackStep:true,customUndoEnd:true,customRedoEnd:true,returnsUndoData:true,});
            animation.push({method:this.setLeft,params:[curr,newLeft],explanation:`Reset left pointer to ${newLeft ? `node containing ${newLeft.data}` : "null"}`,quick:true,returnsUndoData:true,isForwardStep:true,customRedoEnd:true});
            // animation.push({method:this.pullTempDataToCurr,params:[curr],customEnd:true,isAnimationStep:true,customUndoEnd:true,customRedoEnd:true,returnsUndoData:true,});
            // animation.push({method:this.clearTemp,noAnim:true,returnsUndoData:true,});
            if (justFoundPredSucc) {
                animation.push({method:this.shiftByInOrder,testsWindowSize:true,explanation:`Remove successor:${succValue} of node:${curr.data}`,customEnd:true,isAnimationStep:true,returnsUndoData:true});
            }
            successorValue = succValue;
        }
        return [animation, curr, justFound, successorValue];
    }

    unmakeNode(node) {
        this.tempNode = node;
        let oldPosition = [node.desiredX, node.desiredY];
        this.tempNode.shift(20,20);
        this.tempNode.addOnStop((element) => {
            // element.frozen = true;
            this.doneAnimating(0, "unmake"+element.data);
        });
        return [oldPosition];
    }
    undo_unmakeNode(oldPosition) {
        // this.tempNode.frozen = false;
        this.tempNode.shift(...oldPosition);
        let stopID = ++this.stopID;
        this.tempNode.addOnStop(() => {
            this.stopDrawing(stopID);
        });
        this.tempNode = null;
    }
    redo_unmakeNode(node) {
        this.tempNode = node;
        let oldPosition = [node.desiredX, node.desiredY];
        this.tempNode.shift(20,20);
        let stopID = ++this.stopID;
        this.tempNode.addOnStop((element) => {
            // element.frozen = true;
            this.stopDrawing(stopID);
        });
        return [oldPosition];
    }

    pullTempDataToCurr(node) {
        this.dataMover = new AttractedHighlightableObject(20+this.constructor.ELEMENT_SIZE/2,20+this.constructor.ELEMENT_SIZE/2,
                {
                    value:this.tempNode.data,
                    highlightInnerRadius: this.constructor.ELEMENT_SIZE/2,
                }
            );
        let oldData = node.data;
        let nodePos = [node.currentX+this.constructor.ELEMENT_SIZE/2, node.currentY+this.constructor.ELEMENT_SIZE/2]
        this.dataMover.shift(...nodePos);
        this.dataMover.addOnStop((element) => {
            this.doneAnimating(0,"move data"+element.value+"to"+oldData);
            node.data = element.value;
            this.dataMover = null;
        });
        return [node, oldData, nodePos];
    }
    undo_pullTempDataToCurr(node, oldData, nodePos) {
        this.dataMover = new AttractedHighlightableObject(...nodePos,
                {
                    value:this.tempNode.data,
                    highlightInnerRadius: this.constructor.ELEMENT_SIZE/2,
                }
            );
        this.dataMover.shift(20+this.constructor.ELEMENT_SIZE/2,20+this.constructor.ELEMENT_SIZE/2);
        node.data = oldData;
        let stopID = ++this.stopID;
        this.dataMover.addOnStop((element) => {
            this.stopDrawing(stopID);
            this.dataMover = null;
        });
    }
    redo_pullTempDataToCurr(node) {
        this.dataMover = new AttractedHighlightableObject(20+this.constructor.ELEMENT_SIZE/2,20+this.constructor.ELEMENT_SIZE/2,
                {
                    value:this.tempNode.data,
                    highlightInnerRadius: this.constructor.ELEMENT_SIZE/2,
                }
            );
        let oldData = node.data;
        let nodePos = [node.currentX+this.constructor.ELEMENT_SIZE/2, node.currentY+this.constructor.ELEMENT_SIZE/2]
        this.dataMover.shift(...nodePos);
        let stopID = ++this.stopID;
        this.dataMover.addOnStop((element) => {
            this.stopDrawing(stopID);
            node.data = element.value;
            this.dataMover = null;
        });
        return [node, oldData, nodePos];
    }

    findRecursive(curr, value) {
        let animation = [];
        animation.push({method:this.setHighlighter,params:[curr],customEnd:curr!==null,noAnim:curr===null,isBackStep:true,customUndoEnd:true,customRedoEnd:curr!==null,returnsUndoData:true});
        if (!curr) {
            animation.push({method:this.showText,params:[`Reached null: ${value} not found in tree`],quick:true,isForwardStep:true,});
            animation.push({method:this.showText,params:[`${value} is not in BST.`, Colors.RED],noAnim:true,isBackStep:true,});
        } else if (value === curr.data) {
            animation.push({method:this.showText,params:[`${value} == ${curr.data}: value found in tree`],quick:true,isForwardStep:true,customRedoEnd:true,});
            animation.push({method:this.showText,params:[`${value} was found in BST.`, Colors.GREEN],noAnim:true,isBackStep:true,});
        } else if (value < curr.data) {
            animation.push({method:this.showText,params:[`${value} < ${curr.data}: look to left subtree`],quick:true,isForwardStep:true,customRedoEnd:true,});
            let [recurredAnimation] = this.findRecursive(curr.left, value);
            animation.push(...recurredAnimation);
        } else if (value > curr.data) {
            animation.push({method:this.showText,params:[`${value} > ${curr.data}: look to right subtree`],quick:true,isForwardStep:true,customRedoEnd:true,});
            let [recurredAnimation] = this.findRecursive(curr.right, value);
            animation.push(...recurredAnimation);
        }
        return [animation];
    }

    printInOrderRecursive(curr, list) {
        let animation = [];
        if (curr) {
            animation.push({method:this.setHighlighter,params:[curr],customEnd:true,isAnimationStep:true,customUndoEnd:true,customRedoEnd:true,returnsUndoData:true});
            let [leftAnimation] = this.printInOrderRecursive(curr.left, list);
            animation.push(...leftAnimation);
            animation.push({method:this.setHighlighter,params:[curr],customEnd:true,isBackStep:false,customUndoEnd:true,customRedoEnd:true,returnsUndoData:true,});
            list.push(curr.data);
            animation.push({method:this.setHighlighter,params:[curr, Colors.GREEN],explanation:`[${list.join(",    ")}]`,customEnd:true,isAnimationStep:true,customUndoEnd:true,customRedoEnd:true,returnsUndoData:true,});
            animation.push({method:this.noAction,quick:true});
            animation.push({method:this.setHighlighter,params:[curr, Colors.BLUE],customEnd:true,isBackStep:false,customUndoEnd:true,customRedoEnd:true,returnsUndoData:true,});
            let [rightAnimation] = this.printInOrderRecursive(curr.right, list);
            animation.push(...rightAnimation);
        }
        return [animation];
    }

    switchMode(which) {
        this.predSuccMode = which === "Predecessor";
    }
    undo_switchMode(which) {
        this.predSuccMode = which !== "Predecessor";
    }

    clearTemp() {
        let oldTemp = this.tempNode;
        this.tempNode = null;
        return [oldTemp];
    }
    undo_clearTemp(oldTemp) {
        this.tempNode = oldTemp;
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
        let y = depth * (this.constructor.ELEMENT_SIZE + this.constructor.VERTICAL_SPACING);
        return y + this.y + this.constructor.ROOT_SIZE+10;
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

    getRootPointerX() {
        return Math.max(this.width / 2 - this.constructor.ROOT_SIZE - 50, this.constructor.ROOT_X_MIN);
    }

    getHeight() {
        return this.getHeightRecursive(this.root);
    }
    getHeightRecursive(curr) {
        if (curr) {
            return Math.max(this.getHeightRecursive(curr.left),this.getHeightRecursive(curr.right)) + 1;
        }
        return -1;
    }

    getMaxY() {
        return this.getNodeY(Math.max(this.getHeight(), 1)) + 20;
    }

    getMaxWidth() {
        if (!this.root) {
            return this.constructor.ROOT_SIZE + 80;
        }
        let order = this.getInOrder(true);
        let centerIndex = order.indexOf(this.root);
        let leftOffset = centerIndex * order[0].constructor.HSPACE;
        let rightOffset = (order.length - 1 - centerIndex) * order[0].constructor.HSPACE;
        return Math.max(leftOffset,rightOffset)*2+order[0].constructor.SIZE;
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
            this.getInOrder(true).forEach((node) => {
                this.updateNode(node, animationSpeed, p5);
            });
            this.updateNode(this.tempNode, animationSpeed, p5);
            this.highlighter.update(animationSpeed, p5);
            this.updateNode(this.dataMover, animationSpeed, p5);
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
        let rootX = this.getRootPointerX();
        p5.text("Root:",rootX - 40,this.constructor.ROOT_Y,this.constructor.ROOT_SIZE + 10,this.constructor.ROOT_SIZE);
        p5.square(rootX,this.constructor.ROOT_Y,this.constructor.ROOT_SIZE);
        if (this.root) {
            p5.stroke(Colors.BLUE);
            p5.fill(Colors.BLUE);
            p5.circle(rootX + this.constructor.ROOT_SIZE / 2, this.constructor.ROOT_Y + this.constructor.ROOT_SIZE / 2, 5);
            p5.line(rootX + this.constructor.ROOT_SIZE / 2, this.constructor.ROOT_Y + this.constructor.ROOT_SIZE / 2, this.root.currentX + this.constructor.ELEMENT_SIZE / 2, this.root.currentY);
            // p5.rect(this.root.currentX + this.constructor.ELEMENT_SIZE / 2 - 3, this.root.currentY - 3, 6,6);
        } else {
            p5.line(rootX,this.constructor.ROOT_Y,rootX + this.constructor.ROOT_SIZE,this.constructor.ROOT_Y + this.constructor.ROOT_SIZE);
        }


        this.getInOrder(true).forEach((node) => {
            node.draw(p5);
        });
        if (this.tempNode) {
            this.tempNode.draw(p5);
        }
        this.highlighter.draw(p5);
        if (this.dataMover) {
            this.dataMover.draw(p5);
        }

        p5.pop();
    }

    mousePressed(p5) {
        // this.drawingBeforeMouseDown = this.drawing;
        let pressedNode = this.getNodeAtPos(p5.mouseX, p5.mouseY);
        if (pressedNode) {
            this.animator.loop();
            this.pin(pressedNode, p5.mouseX,p5.mouseY);
            //console.log(pressedNode,`\nleft:`,pressedNode. && pressedNode..data,`\nright:`,pressedNode. && pressedNode..data);
        }
        return false;
    }

    mouseReleased(p5) {
        if (this.pinnedNode) {
            this.pinnedNode.addOnStop((element) => {
                if (!this.animating) {
                    this.ensureDrawn();
                }
            });
            this.unpin();
        } else {
            // this.ensureDrawn();
        }
        return false;
    }

    windowResized(p5, height, numScrollbars) {
        super.windowResized(p5, height, numScrollbars, this.getMaxY(),() => {
            this.rootPointerPos.currentX = this.getRootPointerX() + this.constructor.ROOT_SIZE / 2 - this.constructor.ROOT_HIGHLIGHT_DIAMETER / 2;
            let shiftTemp = this.tempNode && this.tempNode.desiredX === 20 && this.tempNode.desiredY === 20;
            if (this.root) {
                let order = this.getInOrder(true);
                let centerIndex = order.indexOf(this.root);
                order.forEach((node, i) => {
                    node.shiftX(((this.width - this.constructor.ELEMENT_SIZE)/2) + (i - centerIndex) * node.constructor.HSPACE);
                    node.setY(this.getNodeY(node.depth));
                });
            }
            if (shiftTemp) {
                this.tempNode.shift(20,20);
            }
        }, this.getMaxWidth());
    }
}


class BSTNode extends TreeNode {
    static CAN_DRAG = true;
    static SIZE = BST.ELEMENT_SIZE;
    static VSPACE = BST.ELEMENT_SIZE + BST.VERTICAL_SPACING;
    static HSPACE = BST.ELEMENT_SIZE + BST.HORIZONTAL_SPACING;

    constructor({x=20,y=20, data} = {}) {
        super(x,y, data);

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
