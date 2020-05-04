import Visualizer from 'components/visualizer';
import { ControlBuilder } from 'utils';

import { LCS } from 'animation';
import './lcs.scss';


export default class LCSVisualizer extends Visualizer {
    static ADT_NAME = "lcs";
    static VISUALIZATION_METHODS = ["findLCS"];

    static VISUALIZATION_CLASS = LCS;
    static DIV_CLASS = "lcs";
    static NAME = "Longest Common Subsequence";

    addControls() {
        ControlBuilder.applyFieldWithOptions(this, {name: "firstString", prompt: "first string", callback: false}, ControlBuilder.validatorMaxLength(100));
        ControlBuilder.applyFieldWithOptions(this, {name: "secondString", prompt: "second string", callback: false}, ControlBuilder.validatorMaxLength(100));
        ControlBuilder.addFieldSubmit(this.firstStringField, this.findLCS,
                {
                    secondaryRequired: true,
                    secondary: {
                        field: this.secondStringField,
                        clear: true
                    }
                }
            );
        ControlBuilder.addFieldSubmit(this.secondStringField, this.findLCS,
                {
                    secondaryRequired: true,
                    secondary: {
                        field: this.firstStringField,
                        isFirstParam: true,
                        clear: true
                    }
                }
            );

        ControlBuilder.applyNewCallbackButton(this, {name: "findLCS", longName: `Find LCS`}, {field: this.firstStringField, focus: true}, this.secondStringField);

        //set tab order for controls
        ControlBuilder.setTabControl(this.findLCSButton, this.firstStringField);

        // build groups
        let stringFieldGroup = ControlBuilder.createControlGroup({id: "findLCStext-field-group", classes:["expanding-group","w50"]}, this.firstStringField, this.secondStringField);
        let lcsButtonGroup = ControlBuilder.createControlGroup("lcs-button-group", this.findLCSButton);

        super.addControlGroups(stringFieldGroup, lcsButtonGroup);
    }
}
