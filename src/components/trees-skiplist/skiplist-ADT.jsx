import Visualizer from 'components/visualizer';
import { ControlBuilder } from 'utils';


export default class SkipListADTVisualizer extends Visualizer {
    static ADT_NAME = "skiplist";
    static VISUALIZATION_METHODS = ["addRandomly", "addWithHeads", "remove", "get", "reset"];

    addControls() {
        ControlBuilder.applyFieldWithOptions(this, {name: "value", callback: false, args: {size: 10}}, ControlBuilder.validatorMaxLength(6), ControlBuilder.validatorIntOnly());
        ControlBuilder.applyFieldWithOptions(this, {name: "heads", prompt: "num heads", callback: false, args: {size: 10}}, ControlBuilder.validatorSkipListHeads());
        ControlBuilder.addFieldSubmit(this.valueField, this.addRandomly,
                {
                    secondary: {
                        field: this.headsField,
                        callback: this.addWithHeads,
                        clear: true
                    }
                }
            );
        ControlBuilder.addFieldSubmit(this.headsField, this.addWithHeads,
                {
                    secondaryRequired: true,
                    secondary: {
                        field: this.valueField,
                        isFirstParam: true,
                        clear: true
                    }
                }
            );

        ControlBuilder.applyNewCallbackButton(this, "addRandomly", this.valueField);

        ControlBuilder.applyNewCallbackButton(this, "addWithHeads", {field: this.valueField, focus: true}, this.headsField);

        ControlBuilder.applyFieldWithOptions(this, {name: "remove", longName: "value", args: {size: 10}}, ControlBuilder.validatorMaxLength(5), ControlBuilder.validatorIntOnly());

        ControlBuilder.applyNewCallbackButton(this, "remove", this.removeField);

        ControlBuilder.applyFieldWithOptions(this, {name: "get", longName: "value", args: {size: 10}}, ControlBuilder.validatorMaxLength(5), ControlBuilder.validatorIntOnly());

        ControlBuilder.applyNewCallbackButton(this, "get", this.getField);

        ControlBuilder.applyNewCallbackButton(this, "print");

        ControlBuilder.applyResetButton(this, "reset", this.insertField);

        //set tab order for controls
        ControlBuilder.setTabControl(this.resetButton, this.valueField);

        // build groups
        // let addFieldGroup = ControlBuilder.createControlGroup("add-field-group", this.valueField, this.headsField);
        // let addButtonGroup = ControlBuilder.createControlGroup("add-button-group", this.addRandomlyButton, this.addWithHeadsButton);
        let addRandomlyGroup = ControlBuilder.createControlGroup("add-field-group", this.valueField, this.addRandomlyButton);
        let addWithHeadsGroup = ControlBuilder.createControlGroup("add-button-group", this.headsField, this.addWithHeadsButton);
        // let addGroup = ControlBuilder.createControlGroup("add-group", this.valueField, this.addRandomlyButton, addWithHeadsGroup);
        let removeGroup = ControlBuilder.createControlGroup("remove-group", this.removeField, this.removeButton);
        let getGroup = ControlBuilder.createControlGroup("get-group", this.getField, this.getButton);
        let resetGroup = ControlBuilder.createControlGroup("reset-group", this.resetButton);

        super.addControlGroups(addRandomlyGroup, addWithHeadsGroup, removeGroup, getGroup, resetGroup);
    }
}
