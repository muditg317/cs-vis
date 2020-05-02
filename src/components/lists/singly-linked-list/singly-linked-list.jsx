import { ListVisualizer } from '../';
import { SinglyLinkedList } from 'animation';
import './singly-linked-list.scss';


export default class SinglyLinkedListVisualizer extends ListVisualizer {
    static VISUALIZATION_CLASS = SinglyLinkedList;
    static DIV_CLASS = "singlylinkedlist";
    static NAME = "SinglyLinkedList";
}
