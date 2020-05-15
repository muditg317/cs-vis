import { TreeVisualizer } from './';
import { ControlBuilder } from 'utils';


export default class BinarySearchingTreeVisualizer extends TreeVisualizer {
    static VISUALIZATION_METHODS = ["togglePredecessorSuccessor"];

    addControls() {
        super.addControls();

        this.togglePredecessorSuccessorRadio = ControlBuilder.createRadio("togglePredecessorSuccessor", "Predecessor", "Successor");
        ControlBuilder.addRadioSubmit(this.togglePredecessorSuccessorRadio, this.togglePredecessorSuccessor);

        // build groups
        let togglePredecessorSuccessorGroup = ControlBuilder.createControlGroup("togglePredecessorSuccessor", this.togglePredecessorSuccessorRadio);

        super.addControlGroups(togglePredecessorSuccessorGroup);
    }
}
