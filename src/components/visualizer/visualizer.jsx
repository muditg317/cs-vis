import React, { PureComponent } from 'react';
import Sketch from 'react-p5';
import { Helmet } from 'react-helmet';
import './visualizer.scss';

import ControlBar from './controlBar';
import BigOWindow from './bigOWindow';
import ExamplesWindow from './examplesWindow';
import DescriptionWindow from './descriptionWindow';

import { ControlBuilder, Utils } from 'utils';
import { Animator } from 'animation';

export default class Visualizer extends PureComponent {
    static VISUALIZATION_METHODS = ["skipBack","stepBack","playPause","stepForward","skipForward"];

    static CONTROLS_ONLY_ACTIVE_UNPAUSED = ["radio","checkbox"];

    static MAX_SPEED = 20;
    static SPEED_SLIDER_DEGREE = 1.5;

    static maxAnimationSpeed() {
        return Math.pow(this.constructor.MAX_SPEED, this.constructor.SPEED_SLIDER_DEGREE);
    }

    constructor(props) {
        super(props);

        this[this.constructor.ADT_NAME] = null;

        //INHERIT METHODS FROM VISUALIZATION
        let currConstructor = this.constructor;
        while (currConstructor) {
            (currConstructor.VISUALIZATION_METHODS || []).forEach((methodName) => {
                this[methodName] = (...args) => {
                    if (this[this.constructor.ADT_NAME][methodName]) {
                        return this[this.constructor.ADT_NAME][methodName](...args);
                    } else {
                        if (Utils.isDev()) {
                            console.log(this[this.constructor.ADT_NAME], methodName, ...args);
                        }
                    }
                    // return this[this.constructor.ADT_NAME][methodName](...args);
                };
            });
            currConstructor = currConstructor.__proto__;
        }


        //FUNCTION BINDING
        this.preload = this.preload.bind(this);
        this.setup = this.setup.bind(this);
        this.draw = this.draw.bind(this);
        this.mousePressed = this.mousePressed.bind(this);
        this.touchMoved = this.touchMoved.bind(this);
        this.mouseReleased = this.mouseReleased.bind(this);
        this.windowResized = this.windowResized.bind(this);

        this.controlBarRef = React.createRef();

        this.controlGroups = [];
        this.defaultControlGroups = [];
        this.controls = [];

        // this.animationSpeed = this.constructor.VISUALIZATION_CLASS.INITIAL_SPEED;

        this.onAnimStart = this.onAnimStart.bind(this);
        this.onAnimEnd = this.onAnimEnd.bind(this);
        this.animating = false;

        this.focusedElement = null;

        this.animator = new Proxy(new Animator(), {
            get: function (target, propertyName, receiver) {
                if (target[propertyName]) {
                    return target[propertyName];
                } else {
                    return (param) => target.emit(propertyName + (param ? ("-" + param) : ""));
                }
            }
        });
        this.animator.on("anim-start", this.onAnimStart);
        this.animator.on("anim-end", this.onAnimEnd);

        this.enableOnReset = [];
        this.addControlLabel(this.constructor.NAME);
        this.addControls();
        this.addDefaultControls();

        this.state = {
            showBigO: false,
            showExamples: false,
            showDescription: false
        };
        this.disabledControls = [];
        this.bigOWindow = React.createRef();
        this.examplesWindow = React.createRef();
        this.descriptionWindow = React.createRef();
    }

