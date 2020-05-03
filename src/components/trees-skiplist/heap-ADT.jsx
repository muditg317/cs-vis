import Visualizer from 'components/visualizer';
import { ControlBuilder } from 'utils';


export default class HeapVisualizer extends Visualizer {
    static ADT_NAME = "heap";
    static VISUALIZATION_METHODS = ["enqueue", "dequeue", "reset", "buildHeap", "toggleMinMax"];

    addControls() {
        ControlBuilder.applyFieldWithOptions(this, {name: "value", callback: "enqueue"}, ControlBuilder.validatorMaxLength(6), ControlBuilder.validatorIntOnly());

        ControlBuilder.applyNewCallbackButton(this, "enqueue", this.valueField);

        ControlBuilder.applyNewCallbackButton(this, "dequeue");

        ControlBuilder.applyFieldWithOptions(this, {name: "buildHeap", prompt: "1,-4,23,3-8,... [max 50 elements]"}, ControlBuilder.validatorIntList(4,50));

        ControlBuilder.applyNewCallbackButton(this, "buildHeap", this.buildHeapField);

        ControlBuilder.applyResetButton(this, "reset", this.valueField);

        this.toggleMinMaxRadio = ControlBuilder.createRadio("toggleMinMax", "MinHeap", "MaxHeap");
        ControlBuilder.addRadioSubmit(this.toggleMinMaxRadio, this.toggleMinMax);

        //set tab order for controls
        ControlBuilder.setTabControl(this.resetButton, this.insertField);

        // build groups
        let interactionButtonGroup = ControlBuilder.createControlGroup("interactionButtons", this.enqueueButton, this.dequeueButton);
        let mainControlGroup = ControlBuilder.createControlGroup("mainControl", this.valueField, interactionButtonGroup);
        let resetGroup = ControlBuilder.createControlGroup("resetGroup", this.resetButton);
        let buildHeapGroup = ControlBuilder.createControlGroup({id: "build-heap-group", classes:["expanding-group"]}, this.buildHeapField, this.buildHeapButton);
        let toggleMinMaxGroup = ControlBuilder.createControlGroup("toggleMinMax", this.toggleMinMaxRadio);

        super.addControlGroups(mainControlGroup, resetGroup, buildHeapGroup, toggleMinMaxGroup);
    }
}
