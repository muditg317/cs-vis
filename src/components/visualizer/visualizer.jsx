import React, { Component } from 'react';
import Sketch from 'react-p5';
import './visualizer.scss';

import ControlBar from './controlBar';

import { ControlBuilder } from '../../utils';
import { Animator } from '../../animation';

export default class Visualizer extends Component {
    constructor(props) {
        super(props);

        //FUNCTION BINDING
        this.setup = this.setup.bind(this);
        this.draw = this.draw.bind(this);
        this.windowResized = this.windowResized.bind(this);

        //config
        this.INITIAL_SPEED = 5;
        this.SPEED_SLIDER_DEGREE = 1.5;


        this.controlBar = new ControlBar();

        this.controlGroups = [];
        this.controls = [];

        this.state = {
            animationSpeed: this.INITIAL_SPEED,
        }

        this.disableUI = this.disableUI.bind(this);
        this.enableUI = this.enableUI.bind(this);

        this.focusedElement = null;

        this.animator = new Animator();
        this.animator.on("anim-start", this.disableUI);
        this.animator.on("anim-end", this.enableUI);


        this.addDefaultControls();
    }

    addDefaultControls() {
        this.speedSlider = ControlBuilder.createSlider(1, 20, Math.pow(this.INITIAL_SPEED,1/this.SPEED_SLIDER_DEGREE), 0);
        this.defaultControlGroup = ControlBuilder.createControlGroup("default", this.speedSlider);
        this.controlBar.setDefaultsLabel("Animation controls");
    }

    addControlLabel(label) {
        this.controlBar.setMainLabel(label);
    }

    addControlGroups(...controlGroups) {
        // console.log("control added");
        this.controlGroups.push(...controlGroups);
        controlGroups.forEach((controlGroup) => {
            this.registerControlGroup(controlGroup);
        });
    }

    registerControlGroup(controlGroup) {
        controlGroup.childNodes.forEach((child) => {
            if (child.tagName === "INPUT") {
                this.controls.push(child);
            } else {
                this.registerControlGroup(child);
            }
        });
    }

    disableUI() {
        // console.log("disable");
        this.controls.forEach((control) => {
            if (control === document.activeElement) {
                this.focusedElement = control;
            }
            control.disabled = true;
        });
    }

    enableUI() {
        // console.log("enable");
        this.controls.forEach((control) => {
            control.disabled = false;
            if (control === this.focusedElement) {
                control.focus();
            }
        });
    }

    componentDidMount() {
        this.controlBar.addDefaultGroup(this.defaultControlGroup);
        this.controlGroups.forEach((controlGroup, i) => {
            this.controlBar.addControlGroup(controlGroup);
        });
    }

    setup(p5, canvasParentRef) {
        // let width = this.controlBar.controlBar.current.getBoundingClientRect().width;
        let height = document.querySelector(".app-content").getBoundingClientRect().height
                - document.querySelector("#main-control").getBoundingClientRect().height
                - document.querySelector("#default-control").getBoundingClientRect().height;

        //config
        p5.createCanvas(p5.windowWidth
            ,height).parent(canvasParentRef);
        // p5.background(200);
        // p5.frameRate(8);

        //objects
        // this.state.visualization = new ArrayList();
        // window.visualization = this.state.visualization;
        // this.setState({isSetup: true,});
    }
    draw(p5) {
        //inputs
        this.setState({animationSpeed: Math.pow(this.speedSlider.value,this.SPEED_SLIDER_DEGREE)});

        p5.background(255);

        //objects
        this.visualization.update(this.state.animationSpeed);
        this.visualization.draw(p5);
    }
    windowResized(p5) {
        //config
        let height = document.querySelector(".app-content").getBoundingClientRect().height
                - document.querySelector("#main-control").getBoundingClientRect().height
                - document.querySelector("#default-control").getBoundingClientRect().height;
        // height = document.querySelector(".react-p5").getBoundingClientRect().height;
        document.querySelector(".canvas-container").style.height = height+"px";
        // console.log(height);
        // p5.resizeCanvas(p5.windowWidth, p5.height);

        //objects
        this.visualization.windowResized(p5, height);
    }


    render() {
        return (
                <div className={`visualizer ${this.class}`}>
                    {this.controlBar.render()}
                    <div className="canvas-container">
                        <Sketch setup={this.setup} draw={this.draw} windowResized={this.windowResized} />
                    </div>
                </div>
            );
    }
}
