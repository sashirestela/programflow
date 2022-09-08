import { Helper } from './../utils/helper.js'
import { Validator, UnexpectedValueError } from './../utils/validator.js'

class DataType {
  className = Helper.classFromObject(this)

  constructor (obj) {
    Validator.checkArgumentType(obj, 'obj', Object)
    Object.assign(this, obj)
  }

  static categories = []

  static categoriesOf (parent) {
    parent = parent ?? 'DataType'
    return DataType.categories.filter(t => t.parentType === parent).map(t => t.name)
  }

  static create (category, type1, type2) {
    const dataType1 = Primitive.find(type1)
    switch (category) {
      case 'Primitive':
        return dataType1
      case 'List':
        return new List({ element: dataType1 })
      case 'Matrix':
        return new Matrix({ innerElement: dataType1 })
      case 'Map': {
        const dataType2 = Primitive.find(type2)
        return new Map({ key: dataType1, value: dataType2 })
      }
      default:
        throw new UnexpectedValueError(`Category '${category}' does not exist.`)
    }
  }

  static reviver (k, v) {
    if (v === null || v.className === null) {
      return v
    }
    switch (v.className) {
      case 'Primitive':
        return new Primitive(v)
      case 'List':
        return new List(v)
      case 'Matrix':
        return new Matrix(v)
      case 'Map':
        return new Map(v)
      default:
        return v
    }
  }
}

class Primitive extends DataType {
  type

  constructor (obj) {
    super(obj)
    Validator.checkArgumentType(obj.type, 'obj.type', 'string')
    Object.assign(this, obj)
  }

  static {
    DataType.categories.push({ name: this.name, parentType: Object.getPrototypeOf(this).name })
  }

  static list () {
    return Object.values(Primitive).map(e => e.type)
  }

  static find (type) {
    const entry = Object.entries(Primitive).find(e => e[0] === type)
    if (entry !== undefined) {
      return entry[1]
    } else {
      throw new UnexpectedValueError(`Type '${type}' does not exist.`)
    }
  }

  static Boolean = new Primitive({ type: 'Boolean' })
  static String = new Primitive({ type: 'String' })
  static Integer = new Primitive({ type: 'Integer' })
  static Real = new Primitive({ type: 'Real' })
}

class Collection extends DataType {
  static {
    DataType.categories.push({ name: this.name, parentType: Object.getPrototypeOf(this).name })
  }
}

class List extends Collection {
  element

  constructor (obj) {
    super(obj)
    Validator.checkArgumentType(obj.element, 'obj.element', DataType)
    Object.assign(this, obj)
  }

  static {
    DataType.categories.push({ name: this.name, parentType: Object.getPrototypeOf(this).name })
  }
}

class Matrix extends Collection {
  innerElement
  element

  constructor (obj) {
    super(obj)
    Validator.checkArgumentType(obj.innerElement, 'obj.innerElement', DataType)
    Object.assign(this, obj)
    this.element = obj.element ?? new List({ element: this.innerElement })
  }

  static {
    DataType.categories.push({ name: this.name, parentType: Object.getPrototypeOf(this).name })
  }
}

class Map extends Collection {
  key
  value

  constructor (obj) {
    super(obj)
    Validator.checkArgumentType(obj.key, 'obj.key', DataType)
    Validator.checkArgumentType(obj.value, 'obj.value', DataType)
    Object.assign(this, obj)
  }

  static {
    DataType.categories.push({ name: this.name, parentType: Object.getPrototypeOf(this).name })
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
