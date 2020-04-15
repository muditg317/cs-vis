import React, { PureComponent } from 'react';
import Sketch from 'react-p5';
import './visualizer.scss';

import ControlBar from './controlBar';

import { ControlBuilder } from 'utils';
import { Animator } from 'animation';

export default class Visualizer extends PureComponent {

    static INITIAL_SPEED = 50;
    static MAX_SPEED = 20;
    static SPEED_SLIDER_DEGREE = 1.5;

    static maxAnimationSpeed() {
        return Math.pow(Visualizer.MAX_SPEED, Visualizer.SPEED_SLIDER_DEGREE);
    }

    constructor(props) {
        super(props);

        //FUNCTION BINDING
        this.setup = this.setup.bind(this);
        this.draw = this.draw.bind(this);
        this.mousePressed = this.mousePressed.bind(this);
        this.mouseReleased = this.mouseReleased.bind(this);
        this.windowResized = this.windowResized.bind(this);


        this.controlBarRef = React.createRef();

        this.controlGroups = [];
        this.controls = [];

        this.state = {
            animationSpeed: Visualizer.INITIAL_SPEED,
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
        this.speedSlider = ControlBuilder.createSlider(1, Visualizer.MAX_SPEED, Math.pow(Visualizer.INITIAL_SPEED,1/Visualizer.SPEED_SLIDER_DEGREE), 0);
        this.defaultControlGroup = ControlBuilder.createControlGroup("default", this.speedSlider);
        this.defaultsLabel = "Animation controls";
    }

    addControlLabel(label) {
        this.mainLabel = label;
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
        this.controlBar = this.controlBarRef.current;
        this.controlBar.setMainLabel(this.mainLabel);
        this.controlBar.setDefaultsLabel(this.defaultsLabel);
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

        this.mobile = window.ontouchstart !== undefined;
        if (this.mobile) {
            height = 1000;
            // document.querySelector(".canvas-container").style.height = height + "px";
            document.querySelector(".canvas-container").classList.add("mobile");
        }

        //config
        let canvas = p5.createCanvas(p5.windowWidth
            ,height);
        canvas.parent(canvasParentRef);

        canvas.touchStarted(event => {
            event.preventDefault();
        });
        // p5.background(200);
        // p5.frameRate(8);

        //objects
        // this.state.visualization = new ArrayList();
        // window.visualization = this.state.visualization;
        // this.setState({isSetup: true,});
        //
        document.addEventListener("resize", (event) => {
            console.log("resize");
        });
    }
    draw(p5) {
        //inputs
        this.setState({animationSpeed: Math.pow(this.speedSlider.value,Visualizer.SPEED_SLIDER_DEGREE)});

        p5.background(255);

        //objects
        this.visualization.update(this.state.animationSpeed, p5);
        this.visualization.draw(p5);
    }
    mousePressed(p5) {
        if (this.visualization.mousePressed) {
            return this.visualization.mousePressed(p5);
        }
        return true;
    }
    mouseReleased(p5) {
        if (this.visualization.mouseReleased) {
            return this.visualization.mouseReleased(p5);
        }
        return true;
    }
    windowResized(p5) {
        //config
        let height = document.querySelector(".app-content").getBoundingClientRect().height
                - document.querySelector("#main-control").getBoundingClientRect().height
                - document.querySelector("#default-control").getBoundingClientRect().height;
        if (this.mobile) {
            // height = 1000;
        }
        // height = document.querySelector(".react-p5").getBoundingClientRect().height;
        document.querySelector(".canvas-container").style.height = height+"px";
        height = document.querySelector(".canvas-container").getBoundingClientRect().height;
        // console.log(height);
        // p5.resizeCanvas(p5.windowWidth, p5.height);

        //objects
        this.visualization.windowResized(p5, height);
    }


    render() {
        return (
                <div className={`visualizer ${this.class}`}>
                    <ControlBar ref={this.controlBarRef}/>
                    {
                        !this.visualization || this.visualization.constructor.USE_CANVAS ?
                                <div className="canvas-container">
                                    <Sketch setup={this.setup} draw={this.draw} windowResized={this.windowResized} mousePressed={this.mousePressed} mouseReleased={this.mouseReleased} touchStarted={this.mousePressed} />
                                </div>
                            :
                                this.visualization.render()
                    }
                </div>
            );
    }
}
