import { TreeVisualizer } from '../';
import { BST } from 'animation';
import './bst.scss';


export default class BSTVisualizer extends TreeVisualizer {
    static VISUALIZATION_CLASS = BST;

    constructor(props) {
        super(props);
        super.class = 'bst';
        super.addControlLabel("Binary Search Tree");
    }

    componentDidMount() {
        super.componentDidMount(() => {
            this.deque = new BST(this.animator);
        });
    }
}
