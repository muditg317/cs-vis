import { SortVisualizer } from './';
import { ControlBuilder } from 'utils';


export default class QuickVisualizer extends SortVisualizer {
    static VISUALIZATION_METHODS = ["toggleSelectPivotElement"];

    addControls() {
        super.addControls();

        this.toggleSelectPivotElementCheckBox = ControlBuilder.createCheckBox("toggleSelectPivotElement",
                {value: "selectMin", longText: "Pick min element as pivot"},
                {value: "selectMax", longText: "Pick max element as pivot"});
        ControlBuilder.addCheckBoxSubmit(this.toggleSelectPivotElementCheckBox, {callback: this.toggleSelectPivotElement, max1Checked: true});

        // build groups
        let toggleSelectPivotElementGroup = ControlBuilder.createControlGroup("toggleSelectPivotElement-group", this.toggleSelectPivotElementCheckBox);

        super.addControlGroups(toggleSelectPivotElementGroup);
    }
}
