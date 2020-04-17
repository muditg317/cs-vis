import { DequeVisualizer } from '../';
import { DequeLinkedList } from 'animation';
import './deque-linked-list.scss';


export default class DequeLinkedListVisualizer extends DequeVisualizer {
    static VISUALIZATION_CLASS = DequeLinkedList;

    constructor(props) {
        super(props);
        super.class = 'deque-linkedlist';
        super.addControlLabel("Deque (LinkedList)");
    }

    componentDidMount() {
        super.componentDidMount(() => {
            this.deque = new DequeLinkedList(this.animator);
        });
    }
}
