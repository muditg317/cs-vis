export function newEmptyControl() {
    let emptyControl = document.createElement("input");
    applyStyle(emptyControl, "visibility", "hidden");
    return emptyControl;
}

export function createControl(type, value) {
    let newControl = document.createElement("input");
    newControl.classList.add("visual-control", type);

    newControl.setAttribute("type", type);
    if (value) {
        newControl.setAttribute("value", value);
    }

    return newControl;
};

export function createButton(label, options) {
    // let button = createControl("button", label);

    let button = document.createElement("button");
    button.classList.add("visual-control", "button");
    button.setAttribute("type", "button");
    button.innerHTML = label;

    if (options) {
        if (options.tooltipText) {
            button.setAttribute("data-tooltip",options.tooltipText);
        }
        for (let attr in options.attributes) {
            button.setAttribute(attr, options.attributes[attr]);
        }
    }

    return button;
};

export function addButtonSubmit(visualizer, button, callback, ...fields) {
    if (button.type !== "button") {
        console.log("cannot add callback to nonbutton");
        return;
    }
    if (callback === undefined) {
        console.log(button, "cannot set button submit to undefined callback");
        return;
    }
    button.addEventListener("click", (event) => {
        let args = [];
        fields.forEach((field) => {
            if (args) {
                let f = field.field || field;
                let value = f.parse();
                if (value !== null) {
                    args.push(value);
                } else {
                    args = null;
                }
            }
        });
        if (args) {
            let success = callback(...args);
            if (success) {
                if (button.innerText !== "reset") {
                  visualizer.enableOnReset.forEach(strictControl => {
                    strictControl.disabled = true;
                  });
                }
                fields.forEach((field) => {
                    let f = field.field || field;
                    if (f.clearOnSuccess) {
                        f.value = "";
                    }
                    if (field.focus === true || fields.length === 1) {
                        f.focus();
                    }
                });
            }
        }
    });
}

export function applyNewCallbackButton(visualizer, name, ...fields) {
    let longName = name.longName || name;
    let options = name.options || undefined;
    name = name.name || name;
    visualizer[name + "Button"] = createButton(longName, options);
    addButtonSubmit(visualizer, visualizer[name + "Button"], visualizer[name], ...fields);
    if (options && options.addAnimatorEnableDisable) {
        visualizer.animator.on(`disable-${name}`, () => {
            visualizer[name + "Button"].disabled = true;
        });
        visualizer.animator.on(`enable-${name}`, () => {
            visualizer[name + "Button"].disabled = false;
        });
    }
}

export function applyResetButton(visualizer, prompt, fieldToFocus) {
    visualizer[prompt + "Button"] = createButton(prompt);
    visualizer[prompt + "Button"].addEventListener("click", (event) => {
        for (let property in visualizer) {
            if (property.endsWith("Field") && visualizer[property].constructor === HTMLInputElement && visualizer[property].type === "text") {
                visualizer[property].value = "";
            }
        }
        visualizer.enableOnReset.forEach(control => {
            control.disabled = false;
        });

        if (fieldToFocus) {
            fieldToFocus.focus();
        }
    });
    addButtonSubmit(visualizer, visualizer[prompt + "Button"], visualizer[prompt]);
}

export function createField(prompt, ...validators) {
    let field = createControl("text");
    field.setAttribute("placeHolder", prompt);

    field.inputValidators = validators;
    field.parsers = validators.map(validator => validator.parser);

    field.addEventListener("input", () => {
        field.inputValidators.forEach((validator) => {
            validator(field);
        });
    });

    field.parse = () => {
        let value = field.value;
        let i = 0;
        while (value && i < field.parsers.length) {
            value = field.parsers[i++](value);
        }
        return value || (value === 0 ? 0 : null);
    }

    return field;
};

