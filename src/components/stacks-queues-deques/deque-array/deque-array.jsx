import { DequeVisualizer } from '../';
import { DequeArray } from 'animation';
import './deque-array.scss';


export default class DequeArrayVisualizer extends DequeVisualizer {
    static VISUALIZATION_CLASS = DequeArray;

    constructor(props) {
        super(props);
        super.class = 'deque-array';
        super.addControlLabel("Deque (Array)");
    }

    componentDidMount() {
        super.componentDidMount(() => {
            this.deque = new DequeArray(this.animator);
        });
    }
}
