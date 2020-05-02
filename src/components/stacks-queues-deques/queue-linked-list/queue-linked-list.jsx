import { QueueVisualizer } from '../';
import { QueueLinkedList } from 'animation';
import './queue-linked-list.scss';


export default class QueueLinkedListVisualizer extends QueueVisualizer {
    static VISUALIZATION_CLASS = QueueLinkedList;
    static DIV_CLASS = "queue-linkedlist";
    static NAME = "Queue (LinkedList)";
}
