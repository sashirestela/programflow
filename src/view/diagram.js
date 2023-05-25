import { TerminalType, PolylineType, Polyline } from './../utils/graphics.js'
import { SvgUtil, SvgTransform } from './../utils/svgutil.js'
import { Helper } from './../utils/helper.js'
import { Util } from './../utils/util.js'
import * as shape from './shapes.js'
import { FlowLine } from './flowline.js'

export class Diagram {
  id = null
  holderDomId = null
  shapeWidth = 180
  shapeHeight = 30
  shapeGap = 45
  defaultSouth = 30
  gridSize = 15
  markerWidth = 10
  markerHeight = 4
  zoomFactorUp = 1.25
  zoomFactorDown = 0.80
  zoomScaleMax = 4.00
  zoomScaleMin = 0.25
  matrix = [1, 0, 0, 1, 0, 0]

  #svg
  #selected
  #initPanPoint

  constructor (obj) {
    Object.assign(this, obj)
    this.#config()
  }

  #config () {
    const holder = document.getElementById(this.holderDomId)
    const svg = SvgUtil.selectById(this.holderDomId)
      .append('svg')
        .attr('id', this.id)
        .attr('x', 0)
        .attr('y', 0)
        .attr('viewBox', `0 0 ${holder.clientWidth} ${holder.clientHeight}`)
        .classed('diagram', true)
    svg
      .append('defs')
    
    this.#svg = svg.element
    
    this.#configArrow()
    this.#configGrid()
    this.#configEvents()

