import { DequeVisualizer } from '../';
import { DequeArray } from 'animation';
import './deque-array.scss';


export default class DequeArrayVisualizer extends DequeVisualizer {
    static VISUALIZATION_CLASS = DequeArray;
    static DIV_CLASS = "deque-array";
    static NAME = "Deque (Array)";
}
