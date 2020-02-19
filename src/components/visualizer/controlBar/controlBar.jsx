import React, { Component } from 'react';
import './controlBar.scss';

export default class ControlBar extends Component {

    constructor(props) {
        super(props);

        this.defaults = React.createRef();
        this.controlBar = React.createRef();
    }

    setDefaultsLabel(label) {
        this.defaultsLabel = label;
    }

    setMainLabel(label) {
        this.mainLabel = label;
    }

    addDefaultGroup(controlGroup) {
        this.defaults.current.appendChild(controlGroup);
    }

    addControlGroup(controlGroup) {
        this.controlBar.current.appendChild(controlGroup);
    }

    render() {
        // this.controlBar.forEach((control) => {
        //     if (control.classList.)
        // });

        return (
                <div className="control-bar">
                    <div className="control-container" id="main-control">
                        {this.mainLabel && <p className="control-label" id="main-control-label">{this.mainLabel}</p>}
                        <div className="controls control-group"  ref={this.controlBar}></div>
                    </div>
                    <div className="control-container" id="default-control">
                        {// {this.defaultsLabel && <p className="control-label" id="default-control-label">{this.defaultsLabel}</p>}
                        }
                        <div className="controls default control-group" ref={this.defaults}></div>
                    </div>
                </div>
            );
    }
}
