export default class Animator {
    constructor() {
        this.events = [];

        this.objects = [];
        this.connectingEdges = [];


    }

    on(type, callback) {
        if (!this.events[type]) {
            this.events[type] = [];
        }
        this.events[type].push(callback);
    }

    off(type, callback) {
        if (this.events[type]) {
            this.events[type] = this.events[type].filter( event => {
                return event !== callback;
            });
        }
    }

    emit(type) {
        if (this.events[type]) {
            this.events[type].forEach( event => {
                event();
            });
        }
    }
}
