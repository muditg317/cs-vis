import { ControlBuilder } from 'utils';

export function addStartVertexField_and_runButton(visualizer) {
    ControlBuilder.applyFieldWithOptions(visualizer, {name: "startVertex", prompt: "start vertex", callback: "run", args: {size: 10}}, ControlBuilder.validatorMaxLength(2));
    ControlBuilder.applyNewCallbackButton(visualizer, "run", visualizer.startVertexField);
    let runGroup = ControlBuilder.createControlGroup("run-group", visualizer.startVertexField, visualizer.runButton);
    visualizer.addControlGroups(runGroup);
}

export function addRunButton(visualizer) {
    ControlBuilder.applyNewCallbackButton(visualizer, "run");
    let runButtonGroup = ControlBuilder.createControlGroup("run-button-group", visualizer.runButton);
    visualizer.addControlGroups(runButtonGroup);
}

export function addDFStypeRadio(visualizer) {
    visualizer.toggleDFStypeRadio = ControlBuilder.createRadio("toggleDFStype", "Stack", "Recursion");
    ControlBuilder.addRadioSubmit(visualizer.toggleDFStypeRadio, visualizer.toggleDFStype);
    let dfsTypeRadioGroup = ControlBuilder.createControlGroup("toggleDFStype", visualizer.toggleDFStypeRadio);
    visualizer.addControlGroups(dfsTypeRadioGroup);
}

export function addNewGraphButtons(visualizer) {
    ControlBuilder.applyNewCallbackButton(visualizer, "newSmallGraph");
    ControlBuilder.applyNewCallbackButton(visualizer, "newLargeGraph");
    let newGraphButtonsGroup = ControlBuilder.createControlGroup("new-graph-group", visualizer.newSmallGraphButton, visualizer.newLargeGraphButton);
    visualizer.addControlGroups(newGraphButtonsGroup);
}

export function addDirectedUndirectedRadio(visualizer) {
    visualizer.toggleUndirectedDirectedRadio = ControlBuilder.createRadio("toggleUndirectedDirected", "Undirected", "Directed");
    ControlBuilder.addRadioSubmit(visualizer.toggleUndirectedDirectedRadio, visualizer.toggleUndirectedDirected);
    let directedUndirectedRadioGroup = ControlBuilder.createControlGroup("toggleUndirectedDirected", visualizer.toggleUndirectedDirectedRadio);
    visualizer.addControlGroups(directedUndirectedRadioGroup);
}

export function addRepresentationRadio(visualizer) {
    visualizer.toggleRepresentationRadio = ControlBuilder.createRadio("toggleRepresentation",
            {value: "nodeEdge", longText: "Node/Edge Prepresentation"},
            {value: "adjacencyList", longText: "Adjacency List Prepresentation"},
            {value: "adjacencyMatrix", longText: "Adjacency Matrix Prepresentation"},
        );
    ControlBuilder.addRadioSubmit(visualizer.toggleRepresentationRadio, visualizer.toggleRepresentation);
    let representationRadioGroup = ControlBuilder.createControlGroup("toggleRepresentation", visualizer.toggleRepresentationRadio);
    visualizer.addControlGroups(representationRadioGroup);
}
