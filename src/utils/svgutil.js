import { Util } from './util.js'

class SvgUtil {
  static select (selector) {
    const domElement = document.querySelector(selector)
    if (domElement != null) {
      return new SvgHandler(domElement)
    } else {
      throw new Exception(`There are no matches for '${selector}'.`)
    }
  }

  static selectById (id) {
    return SvgUtil.select(`#${id}`)
  }

  static create (elementType) {
    const newElement = document.createElementNS(SvgUtil.NS, elementType)
    return new SvgHandler(newElement)
  }
  
  static mousePosition (elem, evt, step = 0) {
    if (evt.touches) {
      evt = evt.touches[0]
    }
    const CTM = elem.getScreenCTM()
    const x = (evt.clientX - CTM.e) / CTM.a
    const y = (evt.clientY - CTM.f) / CTM.d
    return {
      x: step === 0 ? x : Math.round(x / step) * step,
      y: step === 0 ? y : Math.round(y / step) * step
    }
  }

  static get NS () {
    return 'http://www.w3.org/2000/svg'
  }
}

class SvgHandler {
  #element

  constructor (element) {
    this.#element = element
  }
  
  clone () {
    const newElement = this.#element.cloneNode(true)
    return new SvgHandler(newElement)
  }

  get element () {
    return this.#element
  }

  append (parameter) {
    if (Util.isTypeOf(parameter, 'string')) {
      const elementType = parameter
      const newElement = document.createElementNS(SvgUtil.NS, elementType)
      this.#element.appendChild(newElement)
      return new SvgHandler(newElement)
    } else {
      const svgHandler = parameter
      this.#element.appendChild(svgHandler.element)
      return svgHandler
    }
  }

  attr (name, value) {
    if (Util.isUndefined(value)) {
      return this.#element.getAttributeNS(null, name)
    } else {
      if (name !== 'text') {
        this.#element.setAttributeNS(null, name, value)
      } else {
        this.#element.appendChild(document.createTextNode(value))
      }
      return this
    }
  }

  classed (className, option) {
    if (Util.isUndefined(option)) {
      return this.#element.classList.contains(className)
    } else {
      if (option) {
        this.#element.classList.add(className)
      } else {
        this.#element.classList.remove(className)
      }
      return this
    }
  }

  listener (type, funcListener) {
    this.#element.addEventListener(type, funcListener)
    return this
  }
}

class SvgTransform {
  
  static pannedMatrix (matrix, dx, dy) {
    matrix[4] += dx
    matrix[5] += dy
    matrix = matrix.map(m => Util.round(m, 8))
    return matrix
  }
  
  static zoomedMatrix (matrix, scale, centerX, centerY) {
    matrix = matrix.map(m => m *= scale)
    matrix[4] += (1 - scale) * centerX
    matrix[5] += (1 - scale) * centerY
    matrix = matrix.map(m => Util.round(m, 8))
    return matrix
  }

  static setTransform (element, matrix) {
    const transform = `matrix(${matrix.join(' ')})`
    element.setAttributeNS(null, 'transform', transform)
  }

  static transformCoord (matrix, coord) {
    return {
      x: coord.x * matrix[0] + matrix[4],
      y: coord.y * matrix[3] + matrix[5]
    }
  }

  static transformCoords (matrix, coords) {
    return coords.map(coord => SvgTransform.transformCoord(matrix, coord))
  }
}

export { SvgUtil, SvgHandler, SvgTransform }