import { GraphVisualizer } from '../';
import GraphControls from 'components/graph-visualizer-controls';

import { Prims } from 'animation';
import './prims.scss';


export default class PrimsVisualizer extends GraphVisualizer {
    static VISUALIZATION_CLASS = Prims;
    static DIV_CLASS = "prims";
    static NAME = "Prim's (Minimum Spanning Tree) Algorithm";

    addControls() {
        GraphControls.addStartVertexField_and_runButton(this);
        GraphControls.addNewGraphButtons(this);
        GraphControls.addRepresentationRadio(this);
    }
}
