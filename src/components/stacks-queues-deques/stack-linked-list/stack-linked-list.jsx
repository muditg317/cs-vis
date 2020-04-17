import { StackVisualizer } from '../';
import { StackLinkedList } from 'animation';
import './stack-linked-list.scss';


export default class StackLinkedListVisualizer extends StackVisualizer {
    static VISUALIZATION_CLASS = StackLinkedList;

    constructor(props) {
        super(props);
        super.class = 'stack-linkedlist';
        super.addControlLabel("Stack (LinkedList)");
    }

    componentDidMount() {
        super.componentDidMount(() => {
            this.stack = new StackLinkedList(this.animator);
        });
    }
}