    addDefaultControls() {
        this.speedSlider = ControlBuilder.createSlider(1, this.constructor.MAX_SPEED, Math.pow(this.constructor.INITIAL_SPEED,1/this.constructor.SPEED_SLIDER_DEGREE), 0);
        let sliderLabel = ControlBuilder.createLabel("Animation Speed", this.speedSlider);
        let speedSliderGroup = ControlBuilder.createControlGroup("speedSliderGroup", this.speedSlider, sliderLabel);
        let extraGroups = []
        if (this.constructor.VISUALIZATION_CLASS.SUPPORTS_ANIMATION_CONTROL) {
            ControlBuilder.applyNewCallbackButton(this, {name: "skipBack", longName: "Skip Back",
                    options: {
                        attributes: {
                            "data-tooltip": "Shift+←",
                            "tt-bottom-110":true,
                            "tt-left-0":true,
                            disabled: true
                        },
                        addAnimatorEnableDisable: true
                }});
            ControlBuilder.applyNewCallbackButton(this, {name: "stepBack", longName: "Step Back",
                    options: {
                        attributes: {
                            "data-tooltip": "←",
                            "tt-bottom-110":true,
                            "tt-left-0":true,
                            disabled: true
                        },
                        addAnimatorEnableDisable: true
                }});
            ControlBuilder.applyNewCallbackButton(this, {name: "playPause", longName: "Pause",
                    options: {
                        attributes: {
                            "data-tooltip": "SpaceBar",
                            "tt-bottom-110":true,
                            "tt-h-mid":true
                        },
                }});
            this.animator.on("enable-playPause", () => {
                this.playPauseButton.innerHTML = this.visualization.paused ? "Play" : "Pause";
            });
            ControlBuilder.applyNewCallbackButton(this, {name: "stepForward", longName: "Step Forward",
                    options: {
                        attributes: {
                            "data-tooltip": "→",
                            "tt-bottom-110":true,
                            "tt-right-0":true,
                            disabled: true
                        },
                        addAnimatorEnableDisable: true
                }});
            ControlBuilder.applyNewCallbackButton(this, {name: "skipForward", longName: "Skip Forward",
                    options: {
                        attributes: {
                            "data-tooltip": "Shift+→",
                            "tt-bottom-110":true,
                            "tt-right-0":true,
                            disabled: true
                        },
                        addAnimatorEnableDisable: true
                }});

            extraGroups.push(ControlBuilder.createControlGroup("stepButtonGroup",this.skipBackButton,this.stepBackButton,this.playPauseButton,this.stepForwardButton,this.skipForwardButton));
            let animationControls = ControlBuilder.createControlGroup("animationControls",...extraGroups);
            ControlBuilder.applyStyle(animationControls,"width","27.6em");//needed to prevent overlap from slider?????????????
            this.defaultControlGroups.push(animationControls);
        }
        this.defaultControlGroups.push(speedSliderGroup);
        this.defaultsLabel = "Animation controls";
    }

    addControlLabel(label) {
        this.mainLabel = label;
    }

    addControlGroups(...controlGroups) {
        this.controlGroups.push(...controlGroups);
        controlGroups.forEach((controlGroup) => {
            if (!controlGroup.classList.contains("control-group")) {
                this.controls.push(controlGroup);
            } else {
                this.registerControlGroup(controlGroup);
            }
        });
    }

    registerControlGroup(controlGroup) {
        controlGroup.childNodes.forEach((child) => {
            if (!child.classList.contains("control-group")) {
                this.controls.push(child);
            } else {
                this.registerControlGroup(child);
            }
        });
    }

    onAnimStart() {
        this.disableUI();
        if (this.constructor.VISUALIZATION_CLASS.SUPPORTS_NO_LOOP) {
            // this.animator.loop();
        }
        this.animating = true;
    }