export function validatorIntOnly() {
    let validator = (field) => {
        let regex = /^[-+]?\d*|\d*/g;
        field.value = field.value.match(regex).reduce((sum, char) => sum + char);
    };
    validator.parser = (value) => {
        let val = parseInt(value);
        if (isNaN(val)) {
            return null;
        } else {
            return val;
        }
    };
    return validator;
};

export function validatorPositiveIntOnly() {
    let validator = (field) => {
        let regex = /^[+]?\d*|\d*/g;
        field.value = field.value.match(regex).reduce((sum, char) => sum + char);
    }
    validator.parser = (value) => {
        let val = Math.abs(parseInt(value));
        if (isNaN(val)) {
            return null;
        } else {
            return val;
        }
    };
    return validator;
};

export function validatorIntList(numLength, maxNums) {
    let validator = (field) => {
        // ^(((\d+)|(\d+-\d+))(,((\d+)|(\d+-\d+)))*)$
        // let regex = /^(((\d+)|(\d+-\d+))(,((\d+)|(\d+-\d+)))*)$/g;
        // let regex = /((\d+)|(\d+-\d+))|(,(\d+)|(\d+-\d+))/g;
        let cursorPos = field.selectionStart;
        let regex = /[+-\d,]/g;
        field.value = (field.value.match(regex) || [""]).reduce((sum, char) => sum + char);
        field.value = field.value.replace(/\+{2,}/g,"+");
        field.value = field.value.replace(/-{3,}/g,"--");
        field.value = field.value.replace(/,{3,}/g,",,");
        if ((field.value.match(/,/g) || []).length > maxNums) {
            field.value = field.value.substring(0, field.value.lastIndexOf(","));
        }
        field.selectionStart = field.selectionEnd = cursorPos;
    };
    validator.parser = (value) => {
        // let regex = /^(((-?\d+)|(-?\d+--?\d+))(,((-?\d+)|(-?\d+--?\d+)))*)$/g;
        let regex = /((-?\d+(--?\d+)*)|(-?\d+))/g;
        let values = value.match(regex);
        let ints = [];
        ints.add = ints.push;
        ints.push = (num) => {
            while (num >= Math.pow(10,numLength) || num <= -Math.pow(10,numLength-1)) {
                num /= 10;
            }
            ints.add(parseInt(num));
        };
        values.forEach((intStr, i, arr) => {
            if (intStr.match(/(-?\d+(--?\d+){2,})/g)) {
                return null;
            } else if (intStr.match(/(-?\d+(--?\d+))/g)) {
                let match = intStr.match(/(-?\d+)-(-?\d+)/);
                let [ first, second ] = [ parseInt(match[1]), parseInt(match[2]) ];
                if (first === second) {
                    ints.push(first);
                } else {
                    if (first < second) {
                        for (let i = first; i <= second; i++) {
                            ints.push(i);
                        }
                    } else {
                        for (let i = first; i >= second; i--) {
                            ints.push(i);
                        }
                    }
                }
            } else {
                ints.push(parseInt(intStr));
            }
        });
        return ints.slice(0, maxNums);
    };
    return validator;
}

export function validatorMaxLength(maxLength) {
    let validator = (field) => {
        if (field.value.length > maxLength) {
            field.value = field.value.substring(0, maxLength);
        }
    };
    validator.parser = (value) => {
        value = String(value);
        if (value.length === 0) {
            return null;
        } else {
            return value.substring(0, maxLength);
        }
    };;
    return validator;
};

export function validatorSkipListHeads() {
    let validator = (field) => {
        let regex = /([HT]+)/gi;
        field.value = (field.value.match(regex) || [""]).reduce((sum, char) => sum + char);
    };
    validator.parser = (value) => {
        let regex = /(^H+T?)/i;
        let val = (value.match(regex) || [""])[0];
        if (val.length === 0) {
            return null;
        } else {
            return (val.match(/H/gi) || []).length;
        }
    };
    return validator;
}

