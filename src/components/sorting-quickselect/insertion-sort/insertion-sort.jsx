import { SortVisualizer } from '../';
import { InsertionSort } from 'animation';
import './insertion-sort.scss';


export default class InsertionSortVisualizer extends SortVisualizer {
    static VISUALIZATION_CLASS = InsertionSort;
    static DIV_CLASS = "insertion-sort";
    static NAME = "Insertion Sort";
}
