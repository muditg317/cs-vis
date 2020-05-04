import { GraphVisualizer } from '../';
import GraphControls from 'components/graph-visualizer-controls';

import { BFS } from 'animation';
import './bfs.scss';


export default class BFSVisualizer extends GraphVisualizer {
    static VISUALIZATION_METHODS = ["toggleUndirectedDirected"];

    static VISUALIZATION_CLASS = BFS;
    static DIV_CLASS = "bfs";
    static NAME = "Breadth-First Search";

    addControls() {
        GraphControls.addStartVertexField_and_runButton(this);
        GraphControls.addNewGraphButtons(this);
        GraphControls.addDirectedUndirectedRadio(this);
        GraphControls.addRepresentationRadio(this);
    }
}
