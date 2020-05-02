import { BubblingVisualizer } from '../';
import { BubbleSort } from 'animation';
import './bubble-sort.scss';


export default class BubbleSortVisualizer extends BubblingVisualizer {
    static VISUALIZATION_CLASS = BubbleSort;
    static DIV_CLASS = "bubble-sort";
    static NAME = "Bubble Sort";
}
