import { SortVisualizer } from '../';
import { LSDRadixSort } from 'animation';
import './lsd-radix-sort.scss';


export default class LSDRadixSortVisualizer extends SortVisualizer {
    static VISUALIZATION_CLASS = LSDRadixSort;
    static DIV_CLASS = "lsd-radix-sort";
    static NAME = "LSD Radix Sort";
}
