import { ListVisualizer } from '../';
import { DoublyLinkedList } from 'animation';
import './doubly-linked-list.scss';


export default class DoublyLinkedListVisualizer extends ListVisualizer {
    static VISUALIZATION_CLASS = DoublyLinkedList;

    constructor(props) {
        super(props);
        super.class = 'doublylinkedlist';
        super.addControlLabel("DoublyLinkedList");
    }

    componentDidMount() {
        super.componentDidMount(() => {
            this.list = new DoublyLinkedList(this.animator);
        });
    }
}
