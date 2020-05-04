import { GraphVisualizer } from '../';
import GraphControls from 'components/graph-visualizer-controls';

import { DFS } from 'animation';
import './dfs.scss';


export default class DFSVisualizer extends GraphVisualizer {
    static VISUALIZATION_METHODS = ["toggleDFStype", "toggleUndirectedDirected"];

    static VISUALIZATION_CLASS = DFS;
    static DIV_CLASS = "dfs";
    static NAME = "Depth-First Search";

    addControls() {
        GraphControls.addStartVertexField_and_runButton(this);
        GraphControls.addDFStypeRadio(this);
        GraphControls.addNewGraphButtons(this);
        GraphControls.addDirectedUndirectedRadio(this);
        GraphControls.addRepresentationRadio(this);
    }
}
