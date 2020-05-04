import { SortVisualizer } from './';
import { ControlBuilder } from 'utils';


export default class BubblingVisualizer extends SortVisualizer {
    static VISUALIZATION_METHODS = ["toggleLastSwapOptimization"];

    addControls() {
        super.addControls();

        this.toggleLastSwapOptimizationCheckBox = ControlBuilder.createCheckBox("toggleLastSwapOptimization",
                {value: "enableLastSwap", longText: "Enable last swap optimization"});
        ControlBuilder.addCheckBoxSubmit(this.toggleLastSwapOptimizationCheckBox, this.toggleLastSwapOptimization);

        // build groups
        let toggleLastSwapOptimizationGroup = ControlBuilder.createControlGroup("toggleLastSwapOptimization-group", this.toggleLastSwapOptimizationCheckBox);

        super.addControlGroups(toggleLastSwapOptimizationGroup);
    }
}
