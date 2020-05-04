import Visualizer from 'components/visualizer';
import { ControlBuilder } from 'utils';


export default class SelectVisualizer extends Visualizer {
    static ADT_NAME = "quickselect";
    static VISUALIZATION_METHODS = ["select", "reset", "toggleSelectPivotElement"];

    addControls() {
        ControlBuilder.applyFieldWithOptions(this, {name: "list", prompt: "1,-4,23,3-8,... [max 50 elements]", callback: false}, ControlBuilder.validatorIntList(4,50));
        ControlBuilder.applyFieldWithOptions(this, {name: "kth", prompt: "k (1-indexed)", callback: false, args: {size: 8}}, ControlBuilder.validatorPositiveIntOnly());
        ControlBuilder.addFieldSubmit(this.listField, this.select,
                {
                    secondaryRequired: true,
                    secondary: {
                        field: this.kthField,
                        clear: true
                    }
                }
            );
        ControlBuilder.addFieldSubmit(this.kthField, this.select,
                {
                    secondaryRequired: true,
                    secondary: {
                        field: this.listField,
                        isFirstParam: true,
                        clear: true
                    }
                }
            );

        ControlBuilder.applyNewCallbackButton(this, "select", {field: this.listField, focus: true}, this.kthField);

        ControlBuilder.applyResetButton(this, "reset", this.listField);

        this.toggleSelectPivotElementCheckBox = ControlBuilder.createCheckBox("toggleSelectPivotElement",
                {value: "selectMin", longText: "Pick min element as pivot"},
                {value: "selectMax", longText: "Pick max element as pivot"});
        ControlBuilder.addCheckBoxSubmit(this.toggleSelectPivotElementCheckBox, {callback: this.toggleSelectPivotElement, max1Checked: true});

        //set tab order for controls
        ControlBuilder.setTabControl(this.resetButton, this.listField);

        // build groups
        let listFieldGroup = ControlBuilder.createControlGroup({id: "list-field-group", classes:["expanding-group","w50"]}, this.listField);
        let kthFieldGroup = ControlBuilder.createControlGroup("kth-field-group", this.kthField);
        let selectButtonGroup = ControlBuilder.createControlGroup("select-button-group", this.selectButton);
        let resetGroup = ControlBuilder.createControlGroup("reset-group", this.resetButton);
        let toggleSelectPivotElementGroup = ControlBuilder.createControlGroup("toggleSelectPivotElement-group", this.toggleSelectPivotElementCheckBox);

        super.addControlGroups(listFieldGroup, kthFieldGroup, selectButtonGroup, resetGroup, toggleSelectPivotElementGroup);
    }
}
