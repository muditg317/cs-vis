import Visualizer from 'components/visualizer';
import { ControlBuilder } from 'utils';


export default class HashMapVisualizer extends Visualizer {
    static ADT_NAME = "hashmap";
    static VISUALIZATION_METHODS = ["insert", "delete", "find", "reset"];

    addControls() {
        ControlBuilder.applyFieldWithOptions(this, {name: "insert", longName: "value", args: {size: 10}}, ControlBuilder.validatorMaxLength(5), ControlBuilder.validatorIntOnly());

        ControlBuilder.applyNewCallbackButton(this, "insert", this.insertField);

        ControlBuilder.applyFieldWithOptions(this, {name: "delete", longName: "value", args: {size: 10}}, ControlBuilder.validatorMaxLength(5), ControlBuilder.validatorIntOnly());

        ControlBuilder.applyNewCallbackButton(this, "delete", this.deleteField);

        ControlBuilder.applyFieldWithOptions(this, {name: "find", longName: "value", args: {size: 10}}, ControlBuilder.validatorMaxLength(5), ControlBuilder.validatorIntOnly());

        ControlBuilder.applyNewCallbackButton(this, "find", this.findField);

        ControlBuilder.applyResetButton(this, "reset", this.insertField);

        //set tab order for controls
        ControlBuilder.setTabControl(this.resetButton, this.insertField);

        // build groups
        let insertGroup = ControlBuilder.createControlGroup("insert-group", this.insertField, this.insertButton);
        let deleteGroup = ControlBuilder.createControlGroup("delete-group", this.deleteField, this.deleteButton);
        let findGroup = ControlBuilder.createControlGroup("find-group", this.findField, this.findButton);
        let resetGroup = ControlBuilder.createControlGroup("reset-group", this.resetButton);

        super.addControlGroups(insertGroup, deleteGroup, findGroup, resetGroup);
    }
}
