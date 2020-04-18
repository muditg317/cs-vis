import React, { PureComponent } from 'react';
import './controlBar.scss';

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
        this.testSize();
    }

    componentDidUpdate() {
        this.testSize();
    }

    windowResized() {
        return this.testSize();
    }

    render() {
        return (
                <div className="control-bar">
                    <div className="control-container" id="main-control" ref={this.mainContainer}>
                        {this.mainLabel && <p className="control-label" id="main-control-label">{this.mainLabel}</p>}
                        <div className="controls control-group"  ref={this.controlBar}></div>
                    </div>
                    <div className="control-container" id="default-control" ref={this.defaultContainer}>
                        {// {this.defaultsLabel && <p className="control-label" id="default-control-label">{this.defaultsLabel}</p>}
                        }
                        <div className="controls default control-group" ref={this.defaults}></div>
                    </div>
                </div>
            );
    }
}
