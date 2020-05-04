import { GraphVisualizer } from 'components/graph-algorithms';
import GraphControls from 'components/graph-visualizer-controls';

import { FloydWarshall } from 'animation';
import './floyd-warshall.scss';


export default class FloydWarshallVisualizer extends GraphVisualizer {
    static ADT_NAME = "graph";
    static VISUALIZATION_METHODS = ["toggleUndirectedDirected"];

    static VISUALIZATION_CLASS = FloydWarshall;
    static DIV_CLASS = "floyd-warshall";
    static NAME = "Floyd Warshall (Shortest Path) Algorithm";

    addControls() {
        GraphControls.addRunButton(this);
        GraphControls.addNewGraphButtons(this);
        GraphControls.addDirectedUndirectedRadio(this);
        GraphControls.addRepresentationRadio(this);
    }
}
