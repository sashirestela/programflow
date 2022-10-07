import { Svg } from './../utils/graphics.js'

export class Diagram {
  id = null
  holderDomId = null
  markerWidth = 12
  markerHeight = 8

  #svg
  #selected

  constructor (obj) {
    Object.assign(this, obj)
    this.#config()
  }

  #config () {
    this.#svg = document.createElementNS(Svg.NS, 'svg')
    this.#svg.setAttributeNS(null, 'id', this.id)
    this.#svg.setAttributeNS(null, 'x', '0')
    this.#svg.setAttributeNS(null, 'y', '0')
    this.#svg.setAttributeNS(null, 'height', '100%')
    this.#svg.setAttributeNS(null, 'width', '100%')
    this.#svg.classList.add('diagram')

    this.#configEvents()
    this.#configMarker()

    const holder = document.getElementById(this.holderDomId)
    holder.appendChild(this.#svg)
  }

  #configEvents () {
    const that = this
    this.#svg.addEventListener('mousedown', e => that.startDrag(e))
    this.#svg.addEventListener('mousemove', e => that.drag(e))
    this.#svg.addEventListener('mouseup', e => that.endDrag(e))
    this.#svg.addEventListener('mouseleave', e => that.endDrag(e))
    this.#svg.addEventListener('touchstart', e => that.startDrag(e))
    this.#svg.addEventListener('touchmove', e => that.drag(e))
    this.#svg.addEventListener('touchend', e => that.endDrag(e))
    this.#svg.addEventListener('touchleave', e => that.endDrag(e))
    this.#svg.addEventListener('touchcancel', e => that.endDrag(e))
  }

  #configMarker () {
    const polygon = document.createElementNS(Svg.NS, 'polygon')
    polygon.setAttributeNS(null, 'points', `0 0, ${this.markerWidth} ${this.markerHeight / 2}, 0 ${this.markerHeight}`)

    const marker = document.createElementNS(Svg.NS, 'marker')
    marker.setAttributeNS(null, 'markerWidth', this.markerWidth)
    marker.setAttributeNS(null, 'markerHeight', this.markerHeight)
    marker.setAttributeNS(null, 'markerUnits', 'userSpaceOnUse')
    marker.setAttributeNS(null, 'refX', this.markerWidth)
    marker.setAttributeNS(null, 'refY', this.markerHeight / 2)
    marker.setAttributeNS(null, 'orient', 'auto')
    marker.appendChild(polygon)
    const marker1 = marker.cloneNode(true)
    marker1.setAttributeNS(null, 'id', 'arrow')
    const marker2 = marker.cloneNode(true)
    marker2.setAttributeNS(null, 'id', 'arrow-hover')

    const defs = document.createElementNS(Svg.NS, 'defs')
    defs.appendChild(marker1)
    defs.appendChild(marker2)

    this.#svg.appendChild(defs)
  }

  startDrag (evt) {
    if (evt.target.parentNode.classList.contains('draggable')) {
      this.#selected = evt.target.parentNode
      this.#selected.diagramElement.startDrag(evt)
    }
  }

  drag (evt) {
    if (this.#selected) {
      evt.preventDefault()
      this.#selected.diagramElement.drag(evt)
    }
  }

  endDrag (evt) {
    if (this.#selected) {
      this.#selected = null
    }
  }

  add (object) {
    this.#svg.appendChild(object.getGroup())
  }
}
