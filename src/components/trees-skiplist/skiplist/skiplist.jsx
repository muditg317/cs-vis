import { SkipListVisualizer } from '../';
import { SkipList } from 'animation';
import './skiplist.scss';


export default class SkipListVisualizer extends SkipListADTVisualizer {
    static VISUALIZATION_CLASS = SkipList;

    constructor(props) {
        super(props);
        super.class = 'skiplist';
        super.addControlLabel("SkipList");
    }

    componentDidMount() {
        super.componentDidMount(() => {
            this.skiplist = new SkipList(this.animator);
        });
    }
}
