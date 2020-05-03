import { QuickVisualizer } from '../';
import { QuickSort } from 'animation';
import './quick-sort.scss';


export default class QuickSortVisualizer extends QuickVisualizer {
    static VISUALIZATION_CLASS = QuickSort;
    static DIV_CLASS = "quick-sort";
    static NAME = "Quick Sort";
}
