import { TreeVisualizer } from '../';
import { BTree } from 'animation';
import './btree.scss';


export default class BTreeVisualizer extends TreeVisualizer {
    static VISUALIZATION_CLASS = BTree;

    constructor(props) {
        super(props);
        super.class = 'btree';
        super.addControlLabel("2-4 Tree");
    }

    componentDidMount() {
        super.componentDidMount(() => {
            this.tree = new BTree(this.animator);
        });
    }
}
