import { GraphVisualizer } from '../';
import GraphControls from 'components/graph-visualizer-controls';

import { Kruskals } from 'animation';
import './kruskals.scss';


export default class KruskalsVisualizer extends GraphVisualizer {
    static VISUALIZATION_CLASS = Kruskals;
    static DIV_CLASS = "kruskals";
    static NAME = "Kruskal's (Minimum Spanning Tree) Algorithm";

    addControls() {
        GraphControls.addRunButton(this);
        GraphControls.addNewGraphButtons(this);
        GraphControls.addRepresentationRadio(this);
    }
}
