import { ListVisualizer } from '../';
import { DoublyLinkedList } from 'animation';
import './doubly-linked-list.scss';


export default class DoublyLinkedListVisualizer extends ListVisualizer {
    static VISUALIZATION_CLASS = DoublyLinkedList;
    static DIV_CLASS = "doublylinkedlist";
    static NAME = "DoublyLinkedList";
}