export function addFieldSubmit(visualizer, field, callback, {secondaryRequired = false, secondary = {field: undefined, isFirstParam: false, callback: undefined, clear: false}} = {}) {
    if (field.type !== "text") {
        console.log("cannot add callback to nontextfield");
        return;
    }
    if (callback === undefined) {
        console.log("cannot set field submit to undefined callback");
        return;
    }
    field.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            let value = field.parse();
            if (value !== null) {
                let success;
                let secondaryValue;
                if (secondary.field && (secondaryValue = secondary.field.parse()) !== null) {
                    if (secondaryRequired) {
                        secondary.callback = callback;
                    }
                    if (secondary.isFirstParam) {
                        success = secondary.callback(secondaryValue,value) !== false;
                    } else {
                        success = secondary.callback(value,secondaryValue) !== false;
                    }
                } else if (!secondaryRequired) {
                    success = callback(value) !== false;
                }
                if (success) {
                    visualizer.enableOnReset.forEach(strictControl => {
                      strictControl.disabled = true;
                    });
                    if (field.clearOnSuccess) {
                        field.value = "";
                    }
                    if (secondary.field && secondary.clear) {
                        secondary.field.value = "";
                    }
                }
            }
        }
    });
};

export function applyFieldWithOptions(visualizer, name, ...validators) {
    let prompt = name.prompt || name.longName || name.name || name;
    let args = name.args || {};
    let classes = name.classes || [];
    let callback = name.callback !== false ? (name.callback || name.name || name) : null;
    name = name.name || name;
    visualizer[name + "Field"] = createField(prompt, ...validators);
    let defaultArgs = {clearOnSuccess: true, size: 20};
    for (let property in defaultArgs) {
        visualizer[name + "Field"][property] = defaultArgs[property];
    }
    for (let property in (args || {})) {
        visualizer[name + "Field"][property] = args[property];
    }
    visualizer[name + "Field"].classList.add(...classes);
    if (callback) {
        addFieldSubmit(visualizer, visualizer[name + "Field"], visualizer[callback]);
    }
}

export function createLabel(text, control) {
    let newLabel = document.createElement("label");
    newLabel.classList.add("visual-control","label");

    newLabel.setAttribute("for", control.id);
    newLabel.innerHTML = text;

    return newLabel;
}

export function createSlider(min, max, defaultValue, step) {
    let slider = createControl("range");

    slider.setAttribute("min", min);
    slider.setAttribute("max", max);
    slider.setAttribute("step", step === 0 ? "1e-18" : step);
    slider.setAttribute("defaultValue", defaultValue);
    slider.value = defaultValue;

    return slider;
};

function createRadioButton(name, value) {
    let text = value.longText || value;
    value = value.value || value;
    let buttonContainer = document.createElement("div");
    buttonContainer.classList.add("radio-button-container");
    let radioButton = createControl("radio", value);
    radioButton.name = name;
    radioButton.tabindex = 0;
    radioButton.addEventListener("focus", (event) => {
        radioButton.blur();
    });
    let label = createLabel(text, radioButton);
    buttonContainer.appendChild(radioButton);
    buttonContainer.appendChild(label);
    buttonContainer.addEventListener("click", () => {
        radioButton.click();
        radioButton.focus();
    });
    return buttonContainer;
}

export function createRadio(name, ...options) {
    let radioContainer = document.createElement("div");
    radioContainer.classList.add("radio-container", "visual-control")
    radioContainer.id = name;
    options.forEach((option) => {
        let radioButtonContainer = createRadioButton(name, option);
        radioContainer.appendChild(radioButtonContainer);
    });
    radioContainer.childNodes[0].childNodes[0].checked = true;
    return radioContainer;
}

export function addRadioSubmit(radioContainer, callback) {
    radioContainer.childNodes.forEach((radioButtonContainer) => {
        radioButtonContainer.childNodes[0].addEventListener("change", () => {
            callback(radioButtonContainer.childNodes[0].value);
        });
    });
}

