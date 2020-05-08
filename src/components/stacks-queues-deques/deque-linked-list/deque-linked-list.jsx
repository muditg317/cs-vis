import { DequeVisualizer } from '../';
import { DequeLinkedList } from 'animation';
import './deque-linked-list.scss';


export default class DequeLinkedListVisualizer extends DequeVisualizer {
    static VISUALIZATION_CLASS = DequeLinkedList;
    static DIV_CLASS = "deque-linkedlist";
    static NAME = "Deque (Linked List)";
}
