import React, { PureComponent } from 'react';
import './controlBar.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class ControlBar extends PureComponent {

    constructor(props) {
        super(props);

        this.defaultContainer = React.createRef();
        this.defaults = React.createRef();
        this.mainContainer = React.createRef();
        this.controlBar = React.createRef();
    }

    setDefaultsLabel(label) {
        this.defaultsLabel = label;
        this.forceUpdate();
    }

    setMainLabel(label) {
        this.mainLabel = label;
        this.forceUpdate();
    }

    addDefaultGroup(controlGroup) {
        this.defaults.current.appendChild(controlGroup);
    }

    addControlGroup(controlGroup) {
        this.controlBar.current.appendChild(controlGroup);
    }

    testCenterControls() {
        let all1 = true;
        document.querySelectorAll("#main-control-label+.controls>.control-group").forEach((controlGroup) => {
            if (all1) {
                if (!(controlGroup.childNodes[0].classList.contains("radio-container") || controlGroup.childNodes[0].classList.contains("checkbox-container"))) {
                    if (controlGroup.childNodes.length > 1) {
                        all1 = false;
                    }
                }
            }
        });
        if (all1) {
            document.querySelectorAll("#main-control-label+.controls>.control-group").forEach((controlGroup) => {
                if (!(controlGroup.childNodes[0].classList.contains("radio-container") || controlGroup.childNodes[0].classList.contains("checkbox-container"))) {
                    controlGroup.style["justify-content"] = "center";
                }
            });
        }
    }

    testSize() {
        let transformed = 0;
        if (this.controlBar.current.getBoundingClientRect().width
                > (this.mainContainer.current.getBoundingClientRect().width - 0*parseFloat(window.getComputedStyle(this.mainContainer.current).getPropertyValue("padding")))) {
            this.mainContainer.current.classList.add("overflow");
            transformed++;
        } else {
            this.mainContainer.current.classList.remove("overflow");
        }
        if (this.defaults.current.getBoundingClientRect().width
                > (this.defaultContainer.current.getBoundingClientRect().width - 0*parseFloat(window.getComputedStyle(this.defaultContainer.current).getPropertyValue("padding")))) {
            this.defaultContainer.current.classList.add("overflow");
            transformed++;
        } else {
            this.defaultContainer.current.classList.remove("overflow");
        }
        return transformed;
    }

    componentDidMount() {
        this.testCenterControls();
        this.testSize();
    }

    componentDidUpdate() {
        this.testCenterControls();
        this.testSize();
    }

    windowResized() {
        return this.testSize();
    }

    render() {
        return (
                <div className="control-bar">
                    <div className="control-container" id="main-control" ref={this.mainContainer}>
                        <div className="control-wrapper">
                            {this.mainLabel &&
                                <div id="main-control-label" className="control-title">
                                    <p className="control-label">
                                        {this.mainLabel}
                                    </p>
                                    <div className="visualizer-icons">
                                        <div id="big-o-icon" data-tooltip="Big-O Info" tt-bottom="" tt-right="" onClick={this.props.showBigODisplay}>
                                            <FontAwesomeIcon icon={["far","clock"]} size="lg" className="hoverable-icon" />
                                            {// <span id="big-o-tooltip" className="tooltip tt-bottom tt-right">Big-O Info</span>
                                            }
                                        </div>
                                        {this.props.hasExamples &&
                                            <div id="examples-icon" data-tooltip="Examples" tt-bottom="" tt-right="" onClick={this.props.showExamplesDisplay}>
                                                <FontAwesomeIcon icon={["far","lightbulb"]} size="lg" className="hoverable-icon" />
                                                {// <span id="big-o-tooltip" className="tooltip tt-bottom tt-right">Big-O Info</span>
                                                }
                                            </div>
                                        }
                                    </div>
                                </div>
                            }
                            <div className="controls control-group"  ref={this.controlBar}></div>
                        </div>
                    </div>
                    <div className="control-container" id="default-control" ref={this.defaultContainer}>
                        <div className="control-wrapper">
                            {// {this.defaultsLabel && <p className="control-label" id="default-control-label">{this.defaultsLabel}</p>}
                            }
                            <div className="controls default control-group" ref={this.defaults}></div>
                        </div>
                    </div>
                </div>
            );
    }
}
