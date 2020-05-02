import SortVisualizer from './';
import { ControlBuilder } from 'utils';


export default class QuickVisualizer extends SortVisualizer {


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

    componentDidMount(callForward) {
        super.componentDidMount(() => {
            callForward();
            super.visualization = this.deque;
        });
    }


    addLastButtonCallback() {
        let value = this.valueField.value;
        if (value !== "") {
            if (this.deque.addLast(value)) {
                this.valueField.value = "";
                this.valueField.focus();
            }
        }
    }


    addFirstButtonCallback() {
        let value = this.valueField.value;
        if (value !== "") {
            if (this.deque.addFirst(value)) {
                this.valueField.value = "";
                this.valueField.focus();
            }
        }
    }

    elementFieldCallback() {
        let value = this.valueField.value;
        if (value !== "") {
            if (this.deque.addLast(value)) {
                this.valueField.value = "";
            }
        }
    }

    removeFirstButtonCallback() {
        this.deque.removeFirst();
    }

    removeLastButtonCallback() {
        this.deque.removeLast();
    }

    resetButtonCallback() {
        this.deque.reset();
        this.valueField.value = "";
        this.valueField.focus();
    }
}