    onAnimEnd() {
        this.enableUI();
        if (this.constructor.VISUALIZATION_CLASS.SUPPORTS_NO_LOOP) {
            // this.animator.noLoop();
        }
        this.animating = false;
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
            control.disabled = this.visualization.paused && this.constructor.CONTROLS_ONLY_ACTIVE_UNPAUSED.includes(control.type);
            if (control === this.focusedElement) {
                control.focus();
            }
        });
    }

    testVisualizationDimensions(p5) {
        let height = document.querySelector(".canvas-container").getBoundingClientRect().height;
        let width = document.querySelector(".canvas-container").getBoundingClientRect().width;
        // console.log(height);
        // p5.resizeCanvas(p5.windowWidth, p5.height);

        //objects
        let numScrollbars = this.controlBar.windowResized();
        this.visualization.windowResized(p5, height, numScrollbars, this.constructor.VISUALIZATION_CLASS.HAS_MIN_WIDTH ? width : undefined);
    }

    componentDidMount() {
        let height = document.querySelector(".canvas-container").getBoundingClientRect().height;
        let width = document.querySelector(".canvas-container").getBoundingClientRect().width;
        this[this.constructor.ADT_NAME] = new this.constructor.VISUALIZATION_CLASS(this.animator, width, height);
        this.visualization = this[this.constructor.ADT_NAME];
        if (this.constructor.VISUALIZATION_CLASS.SUPPORTS_ANIMATION_CONTROL) {
            this.controlPressed = false;
            this.shiftPressed = false;
            this.pressedDict = {};
            document.addEventListener("keydown", (event) => {
                if (!this.pressedDict[event.key]) {
                    this.pressedDict[event.key] = true;
                    this.controlPressed = event.key === "Control" || this.controlPressed;
                    this.shiftPressed = event.key === "Shift" || this.shiftPressed;
                    let visEventHappened = false;
                    if (event.key === "z" && this.controlPressed) {
                        visEventHappened = this.visualization.undo();
                    } else if (event.key === "ArrowLeft") {
                        if (this.shiftPressed) {
                            visEventHappened = this.visualization.skipBack();
                        } else {
                            visEventHappened = this.visualization.stepBack();
                        }
                    } else if (event.key === "ArrowRight") {
                        if (this.shiftPressed) {
                            visEventHappened = this.visualization.skipForward();
                        } else {
                            visEventHappened = this.visualization.stepForward();
                        }
                    } else if (event.key === " ") {
                        visEventHappened = this.visualization.playPause();
                    }
                    if (visEventHappened) {
                        event.preventDefault();
                    }
                }
            });
            document.addEventListener("keyup", (event) => {
                if (this.pressedDict[event.key]) {
                    this.pressedDict[event.key] = false;
                    this.controlPressed = this.controlPressed && !(event.key === "Control");
                    this.shiftPressed = this.shiftPressed && !(event.key === "Shift");
                }
            });
        }
        if (Utils.isDev()) {
            window.vis = this.visualization;
        } else {

        }
        this.controlBar = this.controlBarRef.current;
        this.controlBar.setMainLabel(this.mainLabel);
        this.controlBar.setDefaultsLabel(this.defaultsLabel);
        this.defaultControlGroups.forEach((defaultGroup) => {
            this.controlBar.addDefaultGroup(defaultGroup);
        });
        this.controlGroups.forEach((controlGroup) => {
            this.controlBar.addControlGroup(controlGroup);
        });
        this.mounted = true;
        this.forceUpdate();
    }

    componentDidUpdate(prevProps, prevState) {
        // console.log("update");
        Utils.addMobileClasses();
    }

    componentWillUnmount() {

    }

    preload(p5) {
        if (Utils.isDev()) {
            p5.disableFriendlyErrors = true;
        }
    }

    setup(p5, canvasParentRef) {
        // let width = this.controlBar.controlBar.current.getBoundingClientRect().width;
        let height = document.querySelector(".app-content").getBoundingClientRect().height
                - document.querySelector("#main-control").getBoundingClientRect().height
                - document.querySelector("#default-control").getBoundingClientRect().height;

        // this.mobile = window.ontouchstart !== undefined;
        // if (this.mobile) {
        //     height = 1000;
        //     // document.querySelector(".canvas-container").style.height = height + "px";
        //     document.querySelector(".canvas-container").classList.add("mobile");
        // }

        //config
        let canvas = p5.createCanvas(p5.windowWidth
            ,height);
        canvas.parent(canvasParentRef);
        //
        // canvas.touchStarted((event) => {
        //     console.log("touchdown");
        //     if (!this.mousePressed(p5)) {
        //         event.preventDefault();
        //     }
        //     // event.preventDefault();
        // });
        //
        // canvas.touchMoved((event) => {
        //     console.log("touchmove");
        //     if (!this.touchMoved(p5)) {
        //         // event.preventDefault();
        //     }
        //     return true;
        //     // event.preventDefault();
        // });
        //
        // canvas.touchEnded(() => {
        //     console.log("touchup");
        //     this.mouseReleased(p5);
        //     // event.preventDefault();
        // });
        // canvas.mousePressed(() => {
        //     console.log("mousedown");
        //     if (!this.mousePressed(p5)) {
        //         // event.preventDefault();
        //     }
        // });
        // canvas.mouseReleased(() => {
        //     console.log("mouseup");
        //     this.mouseReleased(p5);
        //     // event.preventDefault();
        // });
        // p5.background(200);
        // p5.frameRate(8);

        // document.addEventListener("resize", (event) => {
        //     console.log("resize");
        // });
        this.animator.on("noLoop", () => {
            // console.log("noLoop");
            p5.noLoop();
        });
        this.animator.on("loop", () => {
            // console.log("loop");
            p5.loop();
        });
        // this.animator.on("paused", () => {
        //
        // });
        this.animator.on("testWindowSize", () => {
            // this.visualization.resizing = true;
            this.testVisualizationDimensions(p5);
        });
        this.windowResized(p5);

        if (this.constructor.VISUALIZATION_CLASS.SUPPORTS_NO_LOOP) {
            this.animator.noLoop();
        }
    }
    draw(p5) {
        //inputs
        let animationSpeed = Math.pow(this.speedSlider.value,this.constructor.SPEED_SLIDER_DEGREE);

        p5.background(255);

        //objects
        this.visualization.update(animationSpeed, p5);
        this.visualization.draw(p5);

        // if (!this.animating) {
        //     if (this.constructor.VISUALIZATION_CLASS.SUPPORTS_NO_LOOP) {
        //         this.animator.noLoop();
        //     }
        // }
    }
    mousePressed(p5) {
        if (this.visualization.mousePressed) {
            // console.log("down");
            //let pressed =
            this.visualization.mousePressed(p5);
            // console.log(pressed);
            return false;
        }
        return true;
    }
    touchMoved(p5) {
        if (this.visualization.touchMoved) {
            // console.log("move");
            return this.visualization.touchMoved();
        }
        return true;
    }
    mouseReleased(p5) {
        if (this.visualization.mouseReleased) {
            // console.log("up");
            //let released =
            this.visualization.mouseReleased(p5);
            // console.log(released);
            return false;
        }
        return true;
    }
    windowResized(p5) {
        // console.log("resize");

        //cosmetics for visualizer label
        let controlWidth = Array.from(document.querySelector("#main-control-label + .controls").childNodes).map(node => node.getBoundingClientRect().width).reduce((sum,curr) => sum + curr);
        controlWidth = Math.min(controlWidth, p5.windowWidth);
        let label = document.querySelector("#main-control-label");
        let labelWidth = label.getBoundingClientRect().width;
        label.style.left = Math.max(0, (controlWidth - labelWidth) / 2) + "px";

        //config
        let height = document.querySelector(".app-content").getBoundingClientRect().height
                - document.querySelector("#main-control").getBoundingClientRect().height
                - document.querySelector("#default-control").getBoundingClientRect().height;
        if (this.mobile) {
            // height = 1000;
        }
        // height = document.querySelector(".react-p5").getBoundingClientRect().height;
        document.querySelector(".canvas-container").style.height = height+"px";
        this.testVisualizationDimensions(p5);
    }

    showBigODisplay() {
        if (!this.state.showBigO) {
            this.setState({showBigO: true});
            this.disabledControls = [];
            document.querySelectorAll(".control-bar input, .control-bar button").forEach((input) => {
                if (!input.disabled) {
                    this.disabledControls.push(input);
                    input.disabled = true;
                }
            });
        }
    }

    closeBigODisplay() {
        this.setState({showBigO: false});
        while (this.disabledControls.length) {
            this.disabledControls.pop().disabled = false;
        }
    }

    showExamplesDisplay() {
        if (!this.state.showExamples) {
            this.setState({showExamples: true});
            this.disabledControls = [];
            document.querySelectorAll(".control-bar input, .control-bar button").forEach((input) => {
                if (!input.disabled) {
                    this.disabledControls.push(input);
                    input.disabled = true;
                }
            });
        }
    }

    closeExamplesDisplay(...exampleParams) {
        this.setState({showExamples: false});
        while (this.disabledControls.length) {
            this.disabledControls.pop().disabled = false;
        }
        if (exampleParams && exampleParams.length) {
            this.visualization.doExample(...exampleParams);
        }
    }

    showDescriptionDisplay() {
        if (!this.state.showDescription) {
            this.setState({showDescription: true});
            this.disabledControls = [];
            document.querySelectorAll(".control-bar input, .control-bar button").forEach((input) => {
                if (!input.disabled) {
                    this.disabledControls.push(input);
                    input.disabled = true;
                }
            });
        }
    }

    closeDescriptionDisplay(...exampleParams) {
        this.setState({showDescription: false});
        while (this.disabledControls.length) {
            this.disabledControls.pop().disabled = false;
        }
    }

    render() {
        return (
                <div className={`visualizer ${this.constructor.DIV_CLASS}`}>
                    <Helmet>
                        <title>{this.mainLabel} – CS-Vis</title>
                    </Helmet>
                    <ControlBar ref={this.controlBarRef}
                            showBigODisplay={this.showBigODisplay.bind(this)}
                            hasExamples={this.props.visualizerClass.examples && this.props.visualizerClass.examples.length > 0}
                            showExamplesDisplay={this.showExamplesDisplay.bind(this)}
                            hasDescription={this.props.visualizerClass.description && this.props.visualizerClass.description.length > 0}
                            showDescriptionDisplay={this.showDescriptionDisplay.bind(this)} />
                    {this.state.showDescription &&
                        <DescriptionWindow ref={this.descriptionWindow} title={this.mainLabel} closeDescriptionDisplay={this.closeDescriptionDisplay.bind(this)}/>
                    }
                    {this.state.showBigO &&
                        <BigOWindow ref={this.bigOWindow} title={this.mainLabel} closeBigODisplay={this.closeBigODisplay.bind(this)}/>
                    }
                    {this.state.showExamples &&
                        <ExamplesWindow ref={this.examplesWindow} title={this.mainLabel} closeExamplesDisplay={this.closeExamplesDisplay.bind(this)}/>
                    }
                    {
                        !Utils.isReactComponent(this.constructor.VISUALIZATION_CLASS) ?
                                <div className="canvas-container">
                                    {
                                        this.mounted ?
                                                <Sketch preload={this.preload} setup={this.setup} draw={this.draw} windowResized={this.windowResized} mousePressed={this.mousePressed} mouseReleased={this.mouseReleased} touchStarted={this.mousePressed} touchEnded={this.mouseReleased} touchMoved={this.touchMoved}/>
                                            :
                                                <p>Loading Sketch</p>
                                    }
                                </div>
                            :
                                <this.constructor.VISUALIZATION_CLASS />
                    }
                </div>
            );
    }
}
