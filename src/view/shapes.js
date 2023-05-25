import { MovementType } from './../utils/graphics.js'
import { SvgUtil } from './../utils/svgutil.js'

class Shape {
  id = null
  cx = null
  cy = null
  width = null
  height = null
  text = null

  #group
  #initial

  #movementType

  #flowlines = []

  constructor (obj) {
    Object.assign(this, obj)
    this.config()
  }

  config () {
    const group = SvgUtil.create('g')
      .attr('id', this.id)
      .classed('shapes', true)
      .classed('draggable', true)
    group
      .append('path')
        .attr('d', this.shapePath())
    group
      .append('text')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('x', this.cx)
        .attr('y', this.cy)
        .attr('text', this.text)
    
    this.#group = group.element
    this.#group.diagramElement = this
  }

  geometry () {
    const center = {x: this.cx, y: this.cy}
    const area = {w: this.width, h: this.height}
    return {
      x: center.x,
      y: center.y,
      w: area.w,
      h: area.h
    }
  }

  jointCoords () {
    const { x: cx, y: cy, w: width, h: height } = this.geometry()
    return {
      top: { x: cx, y: cy - height / 2 },
      bottom: { x: cx, y: cy + height / 2 },
      left: { x: cx - width / 2, y: cy },
      right: { x: cx + width / 2, y: cy }
    }
  }

  borderLines () {
    const { x: cx, y: cy, w: width, h: height } = this.geometry()
    const topLeft = { x: cx - width / 2, y: cy - height / 2 }
    const topRight = { x: cx + width / 2, y: cy - height / 2 }
    const bottomLeft = { x: cx - width / 2, y: cy + height / 2 }
    const bottomRight = { x: cx + width / 2, y: cy + height / 2 }
    return [
      [topLeft, topRight],
      [bottomLeft, bottomRight],
      [topLeft, bottomLeft],
      [topRight, bottomRight]
    ]
  }

  startDrag (evt) {
    const diagram = evt.target.ownerSVGElement.diagram
    this.#initial = SvgUtil.mousePosition(this.#group, evt, diagram.gridSize)
    this.#movementType = null

    this.#flowlines.forEach(obj => obj.flowline.startShapeDrag(obj.terminalType))
  }

  drag (evt) {
    const diagram = evt.target.ownerSVGElement.diagram
    const coord = SvgUtil.mousePosition(this.#group, evt, diagram.gridSize)
    if (Math.abs((coord.y - this.#initial.y)) >= Math.abs((coord.x - this.#initial.x))) {
      this.#movementType = MovementType.Vertical
    } else {
      this.#movementType = MovementType.Horizontal
    }
    this.move(coord.x - this.#initial.x, coord.y - this.#initial.y)
    this.#initial.x = coord.x
    this.#initial.y = coord.y

    this.#flowlines.forEach(obj => obj.flowline.shapeDrag(obj.terminalType, this.#movementType))
  }

  endDrag () {
    this.#flowlines.forEach(obj => obj.flowline.endDrag())
  }

  move (deltaX, deltaY) {
    this.cx = this.cx + deltaX
    this.cy = this.cy + deltaY
    const path = this.#group.childNodes[0]
    path.setAttributeNS(null, 'd', this.shapePath())
    const text = this.#group.childNodes[1]
    text.setAttributeNS(null, 'x', this.cx)
    text.setAttributeNS(null, 'y', this.cy)
  }

  getGroup () {
    return this.#group
  }

  getFlowlines() {
    return this.#flowlines
  }

  connect (aFlowline, aTerminalType) {
    this.#flowlines.push({
      flowline: aFlowline,
      terminalType: aTerminalType
    })
  }

  disconnect (aFlowline, aTerminalType) {
    const index = this.#flowlines
      .findIndex(item => item.flowline.id === aFlowline.id && item.terminalType === aTerminalType)
    this.#flowlines.splice(index, 1)
  }
}

class SingleShape extends Shape {
  shapePath () {
    const sizeX = this.width
    const sizeY = this.height
    const origX = this.cx - sizeX / 2
    const origY = this.cy - sizeY / 2
    const directions = `M ${origX} ${origY} h ${sizeX} v ${sizeY} h -${sizeX} z`
    return directions
  }
}

class InteractionShape extends Shape {
  shapePath () {
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
  shapePath () {
    const sizeX = this.width
    const sizeY = this.height
    const origX = this.cx - sizeX / 2
    const origY = this.cy
    const directions = `M ${origX} ${origY} l ${sizeX / 2} -${sizeY / 2} l ${sizeX / 2} ${sizeY / 2} l -${sizeX / 2} ${sizeY / 2} z`
    return directions
  }
}

class TerminalShape extends Shape {
  shapePath () {
    const sizeX = this.width
    const sizeY = this.height
    const radius = sizeY / 2
    const origX = this.cx - sizeX / 2 + radius
    const origY = this.cy - sizeY / 2
    const directions = `M ${origX} ${origY} h ${sizeX - 2 * radius} a ${radius} ${radius} 0 1 1 0 ${2 * radius} ` +
      `h -${sizeX - 2 * radius} a ${radius} ${radius} 0 1 1 0 -${2 * radius}`
    return directions
  }
}

class LoopShape extends Shape {
  shapePath () {
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
  shapePath () {
    const sizeY = this.height
    const radius = sizeY / 2
    const origX = this.cx
    const origY = this.cy - sizeY / 2
    const directions = `M ${origX} ${origY} a ${radius} ${radius} 0 1 1 0 ${2 * radius} a ${radius} ${radius} 0 1 1 0 -${2 * radius}`
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
