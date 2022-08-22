import { Helper } from './../utils/helper.js';
import { Validator } from './../utils/errors.js';

class DataType {
    #_className;

    constructor() {
        this.#_className = Helper.classFromObject(this);
    }

    get className() {
        return this.#_className;
    }
}

class Primitive extends DataType {
    #_type

    constructor(type) {
        Validator.checkArgumentType(type, "type", "string")
        super();
        this.#_type = type;
    }

    get type() {
        return this.#_type;
    }

    static list() {
        return Object.values(Primitive);
    }

    static Boolean = new Primitive("Boolean");
    static String = new Primitive("String");
    static Integer = new Primitive("Integer");
    static Real = new Primitive("Real");
}

class Collection extends DataType {
    constructor() {
        super();
    }
}

class List extends Collection {
    #_element;

    constructor(element) {
        Validator.checkArgumentType(element, "element", DataType)
        super();
        this.#_element = element;
    }

    get element() {
        return this.#_element;
    }
}

class Matrix extends Collection {
    #_element;
    #_innerElement;

    constructor(element) {
        Validator.checkArgumentType(element, "element", DataType)
        super();
        this.#_element = new List(element);
        this.#_innerElement = this.element.element;
    }

    get element() {
        return this.#_element;
    }

    get innerElement() {
        return this.#_innerElement;
    }
}

class Map extends Collection {
    #_key;
    #_value;

    constructor(key, value) {
        Validator.checkArgumentType(key, "key", DataType)
        Validator.checkArgumentType(value, "value", DataType)
        super();
        this.#_key = key;
        this.#_value = value;
    }

    get key() {
        return this.#_key;
    }

    get value() {
        return this.#_value;
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