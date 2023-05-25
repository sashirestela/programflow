class Util {
  static isNull (value) {
    return (value === null)
  }

  static isUndefined (value) {
    return (value === undefined)
  }

  static isNothing (value) {
    return (Util.isNull(value) || Util.isUndefined(value))
  }

  static someNull (...values) {
    return values.some(value => Util.isNull(value))
  }

  static someUndefined (...values) {
    return values.some(value => Util.isUndefined(value))
  }

  static isTypeOf (value, ...types) {
    return types.some(type => typeof value === type)
  }

  static isObject (value) {
    return Util.isTypeOf(value, 'object')
  }

  static isClass (value) {
    return Util.isTypeOf(value, 'function')
  }

  static isInstanceOf (value, classType) {
    return (value instanceof classType)
  }

  static round (number, decimals) {
    return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }

  static left (text, number) {
    return text.substring(0, number)
  }

  static right (text, number) {
    return text.substring(text.length - number)
  }
}

export { Util }