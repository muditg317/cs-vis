import { QueueVisualizer } from '../';
import { QueueArray } from 'animation';
import './queue-array.scss';

export default class QueueArrayVisualizer extends QueueVisualizer {
    static VISUALIZATION_CLASS = QueueArray;
    static DIV_CLASS = "queue-array";
    static NAME = "Queue (Array)";
}
