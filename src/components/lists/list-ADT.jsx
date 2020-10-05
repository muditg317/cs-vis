import Visualizer from 'components/visualizer';
import { ControlBuilder } from 'utils';


export default class ListVisualizer extends Visualizer {
    static ADT_NAME = "list";
    static VISUALIZATION_METHODS = ["addAtIndex", "addToFront", "addToBack", "removeFromIndex", "removeFromBack", "removeFromFront", "reset"];

    addControls() {
        ControlBuilder.applyFieldWithOptions(this, {name: "value", callback: false}, ControlBuilder.validatorMaxLength(6), ControlBuilder.validatorIntOnly());
        ControlBuilder.applyFieldWithOptions(this, {name: "index", callback: false, args: {size: 10}}, ControlBuilder.validatorMaxLength(6), ControlBuilder.validatorPositiveIntOnly());
        ControlBuilder.addFieldSubmit(this, this.valueField, this.addToBack,
                {
                    secondary: {
                        field: this.indexField,
                        callback: this.addAtIndex,
                        isFirstParam: true
                    }
                }
            );
        ControlBuilder.addFieldSubmit(this, this.indexField, this.addAtIndex,
                {
                    secondaryRequired: true,
                    secondary: {
                        field: this.valueField
                    }
                }
            );

        ControlBuilder.applyNewCallbackButton(this, "addAtIndex", this.indexField, {field: this.valueField, focus: true});

        ControlBuilder.applyNewCallbackButton(this, "addToFront", this.valueField);

        ControlBuilder.applyNewCallbackButton(this, "addToBack", this.valueField);

        ControlBuilder.applyNewCallbackButton(this, "removeFromIndex", this.indexField);

        ControlBuilder.applyNewCallbackButton(this, "removeFromFront");

        ControlBuilder.applyNewCallbackButton(this, "removeFromBack");

        ControlBuilder.applyResetButton(this, "reset", this.valueField);

        //set tab order for controls
        ControlBuilder.setTabControl(this.valueField, this.indexField);
        ControlBuilder.setTabControl(this.indexField, this.addToFrontButton);
        ControlBuilder.setTabControl(this.removeFromBackButton, this.addAtIndexButton);
        ControlBuilder.setTabControl(this.resetButton, this.valueField);

        // build groups
        let addFrontBackGroup = ControlBuilder.createControlGroup("addFrontBack", this.addToFrontButton, this.addToBackButton);
        let removeFrontBackGroup = ControlBuilder.createControlGroup("removeFrontBack", this.removeFromFrontButton, this.removeFromBackButton);
        let valueFrontBackGroup = ControlBuilder.createControlGroup("valueFrontBack", this.valueField, addFrontBackGroup, removeFrontBackGroup);

        let indexGroup = ControlBuilder.createControlGroup("indexAddRemove", this.indexField, this.addAtIndexButton, this.removeFromIndexButton);

        let resetGroup = ControlBuilder.createControlGroup("reset", this.resetButton);

        super.addControlGroups(valueFrontBackGroup, indexGroup, resetGroup);
    }
}
