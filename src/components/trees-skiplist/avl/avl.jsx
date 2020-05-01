import { TreeVisualizer } from '../';
import { AVL } from 'animation';
import './avl.scss';


export default class AVLVisualizer extends TreeVisualizer {
    static VISUALIZATION_CLASS = AVL;

    constructor(props) {
        super(props);
        super.class = 'avl';
        super.addControlLabel("AVL");
    }

    componentDidMount() {
        super.componentDidMount(() => {
            this.tree = new AVL(this.animator);
        });
    }
}
