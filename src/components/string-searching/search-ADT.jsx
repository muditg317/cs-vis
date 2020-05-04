import Visualizer from 'components/visualizer';
import { ControlBuilder } from 'utils';


export default class SearchVisualizer extends Visualizer {
    static ADT_NAME = "search";
    static VISUALIZATION_METHODS = ["search", "reset"];

    addControls(offerTable = false) {
        ControlBuilder.applyFieldWithOptions(this, {name: "searchText", prompt: "text", callback: false}, ControlBuilder.validatorMaxLength(100));
        ControlBuilder.applyFieldWithOptions(this, {name: "pattern", callback: false, args: {size: 15}}, ControlBuilder.validatorMaxLength(100));
        ControlBuilder.addFieldSubmit(this.searchTextField, this.search,
                {
                    secondaryRequired: true,
                    secondary: {
                        field: this.patternField,
                        clear: true
                    }
                }
            );
        ControlBuilder.addFieldSubmit(this.patternField, offerTable ? this.buildTable : this.search,
                {
                    secondaryRequired: !offerTable,
                    secondary: {
                        field: this.searchTextField,
                        callback: this.search,
                        isFirstParam: true,
                        clear: true
                    }
                }
            );

        ControlBuilder.applyNewCallbackButton(this, "search", {field: this.searchTextField, focus: true}, this.patternField);

        if (offerTable) {
            ControlBuilder.applyNewCallbackButton(this, {name: "buildTable", longName: `build ${offerTable} table`}, this.patternField);
        }

        ControlBuilder.applyResetButton(this, "reset", this.searchTextField);

        //set tab order for controls
        ControlBuilder.setTabControl(this.resetButton, this.searchTextField);

        // build groups
        let searchTextFieldGroup = ControlBuilder.createControlGroup({id: "searchtext-field-group", classes:["expanding-group","w50"]}, this.searchTextField);
        let patternFieldGroup = ControlBuilder.createControlGroup("pattern-field-group", this.patternField);
        let searchButtonGroup = ControlBuilder.createControlGroup("search-button-group", this.searchButton);
        let buildTableGroup = offerTable ? ControlBuilder.createControlGroup("buildtable-button-group", this.buildTableButton) : undefined;
        let resetGroup = ControlBuilder.createControlGroup("reset-group", this.resetButton);

        super.addControlGroups(searchTextFieldGroup, patternFieldGroup, searchButtonGroup);
        if (offerTable) {
            super.addControlGroups(buildTableGroup);
        }
        super.addControlGroups(resetGroup);
    }
}
