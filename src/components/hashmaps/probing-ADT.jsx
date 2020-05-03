import { HashMapVisualizer } from './';
import { ControlBuilder } from 'utils';


export default class ProbingVisualizer extends HashMapVisualizer {
    static VISUALIZATION_METHODS = ["toggleProbingMode"];

    addControls() {
        super.addControls();

        this.toggleProbingModeRadio = ControlBuilder.createRadio("toggleProbingMode",
                {value: "linear", longText: "Linear Probing: ind = hash(x) + i*1"},
                {value: "linear", longText: "Quadratic Probing: ind = hash(x) + i*i"},
                {value: "linear", longText: "Double Hashing: ind = hash(x) + i*hash2(x)"});
        ControlBuilder.addRadioSubmit(this.toggleProbingModeRadio, this.toggleProbingMode);

        // build groups
        let toggleProbingModeGroup = ControlBuilder.createControlGroup("toggleProbingMode", this.toggleProbingModeRadio);

        super.addControlGroups(toggleProbingModeGroup);
    }
}
