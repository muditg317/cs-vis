import { ListVisualizer } from '../';
import { CircularSinglyLinkedList } from 'animation';
import './circular-singly-linked-list.scss';

export default class CircularSinglyLinkedListVisualizer extends ListVisualizer {
    static VISUALIZATION_CLASS = CircularSinglyLinkedList;

    constructor(props) {
        super(props);
        super.class = 'circularsinglylinkedlist';
        super.addControlLabel("CircularSinglyLinkedList");
    }

    componentDidMount() {
        super.componentDidMount(() => {
            this.list = new CircularSinglyLinkedList(this.animator);
        });
    }
}
