import Visualizer from 'components/visualizer';
import { ControlBuilder } from 'utils';


export default class HeapVisualizer extends Visualizer {
    static ADT_NAME = "heap";
    static VISUALIZATION_METHODS = ["enqueue", "dequeue", "reset", "buildHeap", "toggleMinMax"];

    addControls() {
        this.valueField = ControlBuilder.createField("value", true, ControlBuilder.validatorMaxLength(6), ControlBuilder.validatorIntOnly());
        ControlBuilder.addFieldSubmit(this.valueField, this.enqueue);

        ControlBuilder.applyNewCallbackButton(this, "enqueue", this.valueField);

        ControlBuilder.applyNewCallbackButton(this, "dequeue");

        this.buildHeapField = ControlBuilder.createField("buildHeap list", ControlBuilder.validatorIntList());

        ControlBuilder.applyNewCallbackButton(this, "buildHeap", this.buildHeapField);

        ControlBuilder.applyNewCallbackButton(this, "reset", this.buildHeapField, {field: this.valueField, focus: true});

        this.toggleMinMaxRadio = ControlBuilder.createRadio("toggleMinMax", "MinHeap", "MaxHeap");
        ControlBuilder.addRadioSubmit(this.toggleMinMaxRadio, this.toggleMinMax);

        //set tab order for controls
        ControlBuilder.setTabControl(this.resetButton, this.valueField);

        // build groups
        let interactionButtonGroup = ControlBuilder.createControlGroup("interactionButtons", this.enqueueButton, this.dequeueButton);
        let mainControlGroup = ControlBuilder.createControlGroup("mainControl", this.valueField, interactionButtonGroup);
        let resetGroup = ControlBuilder.createControlGroup("resetGroup", this.resetButton);
        let buildHeapGroup = ControlBuilder.createControlGroup("buildHeap", this.buildHeapField, this.buildHeapButton);
        let toggleMinMaxGroup = ControlBuilder.createControlGroup("toggleMinMax", this.toggleMinMaxRadio);

        super.addControlGroups(mainControlGroup, resetGroup, buildHeapGroup, toggleMinMaxGroup);
    }
}
