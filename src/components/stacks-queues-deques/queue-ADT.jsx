import Visualizer from 'components/visualizer';
import { ControlBuilder } from 'utils';


export default class QueueVisualizer extends Visualizer {

    constructor(props) {
        super(props);

        //FUNCTION BINDING
        this.enqueueButtonCallback = this.enqueueButtonCallback.bind(this);
        this.dequeueButtonCallback = this.dequeueButtonCallback.bind(this);
        this.resetButtonCallback = this.resetButtonCallback.bind(this);
        this.elementFieldCallback = this.elementFieldCallback.bind(this);

        this.queue = null;

        this.addControls();
    }

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

    componentDidMount(callForward) {
        super.componentDidMount(() => {
            callForward();
            super.visualization = this.queue;
        });
    }


    enqueueButtonCallback() {
        let value = this.valueField.value;
        if (value !== "") {
            if (this.queue.enqueue(value)) {
                this.valueField.value = "";
            }
        }
    }

    elementFieldCallback() {
        let value = this.valueField.value;
        if (value !== "") {
            if (this.queue.enqueue(value)) {
                this.valueField.value = "";
            }
        }
    }

    dequeueButtonCallback() {
        this.queue.dequeue();
    }

    peekButtonCallback() {
        this.queue.peek();
    }

    resetButtonCallback() {
        this.queue.reset();
    }
}
