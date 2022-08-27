import { Helper } from './../utils/helper.js';
import { Validator } from './../utils/errors.js';

class DataType {
    #_className;

    constructor(obj) {
        this.#_className = obj.className ?? Helper.classFromObject(this);
    }

    get className() {
        return this.#_className;
    }

    toJSON() {
        return {
            className: this.#_className
        }
    }

    static reviver(k,v) {
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
                return v;;
        }
    }
}

class Primitive extends DataType {
    #_type

    constructor(obj) {
        Validator.checkArgumentType(obj, "obj", Object);
        super(obj);
        this.#_type = obj.type;
    }

    static create(type) {
        Validator.checkArgumentType(type, "type", "string");
        return new Primitive({
            type: type
        });
    }

    get type() {
        return this.#_type;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            ...{
                type: this.#_type
            }
        }
    }

    static list() {
        return Object.values(Primitive);
    }

    static Boolean = Primitive.create("Boolean");
    static String = Primitive.create("String");
    static Integer = Primitive.create("Integer");
    static Real = Primitive.create("Real");
}

class Collection extends DataType {
    constructor(obj) {
        super(obj);
    }
}

class List extends Collection {
    #_element;

    constructor(obj) {
        Validator.checkArgumentType(obj, "obj", Object);
        super(obj);
        this.#_element = obj.element;
    }

    static create(element) {
        Validator.checkArgumentType(element, "element", DataType);
        return new List({
            element: element
        });
    }

    get element() {
        return this.#_element;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            ...{
                element: this.#_element
            }
        }
    }
}

class Matrix extends Collection {
    #_element;
    #_innerElement;

    constructor(obj) {
        Validator.checkArgumentType(obj, "obj", Object);
        super(obj);
        this.#_element = new List(obj);
        this.#_innerElement = this.element.element;
    }

    static create(element) {
        Validator.checkArgumentType(element, "element", DataType);
        return new Matrix({
            element: element
        });
    }

    get element() {
        return this.#_element;
    }

    get innerElement() {
        return this.#_innerElement;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            ...{
                element: this.#_element,
                innerElement: this.#_innerElement
            }
        }
    }
}

class Map extends Collection {
    #_key;
    #_value;

    constructor(obj) {
        Validator.checkArgumentType(obj, "obj", Object);
        super(obj);
        this.#_key = obj.key;
        this.#_value = obj.value;
    }

    static create(key, value) {
        Validator.checkArgumentType(key, "key", DataType)
        Validator.checkArgumentType(value, "value", DataType)
        return new Map({
            key: key,
            value: value
        });
    }

    get key() {
        return this.#_key;
    }

    get value() {
        return this.#_value;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            ...{
                key: this.#_key,
                value: this.#_value
            }
        }
    }
}

export {
    DataType,
    Primitive,
    Collection,
    List,
    Matrix,
    Map,
};