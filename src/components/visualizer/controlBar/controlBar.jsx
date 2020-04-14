import React, { PureComponent } from 'react';
import './controlBar.scss';

export default class ControlBar extends PureComponent {

    constructor(props) {
        super(props);

        this.defaults = React.createRef();
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

    render() {
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
