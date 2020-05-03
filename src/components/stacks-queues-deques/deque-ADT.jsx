import Visualizer from 'components/visualizer';
import { ControlBuilder } from 'utils';


export default class DequeVisualizer extends Visualizer {
    static ADT_NAME = "deque";
    static VISUALIZATION_METHODS = ["addFirst", "addLast", "removeFirst", "removeLast", "reset"];

    addControls() {
        ControlBuilder.applyFieldWithOptions(this, {name: "value", callback: "addLast"}, ControlBuilder.validatorMaxLength(6), ControlBuilder.validatorIntOnly());

        ControlBuilder.applyNewCallbackButton(this, {name: "addFirst", longName: "addFirst (push)"}, this.valueField);

        ControlBuilder.applyNewCallbackButton(this, {name: "addLast", longName: "addLast (enqueue)"}, this.valueField);

        ControlBuilder.applyNewCallbackButton(this, {name: "removeFirst", longName: "removeFirst (dequeue/pop)"});

        ControlBuilder.applyNewCallbackButton(this, "removeLast");

        ControlBuilder.applyResetButton(this, "reset", this.valueField);

        //set tab order for controls
        ControlBuilder.setTabControl(this.resetButton, this.valueField);

        // build groups
        let addButtonGroup = ControlBuilder.createControlGroup("addButtons", this.addFirstButton, this.addLastButton);
        let removeButtonGroup = ControlBuilder.createControlGroup("removeButtons", this.removeFirstButton, this.removeLastButton);
        let interactionGroup = ControlBuilder.createControlGroup("interactions", this.valueField, addButtonGroup, removeButtonGroup);
        let resetGroup = ControlBuilder.createControlGroup("resetGroup", this.resetButton);

        super.addControlGroups(interactionGroup, resetGroup);
    }
}
