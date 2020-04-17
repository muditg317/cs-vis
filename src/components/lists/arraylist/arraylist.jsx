import { ListVisualizer } from '../';
import { ArrayList } from 'animation';
import './arraylist.scss';


export default class ArrayListVisualizer extends ListVisualizer {
    static VISUALIZATION_CLASS = ArrayList;

    constructor(props) {
        super(props);
        super.class = 'arraylist';
        super.addControlLabel("ArrayList");
    }

    componentDidMount() {
        super.componentDidMount(() => {
            this.list = new ArrayList(this.animator);
        });
    }
}
