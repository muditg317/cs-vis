import { StackVisualizer } from '../';
import { StackArray } from 'animation';
import './stack-array.scss';


export default class StackArrayVisualizer extends StackVisualizer {
    static VISUALIZATION_CLASS = StackArray;

    constructor(props) {
        super(props);
        super.class = 'stack-array';
        super.addControlLabel("Stack (Array)");
    }

    componentDidMount() {
        super.componentDidMount(() => {
            this.stack = new StackArray(this.animator);
        });
    }
}