export function addStrictRadioSubmit(visualizer, radioContainer, callback) {
    let radioButtons = Array.prototype.map.apply(radioContainer.childNodes, [radioButtonContainer => radioButtonContainer.childNodes[0]]);
    visualizer.enableOnReset.push(...radioButtons);
    radioButtons.forEach(radioButton => {
        radioButton.addEventListener("change", () => {
            callback(radioButton.value);
        });
    });
}

function createCheckButton(name, value) {
    let text = value.longText || value;
    let checked = value.checked || false;
    value = value.value || value;
    let buttonContainer = document.createElement("div");
    buttonContainer.classList.add("check-button-container");
    let checkButton = createControl("checkbox", value);
    checkButton.name = name;
    checkButton.tabindex = 0;
    checkButton.addEventListener("focus", (event) => {
        checkButton.blur();
    });
    if (checked) {
        checkButton.checked = true;
    }
    let label = createLabel(text, checkButton);
    buttonContainer.appendChild(checkButton);
    buttonContainer.appendChild(label);
    buttonContainer.addEventListener("click", (event) => {
        if (event.target !== checkButton) {
            checkButton.click();
            checkButton.focus();
        }
    });
    return buttonContainer;
}

export function createCheckBox(name, ...options) {
    let checkBoxContainer = document.createElement("div");
    checkBoxContainer.classList.add("checkbox-container", "visual-control")
    checkBoxContainer.id = name;
    options.forEach((option) => {
        let checkButtonContainer = createCheckButton(name, option);
        checkBoxContainer.appendChild(checkButtonContainer);
    });
    return checkBoxContainer;
}

export function addCheckBoxSubmit(checkBoxContainer, callback) {
    let max1Checked = callback.max1Checked || false;
    callback = callback.callback || callback;
    checkBoxContainer.childNodes.forEach((checkButtonContainer) => {
        checkButtonContainer.childNodes[0].addEventListener("click", () => {
            let checkedButton = checkButtonContainer.childNodes[0];
            let checkedValues = {};
            checkBoxContainer.childNodes.forEach((checkButtonBox) => {
                let checkButton = checkButtonBox.childNodes[0];
                checkedValues[checkButton.value] = checkButton.checked;
                if (max1Checked && checkButton !== checkedButton) {
                    checkButton.checked = false;
                    checkedValues[checkButton.value] = false;
                }
            });
            callback(checkedValues);
        });
    });
}


export function createControlGroup(id, ...controls) {
    let classes = id.classes || [];
    id = id.id || id;
    let controlGroup = document.createElement("div");
    controlGroup.classList.add("control-group", ...classes);
    controlGroup.id = id;

    controls.forEach((control) => {
        controlGroup.appendChild(control);
    });

    return controlGroup;
};

export function setTabControl(control, nextControl) {
    if (control === undefined || nextControl === undefined) {
        console.log("cannot link undefined controls");
        return;
    }
    enableShift();
    control.addEventListener("keydown", (event) => {
        if (event.key === "Tab" && (window.shifted !== undefined && !window.shifted)) {
            event.preventDefault();
            control.blur();
            nextControl.focus();
        }
    });
    nextControl.addEventListener("keydown", (event) => {
        if (event.key === "Tab" && window.shifted) {
            event.preventDefault();
            nextControl.blur();
            control.focus();
        }
    });
};

function enableShift() {
    if (window.shifted === undefined) {
        window.shifted = false;
        window.addEventListener("keydown", (event) => {
            if (event.key === "Shift") {
                event.preventDefault();
                window.shifted = true;
            }
        });
        window.addEventListener("keyup", (event) => {
            if (event.key === "Shift") {
                event.preventDefault();
                window.shifted = false;
            }
        });
    }
};

export function applyStyle(control, styleType, value) {
    control.style[styleType] = value;
}
