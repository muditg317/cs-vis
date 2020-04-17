import { ListVisualizer } from '../';
import { SinglyLinkedList } from 'animation';
import './singly-linked-list.scss';


export default class SinglyLinkedListVisualizer extends ListVisualizer {
    static VISUALIZATION_CLASS = SinglyLinkedList;

    constructor(props) {
        super(props);
        super.class = 'singlylinkedlist';
        super.addControlLabel("SinglyLinkedList");
    }

    componentDidMount() {
        super.componentDidMount(() => {
            this.list = new SinglyLinkedList(this.animator);
        });
    }
}
