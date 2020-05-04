import Visualizer from 'components/visualizer';
import { ControlBuilder } from 'utils';


export default class SortVisualizer extends Visualizer {
    static ADT_NAME = "sort";
    static VISUALIZATION_METHODS = ["sort", "reset"];

    addControls() {
        ControlBuilder.applyFieldWithOptions(this, {name: "sort", prompt: "1,-4,23,3-8,... [max 50 elements]"}, ControlBuilder.validatorIntList(4,50));

        ControlBuilder.applyNewCallbackButton(this, "sort", this.sortField);

        ControlBuilder.applyResetButton(this, "reset", this.sortField);

        //set tab order for controls
        ControlBuilder.setTabControl(this.resetButton, this.sortField);

        // build groups
        let sortFieldGroup = ControlBuilder.createControlGroup({id: "sort-field-group", classes:["expanding-group","w50"]}, this.sortField);
        let sortButtonGroup = ControlBuilder.createControlGroup("sort-button-group", this.sortButton);
        let resetGroup = ControlBuilder.createControlGroup("reset-group", this.resetButton);

        super.addControlGroups(sortFieldGroup, sortButtonGroup, resetGroup);
    }
}
