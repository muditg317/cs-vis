import Visualizer from 'components/visualizer';
import { ControlBuilder } from 'utils';


export default class QueueVisualizer extends Visualizer {
    static ADT_NAME = "queue";
    static VISUALIZATION_METHODS = ["enqueue", "dequeue", "reset"];

    addControls() {
        ControlBuilder.applyFieldWithOptions(this, {name: "value", callback: "enqueue"}, ControlBuilder.validatorMaxLength(6), ControlBuilder.validatorIntOnly());

        ControlBuilder.applyNewCallbackButton(this, "enqueue", this.valueField);

        ControlBuilder.applyNewCallbackButton(this, "dequeue");

        ControlBuilder.applyResetButton(this, "reset", this.valueField);

        //set tab order for controls
        ControlBuilder.setTabControl(this.resetButton, this.valueField);

        // build groups
        let interactionButtonGroup = ControlBuilder.createControlGroup("interactionButtons", this.enqueueButton, this.dequeueButton);
        let mainControlGroup = ControlBuilder.createControlGroup("mainControl", this.valueField, interactionButtonGroup);
        let resetGroup = ControlBuilder.createControlGroup("resetGroup", this.resetButton);

        super.addControlGroups(mainControlGroup, resetGroup);
    }
}
