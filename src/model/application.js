import { Helper } from './../utils/helper.js';
import { Validator, Cardinality } from './../utils/validator.js';

class Application {
    id = Helper.uuid();
    name = null;
    scopeId = null;
    functionIdList = [];

    constructor(obj) {
        Validator.checkArgumentType(obj, "obj", Object);
        Validator.checkArgumentType(obj.name, "obj.name", "string");
        Validator.checkArgumentType(obj.scopeId, "obj.scopeId", "string");
        Validator.checkArgumentType(obj.functionIdList, "obj.functionIdList", "string", Validator.ARRAY);
        Validator.checkArgumentCardinality(obj.functionIdList, "obj.functionIdList", Cardinality.AtLeastOne);
        Object.assign(this, obj);
    }
}

export {
    Application
}