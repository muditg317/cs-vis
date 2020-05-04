import Visualizer from 'components/visualizer';

import './graph.scss';

export default class GraphVisualizer extends Visualizer {
    static ADT_NAME = "graph";
    static VISUALIZATION_METHODS = ["run", "newSmallGraph", "newLargeGraph", "toggleRepresentation"];
}
