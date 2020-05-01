import { TreeVisualizer } from '../';
import { SplayTree } from 'animation';
import './splaytree.scss';


export default class QueueLinkedListVisualizer extends TreeVisualizer {
    static VISUALIZATION_CLASS = SplayTree;

    constructor(props) {
        super(props);
        super.class = 'splaytree';
        super.addControlLabel("SplayTree");
    }

    componentDidMount() {
        super.componentDidMount(() => {
            this.tree = new SplayTree(this.animator);
        });
    }
}
