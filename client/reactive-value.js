class ReactiveValue {

    constructor(initialValue){
        this._subscribers = [];

        if (arguments.length > 0) {
            this._value = initialValue;
            this._hasValue = true;
        } else {
            this._hasValue = false;
        }
    }

    //noinspection JSUnusedGlobalSymbols
    set(value) {
        this._value = value;
        this._hasValue = true;
        this._notify();
    }

    _notify(){
        for (let fn of this._subscribers) {
            fn(this._value);
        }
    }

    //noinspection JSUnusedGlobalSymbols
    subscribe(fn) {
        if (this._hasValue) {
            fn(this._value);
        }

        this._subscribers.push(fn);

        return () => {
            const index = this._subscribers.indexOf(fn);
            if (index > 0) {
                this._subscribers.splice(index, 1);
            }
        }
    }
}

export function create(initial) {
    return new ReactiveValue(initial);
}

export function empty() {
    return new ReactiveValue();
}