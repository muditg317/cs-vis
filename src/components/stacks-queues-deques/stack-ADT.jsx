import Visualizer from 'components/visualizer';
import { ControlBuilder } from 'utils';


export default class StackVisualizer extends Visualizer {

    constructor(props) {
        super(props);

        //FUNCTION BINDING
        this.pushButtonCallback = this.pushButtonCallback.bind(this);
        this.popButtonCallback = this.popButtonCallback.bind(this);
        this.resetButtonCallback = this.resetButtonCallback.bind(this);
        this.elementFieldCallback = this.elementFieldCallback.bind(this);

        this.stack = null;

        this.addControls();
    }

    addControls() {
        this.valueField = ControlBuilder.createField("value", ControlBuilder.validatorIntOnly(), ControlBuilder.validatorMaxLength(4));
        ControlBuilder.addSubmit(this.valueField, this.elementFieldCallback);

        this.pushButton = ControlBuilder.createButton("push");
        this.pushButton.addEventListener("click",this.pushButtonCallback);

        this.popButton = ControlBuilder.createButton("pop");
        this.popButton.addEventListener("click",this.popButtonCallback);

        this.resetButton = ControlBuilder.createButton("reset");
        this.resetButton.addEventListener("click",this.resetButtonCallback);

        //set tab order for controls
        ControlBuilder.setTabControl(this.resetButton, this.valueField);

        // build groups
        let interactionButtonGroup = ControlBuilder.createControlGroup("interactionButtons", this.pushButton, this.popButton);
        let mainControlGroup = ControlBuilder.createControlGroup("mainControl", this.valueField, interactionButtonGroup);
        let resetGroup = ControlBuilder.createControlGroup("resetGroup", this.resetButton);

        super.addControlGroups(mainControlGroup, resetGroup);
    }

    componentDidMount(callForward) {
        super.componentDidMount(() => {
            callForward();
            super.visualization = this.stack;
        });
    }


    pushButtonCallback() {
        let value = this.valueField.value;
        if (value !== "") {
            if (this.stack.push(value)) {
                this.valueField.value = "";
                this.valueField.focus();
            }
        }
    }

    elementFieldCallback() {
        let value = this.valueField.value;
        if (value !== "") {
            if (this.stack.push(value)) {
                this.valueField.value = "";
            }
        }
    }

    popButtonCallback() {
        this.stack.pop();
    }

    peekButtonCallback() {
        this.stack.peek();
    }

    resetButtonCallback() {
        this.stack.reset();
        this.valueField.value = "";
        this.valueField.focus();
    }
}
