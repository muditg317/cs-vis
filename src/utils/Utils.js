import React from 'react';

export function addArray(array, ...arrays) {
    let newArr = [...array];
    arrays.forEach(array => {
        array.forEach((item, i) => {
            newArr[i] += item;
        });
    });
    return newArr;
}

export function isDev() {
    return !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
}

export function unfoldUndoRedo(object) {
    let properties = new Set();
    let currObj = object;
    do {
        Object.getOwnPropertyNames(currObj).map(item => properties.add(item));
    } while ((currObj = Object.getPrototypeOf(currObj)));
    let functions = [...properties.keys()].filter(item => typeof object[item] === 'function');
    for (const i in functions) {
        let property = functions[i];
        if (property.includes("undo_")) {
            object[property.substring(5)].undo = object[property];
        }
        if (property.includes("redo_")) {
            object[property.substring(5)].redo = object[property];
        }
    }
}

export const DOM_SELECORS_USING_MOBILE = ["[data-tooltip]", ".canvas-container", ".app"];

export function isMobile() {
    return window.ontouchstart !== undefined;
}

export function addMobileClasses() {
    if (isMobile()) {
        DOM_SELECORS_USING_MOBILE.forEach((selector) => {
            document.querySelectorAll(`${selector}`).forEach((node) => {
                node.classList.add("mobile");
                console.log(node);
            });
        });
    }
}

export function isReactComponent(component) {
    (typeof component === 'function' &&
                (!!component.prototype.isReactComponent
                    || String(component).includes('return React.createElement')))
}

export function windowWidth() {
    return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
}

export function windowHeight() {
    return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
}

export function spannifyText(text, afterTheseString) {
    if (afterTheseString === "CAPITALS") {
        return text.split("").map((char, i) => {
            if (i > 0 && char === char.toUpperCase()) {
                return (
                    <React.Fragment key={i}>
                        <wbr />
                        {char}
                    </React.Fragment>
                );
            }
            return char;
        });
    } else if (afterTheseString) {
        return text.split(new RegExp(`([${afterTheseString}])`,"g")).map((str, i) => {
            if (i > 0) {
                return (
                    <React.Fragment key={i}>
                        <wbr />
                        {str}
                    </React.Fragment>
                );
            }
            return str;
        });
    } else {
        return text.split("").map((char, i) => {
            if (i > 0) {
                return (
                    <React.Fragment key={i}>
                        <wbr />
                        {char}
                    </React.Fragment>
                );
            }
            return char;
        });
    }
}

export function upperFirstChar(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
