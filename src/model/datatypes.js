import { Helper } from './../utils/helper.js';
import { Validator } from './../utils/validator.js';

class DataType {
    className = Helper.classFromObject(this);

    constructor(obj) {
        Validator.checkArgumentType(obj, "obj", Object);
        Object.assign(this, obj);
    }

    static reviver(k,v) {
        if (v === null || v.className === null) {
            return v;
        }
        switch (v.className) {
            case 'Primitive':
                return new Primitive(v);
            case 'List':
                return new List(v);
            case 'Matrix':
                return new Matrix(v);
            case 'Map':
                return new Map(v);
            default:
                return v;
        }
    }
}

class Primitive extends DataType {
    type

    constructor(obj) {
        super(obj);
        Validator.checkArgumentType(obj.type, "obj.type", "string");
        Object.assign(this, obj);
    }

    static list() {
        return Object.values(Primitive).map(e => e.type);
    }

    static find(type) {
        return Object.entries(Primitive).find(e => e[0] === type)[1];
    }

    static Boolean = new Primitive({type:"Boolean"});
    static String = new Primitive({type:"String"});
    static Integer = new Primitive({type:"Integer"});
    static Real = new Primitive({type:"Real"});
}

class Collection extends DataType {
    constructor(obj) {
        super(obj);
    }
}

class List extends Collection {
    element;

    constructor(obj) {
        super(obj);
        Validator.checkArgumentType(obj.element, "obj.element", DataType);
        Object.assign(this, obj);
    }
}

class Matrix extends Collection {
    innerElement;
    element;

    constructor(obj) {
        super(obj);
        Validator.checkArgumentType(obj.innerElement, "obj.innerElement", DataType);
        Object.assign(this, obj);
        this.element = obj.element ?? new List({element: this.innerElement});
    }
}

class Map extends Collection {
    key;
    value;

    constructor(obj) {
        super(obj);
        Validator.checkArgumentType(obj.key, "obj.key", DataType);
        Validator.checkArgumentType(obj.value, "obj.value", DataType);
        Object.assign(this, obj);
    }
}

export {
    DataType,
    Primitive,
    Collection,
    List,
    Matrix,
    Map
}