import { HeapVisualizer } from '../';
import { Heap } from 'animation';
import './heap.scss';


export default class HeapPQVisualizer extends HeapVisualizer {
    static VISUALIZATION_CLASS = Heap;
    static DIV_CLASS = "heap-pq";
    static NAME = "Heap / Priority Queue";
}
