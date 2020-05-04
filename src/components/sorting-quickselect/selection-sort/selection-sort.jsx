import { SortVisualizer } from '../';
import { SelectionSort } from 'animation';
import './selection-sort.scss';


export default class SelectionSortVisualizer extends SortVisualizer {
    static VISUALIZATION_CLASS = SelectionSort;
    static DIV_CLASS = "selection-sort";
    static NAME = "Selection Sort";
}
