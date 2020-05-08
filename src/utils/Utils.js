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

export const DOM_CLASSES_USING_MOBILE = ["tooltip-container","canvas-container"];

export function isMobile() {
    return window.ontouchstart !== undefined;
}

export function addMobileClasses() {
    if (isMobile()) {
        DOM_CLASSES_USING_MOBILE.forEach((className) => {
            document.querySelectorAll(`.${className}`).forEach((node) => {
                node.classList.add("mobile");
                console.log(node);
            });
        });
    }
}
