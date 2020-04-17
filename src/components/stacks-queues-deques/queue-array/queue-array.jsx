import { QueueVisualizer } from '../';
import { QueueArray } from 'animation';
import './queue-array.scss';


export default class QueueArrayVisualizer extends QueueVisualizer {
    static VISUALIZATION_CLASS = QueueArray;

    constructor(props) {
        super(props);
        super.class = 'queue-array';
        super.addControlLabel("Queue (Array)");
    }

    componentDidMount() {
        super.componentDidMount(() => {
            this.queue = new QueueArray(this.animator);
        });
    }
}
