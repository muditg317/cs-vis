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

export function createButton(label) {
    let button = createControl("button", label);

    return button;
};

export function addButtonSubmit(button, callback, ...fields) {
    if (button.type !== "button") {
        console.log("cannot add callback to nonbutton");
        return;
    }
    if (callback === undefined) {
        console.log("cannot set button submit to undefined callback");
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
            callback(...args);
            fields.forEach((field) => {
                let f = field.field || field;
                if (f.clearOnSuccess) {
                    f.value = "";
                }
                if (field.focus || fields.length === 1) {
                    f.focus();
                }
            });
        }
    });
}

export function applyNewCallbackButton(visualizer, name, ...fields) {
    let longName = name;
    if (name.longName) {
        longName = name.longName;
        name = name.name;
    }
    visualizer[name + "Button"] = createButton(longName);
    addButtonSubmit(visualizer[name + "Button"], visualizer[name], ...fields);
}

export function createField(prompt, clearOnSuccess, ...validators) {
    let field = createControl("text");
    field.setAttribute("placeHolder", prompt);

    field.clearOnSuccess = clearOnSuccess;

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

export function addFieldSubmit(field, callback, {secondaryRequired = false, secondary = {field: undefined, isFirstParam: false, callback: undefined, clear: false}} = {}) {
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
    let radioButton = createControl("radio", value);
    radioButton.name = name;
    return radioButton;
}

export function createRadio(name, ...options) {
    let radioContainer = document.createElement("div");
    radioContainer.classList.add("radioContainer")
    radioContainer.id = name;
    options.forEach((option) => {
        let radioButton = createRadioButton(name, option);
        radioContainer.appendChild(radioButton);
    });
    radioContainer.children[0].checked = true;
    return radioContainer;
}

export function addRadioSubmit(radioContainer, callback) {
    let value;
    radioContainer.children.forEach((radioButton) => {
        if (radioButton.checked) {
            value = radioButton.value;
        }
    });
    callback(value);
}


export function createControlGroup(id, ...controls) {
    let controlGroup = document.createElement("div");
    controlGroup.setAttribute("class", "control-group");
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
