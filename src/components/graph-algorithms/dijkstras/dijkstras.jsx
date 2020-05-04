import { GraphVisualizer } from '../';
import GraphControls from 'components/graph-visualizer-controls';

import { Dijkstras } from 'animation';
import './dijkstras.scss';


export default class DijkstrasVisualizer extends GraphVisualizer {
    static VISUALIZATION_METHODS = ["toggleUndirectedDirected"];

    static VISUALIZATION_CLASS = Dijkstras;
    static DIV_CLASS = "dijkstras";
    static NAME = "Dijkstra's (Shortest Path) Algorithm";

    addControls() {
        GraphControls.addStartVertexField_and_runButton(this);
        GraphControls.addNewGraphButtons(this);
        GraphControls.addDirectedUndirectedRadio(this);
        GraphControls.addRepresentationRadio(this);
    }
}
