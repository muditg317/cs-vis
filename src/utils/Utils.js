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
