import { Svg, MovementType } from './../utils/graphics.js'

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
  #movementType

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

  centerCoord () {
    const transforms = this.#group.transform.baseVal
    return {
      x: this.cx + (transforms.length === 0 ? 0 : transforms[0].matrix.e),
      y: this.cy + (transforms.length === 0 ? 0 : transforms[0].matrix.f)
    }
  }

  jointCoords () {
    const { x: cx, y: cy } = this.centerCoord()
    return {
      top: { x: cx, y: cy - this.height / 2 },
      bottom: { x: cx, y: cy + this.height / 2 },
      left: { x: cx - this.width / 2, y: cy },
      right: { x: cx + this.width / 2, y: cy }
    }
  }

  borderLines () {
    const { x: cx, y: cy } = this.centerCoord()
    const
      topLeft = { x: cx - this.width / 2, y: cy - this.height / 2 }
    const topRight = { x: cx + this.width / 2, y: cy - this.height / 2 }
    const bottomLeft = { x: cx - this.width / 2, y: cy + this.height / 2 }
    const bottomRight = { x: cx + this.width / 2, y: cy + this.height / 2 }
    return [
      [topLeft, topRight],
      [bottomLeft, bottomRight],
      [topLeft, bottomLeft],
      [topRight, bottomRight]
    ]
  }

  startDrag (evt) {
    const svg = this.#group.ownerSVGElement
    this.#initial = Svg.getMousePosition(svg, evt)
    this.#offset = Svg.getMousePosition(svg, evt)
    this.#transform = Svg.getTranformTranslate(this.#group)
    this.#offset.x -= this.#transform.matrix.e
    this.#offset.y -= this.#transform.matrix.f
    this.#movementType = null

    this.#flowlines.forEach(obj => obj.flowline.startShapeDrag(obj.terminalType))
  }

  drag (evt) {
    const svg = this.#group.ownerSVGElement
    const coord = Svg.getMousePosition(svg, evt)
    if (this.#movementType === null) {
      if (Math.abs((coord.y - this.#initial.y)) >= Math.abs((coord.x - this.#initial.x))) {
        this.#movementType = MovementType.Vertical
      } else {
        this.#movementType = MovementType.Horizontal
      }
    }
    if (this.#movementType === MovementType.Vertical) {
      coord.x = this.#initial.x
    } else if (this.#movementType === MovementType.Horizontal) {
      coord.y = this.#initial.y
    }
    this.#transform.setTranslate(coord.x - this.#offset.x, coord.y - this.#offset.y)

    this.#flowlines.forEach(obj => obj.flowline.shapeDrag(obj.terminalType, this.#movementType))
  }

  getGroup () {
    return this.#group
  }

  connect (aFlowline, aTerminalType) {
    this.#flowlines.push({
      flowline: aFlowline,
      terminalType: aTerminalType
    })
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
    const delta = sizeY / 4
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