    this.#svg.diagram = this
  }

  #configArrow () {
    const defs = SvgUtil.select('defs')
    const marker = defs
      .append('marker')
        .attr('id', 'arrow')
        .attr('markerWidth', this.markerWidth)
        .attr('markerHeight', this.markerHeight)
        .attr('markerUnits', 'userSpaceOnUse')
        .attr('refX', this.markerWidth)
        .attr('refY', this.markerHeight / 2)
        .attr('orient', 'auto')
    marker
      .append('polygon')
        .attr('points', `0 0, ${this.markerWidth} ${this.markerHeight / 2}, 0 ${this.markerHeight}`)
    defs
      .append(marker.clone())
        .attr('id', 'arrow-hover')
  }

  #configGrid () {
    const pattern = SvgUtil.select('defs')
      .append('pattern')
        .attr('id', 'grid')
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', this.gridSize)
        .attr('height', this.gridSize)
    const line = pattern
      .append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', this.gridSize * 16)
        .attr('y2', 0)
        .classed('grid', true)
    pattern
      .append(line.clone())
        .attr('x2', 0)
        .attr('y2', this.gridSize * 16)
    
    SvgUtil.selectById(this.id)
      .append('rect')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('fill', 'url(#grid)')
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
    this.#svg.addEventListener('wheel', e => that.zoom(e))
  }

  startDrag (evt) {
    if (evt.target.parentNode.matches('.draggable')) {
      this.#selected = evt.target.parentNode
      this.#selected.diagramElement.startDrag(evt)
    } else {
      this.#initPanPoint = SvgUtil.mousePosition(this.#svg, evt)
      SvgUtil.selectById(this.id).classed('panning', true)
    }
  }

  drag (evt) {
    if (this.#selected) {
      evt.preventDefault()
      this.#selected.diagramElement.drag(evt)
    } else if (this.#initPanPoint) {
      evt.preventDefault()
      this.pan(evt)
    }
  }

  endDrag (evt) {
    if (this.#selected) {
      this.#selected.diagramElement.endDrag()
      this.#selected = null
    } else if (this.#initPanPoint) {
      this.#initPanPoint = null
      SvgUtil.selectById(this.id).classed('panning', false)
    }
  }

  pan (evt) {
    const point = SvgUtil.mousePosition(this.#svg, evt)
    const deltaX = point.x - this.#initPanPoint.x
    const deltaY = point.y - this.#initPanPoint.y
    this.matrix = SvgTransform.pannedMatrix(this.matrix, deltaX, deltaY)
    this.#transform()
    this.#initPanPoint.x = point.x
    this.#initPanPoint.y = point.y
  }
  
  zoom (evt) {
    if (evt.deltaY > 0) {
      SvgUtil.selectById(this.id).classed('zooming-out', true)
    } else {
      SvgUtil.selectById(this.id).classed('zooming-in', true)
    }
    const scale = evt.deltaY > 0 ? this.zoomFactorDown : this.zoomFactorUp
    const factor = this.matrix[0] * scale
    const zoomable = (factor < this.zoomScaleMax && factor > this.zoomScaleMin)
    if (zoomable) {
      this.matrix = SvgTransform.zoomedMatrix(this.matrix, scale, this.#svg.clientWidth/2, this.#svg.clientHeight/2)
      this.#transform()
    }
    setTimeout((deltaY, id) => {
      if (deltaY > 0) {
        SvgUtil.selectById(id).classed('zooming-out', false)
      } else {
        SvgUtil.selectById(id).classed('zooming-in', false)
      }
    }, 500, evt.deltaY, this.id)
  }

  #transform () {
    this.#svg.querySelectorAll('.draggable').forEach(element => {
      SvgTransform.setTransform(element, this.matrix)
    })
    this.#updateGrid()
  }

  #updateGrid () {
    SvgUtil.selectById('grid')
      .attr('x', this.matrix[4])
      .attr('y', this.matrix[5])
      .attr('width', this.gridSize * this.matrix[0])
      .attr('height', this.gridSize * this.matrix[0])
    for (let i = 1; i <= 2; i++) {
      SvgUtil.select(`#grid line:nth-child(${i})`)
        .attr('opacity', Math.min(this.matrix[0], 1))
    }
  }

  add (element) {
    this.#svg.appendChild(element.getGroup())
  }

  addShapeAt (flowline) {
    const delta = (this.shapeGap + (flowline.source.height + flowline.target.height)/2)
    const segment = Polyline.firstVerticalSegment(flowline.getCoords())
    const length = Polyline.length(segment)
    const limitY = flowline.source.cy
    const newId = Helper.uuid()
    const newShape = new shape.SingleShape({
      id: newId,
      cx: segment[0].x,
      cy: limitY + delta,
      width: this.shapeWidth,
      height: this.shapeHeight,
      text: `Element-${Util.left(newId, 4)}`
    })
    SvgTransform.setTransform(newShape.getGroup(), this.matrix)
    const oldTarget = flowline.target
    oldTarget.disconnect(flowline, TerminalType.Target)
    flowline.target = newShape
    newShape.connect(flowline, TerminalType.Target)
    this.add(newShape)
    const polylineType = PolylineType.get(flowline.getCoords())
    let newRoute = 'S *'
    switch(polylineType) {
      case PolylineType.TopLeft:
        flowline.reRoute('W * S *')
        break;
      case PolylineType.TopRight:
        flowline.reRoute('E * S *')
        break;
      case PolylineType.BottomLeft:
        flowline.reRoute('S *')
        newRoute = 'S * E *'
        break;
      case PolylineType.BottomRight:
        flowline.reRoute('S *')
        newRoute = 'S * W *'
        break;
      case PolylineType.CLeft:
        flowline.reRoute('W * S *')
        newRoute = 'S * E *'
        break;
      case PolylineType.CRight:
        flowline.reRoute('E * S *')
        newRoute = 'S * W *'
        break;
      case PolylineType.ULeft:
        flowline.reRoute('S *')
        newRoute = `S ${this.defaultSouth} E * N *`
        break;
      case PolylineType.URight:
        flowline.reRoute('S *')
        newRoute = `S ${this.defaultSouth} W * N *`
        break;
      case PolylineType.LoopLeft:
        flowline.reRoute('W * S *')
        newRoute = `S ${this.defaultSouth} E * N *`
        break;
      case PolylineType.LoopRight:
        flowline.reRoute('E * S *')
        newRoute = `S ${this.defaultSouth} W * N *`
        break;
      default:
        flowline.reRoute('S *')
    }
    if (length+this.shapeHeight < delta*2) {
      const arrMoved = [
        [newShape.id, newShape]
      ]
      if (polylineType === PolylineType.LoopLeft || polylineType === PolylineType.LoopRight) {
        arrMoved.push([flowline.source.id, flowline.source])
      }
      const newDelta = (this.shapeGap + (newShape.height + oldTarget.height)/2)
      this.moveElementsFrom(oldTarget, new Map(arrMoved), newDelta, limitY)
      this.adjustFlowlinesFrom(oldTarget, new Map())
    }
    const newFlowline = new FlowLine({
      id: `${Helper.uuid()}`,
      route: newRoute,
      source: newShape,
      target: oldTarget
    })
    SvgTransform.setTransform(newFlowline.getGroup(), this.matrix)
    this.add(newFlowline)
  }

  moveElementsFrom (shape, mapMoved, delta, limitY) {
    if (!mapMoved.get(shape.id) && shape.cy > limitY) {
      shape.move(0, delta)
      mapMoved.set(shape.id, shape)
    }
    shape.getFlowlines()
      .filter(item => item.terminalType === TerminalType.Source)
      .forEach(item => {
        item.flowline.move(0, delta)
        if (!mapMoved.get(item.flowline.target.id)) {
          this.moveElementsFrom(item.flowline.target, mapMoved, delta, limitY)
        }
      })
  }

  adjustFlowlinesFrom (shape, mapAdjusted, flowline) {
    shape.getFlowlines()
      .filter(item => flowline ? item.flowline.id !== flowline.id : true)
      .forEach(item => {
        const coords = item.flowline.getCoords()
        const endCoord = item.terminalType === TerminalType.Target ? coords[coords.length - 1] : coords[0]
        const joints = Object.values(shape.jointCoords())
        const isJoint = joints.some(joint => joint.x === endCoord.x && joint.y === endCoord.y)
        if (!isJoint) {
          item.flowline.reRoute(item.flowline.route)
        }
      })
    mapAdjusted.set(shape.id, shape)
    shape.getFlowlines()
      .forEach(item => {
        if (!mapAdjusted.get(item.flowline.target.id)) {
          this.adjustFlowlinesFrom(item.flowline.target, mapAdjusted, item.flowline)
          this.adjustFlowlinesFrom(item.flowline.source, mapAdjusted, item.flowline)
        }
      })
  }
}
