import Visualizer from 'components/visualizer';
import { ControlBuilder } from 'utils';


export default class StackVisualizer extends Visualizer {
    static ADT_NAME = "stack";
    static VISUALIZATION_METHODS = ["push", "pop", "reset"];

    addControls() {
        ControlBuilder.applyFieldWithOptions(this, {name: "value", callback: "push"}, ControlBuilder.validatorMaxLength(6), ControlBuilder.validatorIntOnly());

        ControlBuilder.applyNewCallbackButton(this, "push", this.valueField);

        ControlBuilder.applyNewCallbackButton(this, "pop");

        ControlBuilder.applyResetButton(this, "reset", this.valueField);

        //set tab order for controls
        ControlBuilder.setTabControl(this.resetButton, this.valueField);

        // build groups
        let interactionButtonGroup = ControlBuilder.createControlGroup("interactionButtons", this.pushButton, this.popButton);
        let mainControlGroup = ControlBuilder.createControlGroup("mainControl", this.valueField, interactionButtonGroup);
        let resetGroup = ControlBuilder.createControlGroup("resetGroup", this.resetButton);

        super.addControlGroups(mainControlGroup, resetGroup);
    }
}
