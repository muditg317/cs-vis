import { SortVisualizer } from '../';
import { MergeSort } from 'animation';
import './merge-sort.scss';


export default class MergeSortVisualizer extends SortVisualizer {
    static VISUALIZATION_CLASS = MergeSort;
    static DIV_CLASS = "merge-sort";
    static NAME = "Merge Sort";
}
