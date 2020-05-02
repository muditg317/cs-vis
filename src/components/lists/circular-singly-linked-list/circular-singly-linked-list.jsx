import { ListVisualizer } from '../';
import { CircularSinglyLinkedList } from 'animation';
import './circular-singly-linked-list.scss';

export default class CircularSinglyLinkedListVisualizer extends ListVisualizer {
    static VISUALIZATION_CLASS = CircularSinglyLinkedList;
    static DIV_CLASS = "circularsinglylinkedlist";
    static NAME = "CircularSinglyLinkedList";
}
