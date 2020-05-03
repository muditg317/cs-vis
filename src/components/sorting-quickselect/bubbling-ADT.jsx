import { SortVisualizer } from './';
import { ControlBuilder } from 'utils';


export default class BubblingVisualizer extends SortVisualizer {
    static VISUALIZATION_METHODS = ["toggleLastSwapOptimization"];

    addControls() {
        this.valueField = ControlBuilder.createField("value", ControlBuilder.validatorIntOnly(), ControlBuilder.validatorMaxLength(4));
        ControlBuilder.addSubmit(this.valueField, this.elementFieldCallback);

        this.enqueueButton = ControlBuilder.createButton("enqueue");
        this.enqueueButton.addEventListener("click",this.enqueueButtonCallback);

        this.dequeueButton = ControlBuilder.createButton("dequeue");
        this.dequeueButton.addEventListener("click",this.dequeueButtonCallback);

        this.resetButton = ControlBuilder.createButton("reset");
        this.resetButton.addEventListener("click",this.resetButtonCallback);

        //set tab order for controls
        ControlBuilder.setTabControl(this.resetButton, this.valueField);

        // build groups
        let interactionButtonGroup = ControlBuilder.createControlGroup("interactionButtons", this.enqueueButton, this.dequeueButton);
        let mainControlGroup = ControlBuilder.createControlGroup("mainControl", this.valueField, interactionButtonGroup);
        let resetGroup = ControlBuilder.createControlGroup("resetGroup", this.resetButton);

        super.addControlGroups(mainControlGroup, resetGroup);
    }
}
