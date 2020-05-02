import { TreeVisualizer } from './';
import { ControlBuilder } from 'utils';


export default class BinarySearchingTreeVisualizer extends TreeVisualizer {
    static VISUALIZATION_METHODS = ["togglePredecessorSuccessor"];

    addControls() {
        this.valueField = ControlBuilder.createField("value", ControlBuilder.validatorIntOnly(), ControlBuilder.validatorMaxLength(4));
        ControlBuilder.addSubmit(this.valueField, this.elementFieldCallback);

        this.addLastButton = ControlBuilder.createButton("addLast (enqueue)");
        this.addLastButton.addEventListener("click",this.addLastButtonCallback);

        this.addFirstButton = ControlBuilder.createButton("addFirst (push)");
        this.addFirstButton.addEventListener("click",this.addFirstButtonCallback);

        this.removeFirstButton = ControlBuilder.createButton("removeFirst (dequeue/pop)");
        this.removeFirstButton.addEventListener("click",this.removeFirstButtonCallback);

        this.removeLastButton = ControlBuilder.createButton("removeLast");
        this.removeLastButton.addEventListener("click",this.removeLastButtonCallback);

        this.resetButton = ControlBuilder.createButton("reset");
        this.resetButton.addEventListener("click",this.resetButtonCallback);

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
