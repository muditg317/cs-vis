import Visualizer from 'components/visualizer';
import { ControlBuilder } from 'utils';


export default class ListVisualizer extends Visualizer {

    constructor(props) {
        super(props);

        //FUNCTION BINDING
        this.addAtIndexButtonCallback = this.addAtIndexButtonCallback.bind(this);
        this.addToFrontButtonCallback = this.addToFrontButtonCallback.bind(this);
        this.addToBackButtonCallback = this.addToBackButtonCallback.bind(this);
        this.removeFromIndexButtonCallback = this.removeFromIndexButtonCallback.bind(this);
        this.removeFromFrontButtonCallback = this.removeFromFrontButtonCallback.bind(this);
        this.removeFromBackButtonCallback = this.removeFromBackButtonCallback.bind(this);
        this.resetButtonCallback = this.resetButtonCallback.bind(this);
        this.elementFieldCallback = this.elementFieldCallback.bind(this);
        this.indexFieldCallback = this.indexFieldCallback.bind(this);

        this.list = null;

        this.addControls();
    }

    addControls() {
        this.valueField = ControlBuilder.createField("value", ControlBuilder.validatorIntOnly(), ControlBuilder.validatorMaxLength(4));
        this.indexField = ControlBuilder.createField("index", ControlBuilder.validatorIntOnly(), ControlBuilder.validatorMaxLength(4));
        ControlBuilder.addSubmit(this.valueField, this.elementFieldCallback);
        ControlBuilder.addSubmit(this.indexField, this.indexFieldCallback);

        this.addAtIndexButton = ControlBuilder.createButton("addAtIndex");
        this.addAtIndexButton.addEventListener("click",this.addAtIndexButtonCallback);

        this.addToFrontButton = ControlBuilder.createButton("addToFront");
        this.addToFrontButton.addEventListener("click",this.addToFrontButtonCallback);

        this.addToBackButton = ControlBuilder.createButton("addToBack");
        this.addToBackButton.addEventListener("click",this.addToBackButtonCallback);

        this.removeFromIndexButton = ControlBuilder.createButton("removeFromIndex");
        this.removeFromIndexButton.addEventListener("click",this.removeFromIndexButtonCallback);

        this.removeFromFrontButton = ControlBuilder.createButton("removeFromFront");
        this.removeFromFrontButton.addEventListener("click",this.removeFromFrontButtonCallback);

        this.removeFromBackButton = ControlBuilder.createButton("removeFromBack");
        this.removeFromBackButton.addEventListener("click",this.removeFromBackButtonCallback);

        this.resetButton = ControlBuilder.createButton("reset");
        this.resetButton.addEventListener("click",this.resetButtonCallback);

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

    componentDidMount(callForward) {
        super.componentDidMount(() => {
            callForward();
            super.visualization = this.list;
        });
    }


    addAtIndexButtonCallback() {
        let index = parseInt(this.indexField.value);
        let value = this.valueField.value;
        if (value !== "" && !isNaN(index)) {
            if (this.list.addAtIndex(index, value)) {
                this.valueField.value = "";
                this.indexField.value = "";
            }
        }
    }

    elementFieldCallback() {
        let index = parseInt(this.indexField.value);
        let value = this.valueField.value;
        if (value !== "") {
            if (!isNaN(index)) {
                if (this.list.addAtIndex(index, value)) {
                    this.valueField.value = "";
                }
            } else {
                if (this.list.addToBack(value)) {
                    this.valueField.value = "";
                }
            }
        }
    }

    indexFieldCallback() {
        let index = parseInt(this.indexField.value);
        let value = this.valueField.value;
        if (value !== "" && !isNaN(index)) {
            if (this.list.addAtIndex(index, value)) {
                this.indexField.value = "";
            }
        }
    }

    addToFrontButtonCallback() {
        let value = this.valueField.value;
        if (value !== "") {
            this.list.addToFront(value);
            this.valueField.value = "";
        }
    }

    addToBackButtonCallback() {
        let value = this.valueField.value;
        if (value !== "") {
            this.list.addToBack(value);
            this.valueField.value = "";
        }
    }


    removeFromIndexButtonCallback() {
        let index = parseInt(this.indexField.value);
        if (!isNaN(index)) {
            this.list.removeFromIndex(index);
            this.indexField.value = "";
        }
    }

    removeFromFrontButtonCallback() {
        this.list.removeFromFront();
    }

    removeFromBackButtonCallback() {
        this.list.removeFromBack();
    }


    resetButtonCallback() {
        this.list.reset();
    }
}
