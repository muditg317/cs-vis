import { StackVisualizer } from '../';
import { StackLinkedList } from 'animation';
import './stack-linked-list.scss';


export default class StackLinkedListVisualizer extends StackVisualizer {
    static VISUALIZATION_CLASS = StackLinkedList;
    static DIV_CLASS = "stack-linkedlist";
    static NAME = "Stack (LinkedList)";
}
