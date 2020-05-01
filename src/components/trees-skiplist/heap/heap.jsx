import { HeapVisualizer } from '../';
import { Heap } from 'animation';
import './heap.scss';


export default class HeapPQVisualizer extends HeapVisualizer {
    static VISUALIZATION_CLASS = Heap;

    constructor(props) {
        super(props);
        super.class = 'heap-pq';
        super.addControlLabel("Heap / Priority Queue");
    }

    componentDidMount() {
        super.componentDidMount(() => {
            this.heap = new Heap(this.animator);
        });
    }
}
