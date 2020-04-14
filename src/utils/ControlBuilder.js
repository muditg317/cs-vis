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

    // button.addEventListener("click", disableControls);

    return button;
};

export function createField(prompt, ...validators) {
    let field = createControl("text");
    field.setAttribute("placeHolder", prompt);

    validators.forEach((validator) => {
        field.addEventListener("input", () => { validator(field); });
    });

    return field;
};

export function validatorIntOnly() {
    return (field) => {
        let regex = /-?[0-9]*/g;
        field.value = field.value.match(regex).reduce((sum, char) => sum + char);
    }
};

export function validatorMaxLength(maxLength) {
    return (field) => {
        if (field.value.length > maxLength) {
            field.value = field.value.substring(0, Math.min(field.value.length, maxLength));
        }
    };
};

export function addSubmit(field, callback) {
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
            // disableControls();
            callback();
        }
    });
};

export function createSlider(min, max, defaultValue, step) {
    let slider = createControl("range");

    slider.setAttribute("min", min);
    slider.setAttribute("max", max);
    slider.setAttribute("step", step === 0 ? "1e-18" : step);
    slider.setAttribute("defaultValue", defaultValue);
    slider.value = defaultValue;

    return slider;
};


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
