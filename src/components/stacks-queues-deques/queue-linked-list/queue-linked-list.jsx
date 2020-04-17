import { QueueVisualizer } from '../';
import { QueueLinkedList } from 'animation';
import './queue-linked-list.scss';


export default class QueueLinkedListVisualizer extends QueueVisualizer {
    static VISUALIZATION_CLASS = QueueLinkedList;

    constructor(props) {
        super(props);
        super.class = 'queue-linkedlist';
        super.addControlLabel("Queue (LinkedList)");
    }

    componentDidMount() {
        super.componentDidMount(() => {
            this.queue = new QueueLinkedList(this.animator);
        });
    }
}
