import { Svg } from './../utils/svg_utils.js'

class Shape {
  id = null
  cx = null
  cy = null
  width = null
  height = null
  text = null

  #group
  #initial
  #offset
  #transform

  #flowlines = []

  constructor (obj) {
    Object.assign(this, obj)
    this.config()
  }

  config () {
    this.#group = document.createElementNS(Svg.NS, 'g')
    this.#group.setAttributeNS(null, 'id', this.id)
    this.#group.classList.add('shapes')
    this.#group.classList.add('draggable')

    const path = document.createElementNS(Svg.NS, 'path')
    path.setAttributeNS(null, 'd', this.calculateDirections())
    this.#group.appendChild(path)

    const text = document.createElementNS(Svg.NS, 'text')
    text.setAttributeNS(null, 'text-anchor', 'middle')
    text.setAttributeNS(null, 'alignment-baseline', 'middle')
    text.setAttributeNS(null, 'x', this.cx)
    text.setAttributeNS(null, 'y', this.cy)
    text.appendChild(document.createTextNode(this.text))
    this.#group.appendChild(text)

    this.#group.diagramElement = this
  }

  getJointPoints () {
    let cx, cy
    const transforms = this.#group.transform.baseVal
    if (transforms.length === 0) {
      cx = this.cx
      cy = this.cy
    } else {
      cx = this.cx + transforms[0].matrix.e
      cy = this.cy + transforms[0].matrix.f
    }
    return {
      top: { x: cx, y: cy - this.height / 2 },
      bottom: { x: cx, y: cy + this.height / 2 },
      left: { x: cx - this.width / 2, y: cy },
      right: { x: cx + this.width / 2, y: cy }
    }
  }

  startDrag (evt) {
    const svg = this.#group.ownerSVGElement
    this.#initial = Svg.getMousePosition(svg, evt)
    this.#offset = Svg.getMousePosition(svg, evt)
    this.#transform = Svg.getTranformTranslate(this.#group)
    this.#offset.x -= this.#transform.matrix.e
    this.#offset.y -= this.#transform.matrix.f
  }

  drag (evt) {
    const svg = this.#group.ownerSVGElement
    const coord = Svg.getMousePosition(svg, evt)
    if (Math.abs((coord.y - this.#initial.y)) >= Math.abs((coord.x - this.#initial.x))) {
      coord.x = this.#initial.x
    } else {
      coord.y = this.#initial.y
    }
    this.#transform.setTranslate(coord.x - this.#offset.x, coord.y - this.#offset.y)

    const flowlineX = this.cx + this.#transform.matrix.e + 1
    const flowlineY = evt.clientY
    const flowlineEvt = Svg.clonedEvent(evt, flowlineX, flowlineY)
    this.#flowlines.forEach(flowline => flowline.drag(flowlineEvt))
  }

  getGroup () {
    return this.#group
  }

  connect (flowline) {
    this.#flowlines.push(flowline)
  }
}

class SingleShape extends Shape {
  calculateDirections () {
    const sizeX = this.width
    const sizeY = this.height
    const origX = this.cx - sizeX / 2
    const origY = this.cy - sizeY / 2
    const directions = `M ${origX} ${origY} h ${sizeX} v ${sizeY} h -${sizeX} z`
    return directions
  }
}

class InteractionShape extends Shape {
  calculateDirections () {
    const sizeX = this.width
    const sizeY = this.height
    const delta = sizeY / 5
    const origX = this.cx - sizeX / 2 + delta
    const origY = this.cy - sizeY / 2
    const directions = `M ${origX} ${origY} h ${sizeX - delta} l -${delta} ${sizeY} h -${sizeX - delta} z`
    return directions
  }
}

class SplitShape extends Shape {
  calculateDirections () {
    const sizeX = this.width
    const sizeY = this.height
    const origX = this.cx - sizeX / 2
    const origY = this.cy
    const directions = `M ${origX} ${origY} l ${sizeX / 2} -${sizeY / 2} l ${sizeX / 2} ${sizeY / 2} l -${sizeX / 2} ${sizeY / 2} z`
    return directions
  }
}

class TerminalShape extends Shape {
  calculateDirections () {
    const sizeX = this.width
    const sizeY = this.height
    const radio = sizeY / 2
    const origX = this.cx - sizeX / 2 + radio
    const origY = this.cy - sizeY / 2
    const directions = `M ${origX} ${origY} h ${sizeX - 2 * radio} a ${radio} ${radio} 0 1 1 0 ${2 * radio} ` +
      `h -${sizeX - 2 * radio} a ${radio} ${radio} 0 1 1 0 -${2 * radio}`
    return directions
  }
}

class LoopShape extends Shape {
  calculateDirections () {
    const sizeX = this.width
    const sizeY = this.height
    const delta = sizeY / 2
    const origX = this.cx - sizeX / 2 + delta
    const origY = this.cy - sizeY / 2
    const directions = `M ${origX} ${origY} h ${sizeX - 2 * delta} l ${delta} ${sizeY / 2} ` +
      `l -${delta} ${sizeY / 2} h -${sizeX - 2 * delta} l -${delta} -${sizeY / 2} z`
    return directions
  }
}

class AuxiliarShape extends Shape {
  calculateDirections () {
    const sizeY = this.height
    const radio = sizeY / 2
    const origX = this.cx
    const origY = this.cy - sizeY / 2
    const directions = `M ${origX} ${origY} a ${radio} ${radio} 0 1 1 0 ${2 * radio} a ${radio} ${radio} 0 1 1 0 -${2 * radio}`
    return directions
  }
}

export {
  Shape,
  SingleShape,
  InteractionShape,
  SplitShape,
  TerminalShape,
  LoopShape,
  AuxiliarShape
}
