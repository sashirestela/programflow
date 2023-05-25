import { MovementType, TerminalType, SegmentType, Polyline, PolylineType, Direction } from './../utils/graphics.js'
import { SvgUtil } from './../utils/svgutil.js'

export class FlowLine {
  id = null
  text = null
  textGap = 10
  isActionable = true
  route = null
  source = null
  target = null
  
  addButtonRadius = 8
  addButtonPosition = 3/4
  addButtonText = 'Add Statement'

  #group
  #staticCoord
  #selectedSegmentType
  #selectedSegment

  #terminalTypeJointMap = new Map()

  constructor (obj) {
    Object.assign(this, obj)
    this.#config()
  }

  #config () {
    this.source.connect(this, TerminalType.Source)
    this.target.connect(this, TerminalType.Target)

    const direction = new Direction({
      jointSource: this.source.jointCoords(),
      jointTarget: this.target.jointCoords()
    })
    const coords = direction.getCoords(this.route)

    const group = SvgUtil.create('g')
      .attr('id', this.id)
      .classed('draggable', true)
    const polyline = group
      .append('polyline')
        .attr('points', Polyline.coordsToPoints(coords))
        .classed('flowlines-shadow', true)
    group
      .append(polyline.clone())
        .classed('flowlines-shadow', false)
        .classed('flowlines', true)
    if (this.isActionable) {
      const button = group
        .append('path')
          .attr('d', this.#buttonPath(coords))
          .classed('flowlines-add', true)
          .listener('click', this.onClick)
      button
        .append('title')
          .attr('text', this.addButtonText)
    }
    if (this.text !== null) {
      const coord = Polyline.coordAlongCoords(this.textGap, coords, true)
      group
        .append('text')
          .attr('text-anchor', 'middle')
          .attr('x', coord.x)
          .attr('y', coord.y)
          .attr('text', this.text)
    }
    
    this.#group = group.element
    this.#group.diagramElement = this
  }

  #update (coords) {
    const points = Polyline.coordsToPoints(coords)
    const polyline1 = this.#group.childNodes[0]
    polyline1.setAttributeNS(null, 'points', points)
    const polyline2 = this.#group.childNodes[1]
    polyline2.setAttributeNS(null, 'points', points)
    let indexText = 2
    if (this.isActionable) {
      const button = this.#group.childNodes[2]
      button.setAttributeNS(null, 'd',this.#buttonPath(coords))
      indexText++
    }
    if (this.text !== null) {
      const text = this.#group.childNodes[indexText]
      const coord = Polyline.coordAlongCoords(this.textGap, coords, true)
      text.setAttributeNS(null, 'x', coord.x)
      text.setAttributeNS(null, 'y', coord.y)
    }
  }

  #buttonPath (coords) {
    const segment = Polyline.firstVerticalSegment(coords)
    const center = {x: segment[0].x, y: (segment[0].y + segment[1].y) / 2}
    const radius = this.addButtonRadius
    const origX = center.x
    const origY = center.y - radius
    const halfPlus = radius * 1 / 2
    const spaceY = radius - halfPlus
    const d = `M ${origX} ${origY} a ${radius} ${radius} 0 1 1 0 ${2 * radius} a ${radius} ${radius} 0 1 1 0 -${2 * radius} ` +
      `m 0 ${spaceY} v 0 ${2 * halfPlus} m -${halfPlus} -${halfPlus} h ${2 * halfPlus} 0`
    return d
  }

  startDrag (evt) {
    const jointSource = this.source.jointCoords()
    const jointTarget = this.target.jointCoords()
    const diagram = evt.target.ownerSVGElement.diagram
    const coord = SvgUtil.mousePosition(this.#group, evt, diagram.gridSize)
    const segment = Polyline.pickedSegmentOnCoords(this.getCoords(), coord)
    let isDraggable = (segment.length > 0)
    isDraggable = isDraggable &&
      !Polyline.isVerticalAndOutsideOfJoints(segment, jointSource, jointTarget)
    isDraggable = isDraggable &&
      !(Polyline.isSegmentAlongBorder(segment, this.source.borderLines()) ||
        Polyline.isSegmentAlongBorder(segment, this.target.borderLines()))
    if (isDraggable) {
      this.#selectedSegmentType = Polyline.segmentTypeOnCoords(segment, this.getCoords())
    } else {
      this.#selectedSegmentType = SegmentType.Undraggable
    }
    this.#staticCoord = { x: null, y: null }
    if (this.#selectedSegmentType === SegmentType.VerticalInner ||
      this.#selectedSegmentType === SegmentType.VerticalOuter) {
      this.#staticCoord.y = coord.y
    } else if (this.#selectedSegmentType === SegmentType.HorizontalTop ||
      this.#selectedSegmentType === SegmentType.HorizontalBottom) {
      this.#staticCoord.x = coord.x
    }
    this.#selectedSegment = segment
  }

  drag (evt) {
    const jointSource = this.source.jointCoords()
    const jointTarget = this.target.jointCoords()
    const diagram = evt.target.ownerSVGElement.diagram
    const coord = SvgUtil.mousePosition(this.#group, evt, diagram.gridSize)
    let newCoords
    if (this.#selectedSegmentType === SegmentType.VerticalInner) {
      newCoords = this.#dragVerticalInner(coord, jointSource, jointTarget)
    } else if (this.#selectedSegmentType === SegmentType.VerticalOuter) {
      newCoords = this.#dragVerticalOutter(coord, jointSource, jointTarget)
    } else if (this.#selectedSegmentType === SegmentType.HorizontalTop ||
      this.#selectedSegmentType === SegmentType.HorizontalBottom) {
      newCoords = this.#dragHorizontal(coord, jointSource, jointTarget)
    }
    if (this.#selectedSegmentType !== SegmentType.Undraggable) {
      this.#update(newCoords)
    }
  }

  #dragVerticalInner (coord, jointSource, jointTarget) {
    let points
    let refSource = null
    if (coord.x <= jointSource.left.x) {
      refSource = jointSource.left
    } else if (coord.x >= jointSource.right.x) {
      refSource = jointSource.right
    } else if (jointSource.top.y < jointTarget.top.y) {
      refSource = jointSource.bottom
    } else {
      refSource = jointSource.top
    }
    let refTarget = null
    if (coord.x <= jointTarget.left.x) {
      refTarget = jointTarget.left
    } else if (coord.x >= jointTarget.right.x) {
      refTarget = jointTarget.right
    } else if (jointTarget.top.y > jointSource.top.y) {
      refTarget = jointTarget.top
    } else {
      refTarget = jointTarget.bottom
    }
    points = `${refSource.x},${refSource.y} `
    if (coord.x !== refSource.x) {
      points += `${coord.x},${refSource.y} `
    }
    if (coord.x !== refTarget.x) {
      points += `${coord.x},${refTarget.y} `
    }
    points += `${refTarget.x},${refTarget.y}`
    const newCoords = Polyline.pointsToCoords(points)
    return newCoords
  }

  #dragVerticalOutter (coord, jointSource, jointTarget) {
    let points
    const coords = this.getCoords()
    let lowerSource = false
    let refSource = null
    if (jointSource.top.y < jointTarget.top.y ||
        (jointSource.top.y === jointTarget.top.y && coords[0].y < coords[coords.length - 1].y)) {
      if (this.#selectedSegment[0].y <= jointSource.top.y) {
        refSource = jointSource.top
      } else {
        lowerSource = true
      }
    } else {
      if (this.#selectedSegment[0].y >= jointSource.bottom.y) {
        refSource = jointSource.bottom
      } else {
        lowerSource = true
      }
    }
    if (lowerSource) {
      if (coord.x <= jointSource.left.x) {
        refSource = jointSource.left
      } else if (coord.x >= jointSource.right.x) {
        refSource = jointSource.right
      } else if (jointSource.top.y <= jointTarget.top.y) {
        refSource = jointSource.bottom
      } else {
        refSource = jointSource.top
      }
    }
    let lowerTarget = false
    let refTarget = null
    if (jointTarget.bottom.y > jointSource.bottom.y ||
        (jointSource.top.y === jointTarget.top.y && coords[coords.length - 1].y > coords[0].y)) {
      if (this.#selectedSegment[1].y >= jointTarget.bottom.y) {
        refTarget = jointTarget.bottom
      } else {
        lowerTarget = true
      }
    } else {
      if (this.#selectedSegment[1].y <= jointTarget.top.y) {
        refTarget = jointTarget.top
      } else {
        lowerTarget = true
      }
    }
    if (lowerTarget) {
      if (coord.x <= jointTarget.left.x) {
        refTarget = jointTarget.left
      } else if (coord.x >= jointTarget.right.x) {
        refTarget = jointTarget.right
      } else if (jointTarget.top.y > jointSource.top.y) {
        refTarget = jointTarget.top
      } else {
        refTarget = jointTarget.bottom
      }
    }
    points = `${refSource.x},${refSource.y} `
    if (lowerSource) {
      if (coord.x !== refSource.x) {
        points += `${coord.x},${refSource.y} `
      }
    } else {
      points += `${refSource.x},${this.#selectedSegment[0].y} `
      points += `${coord.x},${this.#selectedSegment[0].y} `
    }
    if (lowerTarget) {
      if (coord.x !== refTarget.x) {
        points += `${coord.x},${refTarget.y} `
      }
    } else {
      points += `${coord.x},${this.#selectedSegment[1].y} `
      points += `${refTarget.x},${this.#selectedSegment[1].y} `
    }
    points += `${refTarget.x},${refTarget.y}`
    const newCoords = Polyline.pointsToCoords(points)
    return newCoords
  }

  #dragHorizontal (coord, jointSource, jointTarget) {
    let newCoords
    const coords = this.getCoords()
    const joints = new JointsPair({
      segmentType: this.#selectedSegmentType,
      firstJoint: jointSource,
      secondJoint: jointTarget
    })
    if (joints.areEquals() && joints.exceedsLimitForSelfJoin(coord.y, coords)) {
      return coords
    }
    let ref
    if (joints.exceedsNearOutermostY(coord.y)) {
      ref = joints.nearOutermost()
    } else {
      if (this.#staticCoord.x < joints.nearJoint.left.x) {
        ref = joints.nearJoint.left
        if (joints.exceedsNearLeftY(coord.y)) {
          coord.y = ref.y
        }
      } else if (this.#staticCoord.x > joints.nearJoint.right.x) {
        ref = joints.nearJoint.right
        if (joints.exceedsNearRightY(coord.y)) {
          coord.y = ref.y
        }
      }
    }
    if ((!joints.areEquals() && jointSource.top.y === joints.nearJoint.top.y) ||
        (joints.areEquals() && joints.isSourceSide(coords[0].y, coords[coords.length - 1].y))) {
      newCoords = [ref]
      if (coord.y !== ref.y) {
        newCoords.push({ x: ref.x, y: coord.y })
      }
      let isFirst = true
      for (let i = 0; i < coords.length; i++) {
        if ((!joints.areEquals() && joints.exceedsFarOutermostY(coords[i].y)) ||
            (joints.areEquals() && joints.exceedsLimitY(coords[i].y, coords[0].y))) {
          if (isFirst) {
            isFirst = false
            newCoords.push({ x: coords[i].x, y: coord.y })
          }
          newCoords.push(coords[i])
        }
      }
    } else {
      newCoords = []
      for (let i = 0; i < coords.length; i++) {
        if ((!joints.areEquals() && joints.exceedsFarOutermostY(coords[i].y)) ||
            (joints.areEquals() && joints.exceedsLimitY(coords[i].y, coords[coords.length - 1].y))) {
          newCoords.push(coords[i])
        } else {
          newCoords.push({ x: coords[i].x, y: coord.y })
          break
        }
      }
      if (coord.y !== ref.y) {
        newCoords.push({ x: ref.x, y: coord.y })
      }
      newCoords.push(ref)
    }
    return newCoords
  }

  startShapeDrag (terminalType) {
    const jointCoords = (terminalType === TerminalType.Source
      ? this.source.jointCoords()
      : this.target.jointCoords())
    const coords = this.getCoords()
    const jointCoord = (terminalType === TerminalType.Source
      ? coords[0]
      : coords[coords.length - 1])
    for (const joint in jointCoords) {
      if (jointCoords[joint].x === jointCoord.x && jointCoords[joint].y === jointCoord.y) {
        this.#terminalTypeJointMap.set(terminalType, joint)
        break
      }
    }
  }

  shapeDrag (terminalType, movementType) {
    const joint = this.#terminalTypeJointMap.get(terminalType)
    const jointCoords = (terminalType === TerminalType.Source
      ? this.source.jointCoords()
      : this.target.jointCoords())
    let coords = this.getCoords()
    let ini, end
    if (movementType === MovementType.Vertical) {
      if (terminalType === TerminalType.Target) {
        ini = coords.length - 2
        end = coords.length - 1
        if (coords[end].y === coords[ini].y && coords[end].x !== coords[ini].x) {
          coords[ini].y = jointCoords[joint].y
        }
        coords[end].y = jointCoords[joint].y
      } else {
        ini = 0
        end = 1
        if (coords[end].y === coords[ini].y && coords[end].x !== coords[ini].x) {
          coords[end].y = jointCoords[joint].y
        }
        coords[ini].y = jointCoords[joint].y
      }
    } else {
      if (terminalType === TerminalType.Target) {
        ini = coords.length - 2
        end = coords.length - 1
        if (coords[end].y === coords[ini].y) {
          coords[end].x = jointCoords[joint].x
        } else {
          if (coords.length === 2) {
            coords.splice(end, 0, coords[ini])
          } else {
            coords[ini].x = jointCoords[joint].x
            coords[end].x = jointCoords[joint].x
            coords = this.#removeDuplicateCoords(coords)
          }
        }
      } else {
        ini = 0
        end = 1
        if (coords[end].y === coords[ini].y) {
          coords[ini].x = jointCoords[joint].x
        } else {
          if (coords.length === 2) {
            coords.splice(end, 0, coords[end])
          } else {
            coords[ini].x = jointCoords[joint].x
            coords[end].x = jointCoords[joint].x
            coords = this.#removeDuplicateCoords(coords)
          }
        }
      }
    }
    // Correct bad diagonal lines
    let isDiagonal = false
    let iBase = 0, k = 0
    for (let i = 1; i < coords.length; i++) {
      if (coords[i].x === coords[i-1].x || coords[i].y === coords[i-1].y) {
        k = i
      } else {
        isDiagonal = true
        if (i > 1) iBase = coords.length - 1
      }
    }
    if (isDiagonal) {
      if (coords[k].x === coords[k-1].x) {
        coords[1].y = coords[iBase].y
      }
      if (coords[k].y === coords[k-1].y) {
        coords[1].x = coords[iBase].x
      }
    }
    this.#update(coords)
  }

  endDrag () {
    const coords = this.getCoords()
    const polylineType = PolylineType.get(coords)
    let distH, distV, down
    switch(polylineType) {
      case PolylineType.TopLeft:
        this.route = 'W * S *'
        break;
      case PolylineType.TopRight:
        this.route = 'E * S *'
        break;
      case PolylineType.BottomLeft:
        this.route = 'W * N *'
        break;
      case PolylineType.BottomRight:
        this.route = 'E * N *'
        break;
      case PolylineType.CLeft:
        distH = (coords[0].x - coords[1].x)
        down = (coords[2].y > coords[1].y)
        this.route = `W ${distH} ${down ? 'S' : 'N'} * E *`
        break;
      case PolylineType.CRight:
        distH = (coords[1].x - coords[0].x)
        down = (coords[2].y > coords[1].y)
        this.route = `E ${distH} ${down ? 'S' : 'N'} * W *`
        break;
      case PolylineType.ULeft:
        down = (coords[1].y > coords[0].y)
        distV = down ? (coords[1].y - coords[0].y) : (coords[0].y - coords[1].y)
        this.route = `${down ? 'S' : 'N'} ${distV} E * ${down ? 'N' : 'S'} *`
        break;
      case PolylineType.URight:
        down = (coords[1].y > coords[0].y)
        distV = down ? (coords[1].y - coords[0].y) : (coords[0].y - coords[1].y)
        this.route = `${down ? 'S' : 'N'} ${distV} W * ${down ? 'N' : 'S'} *`
        break;
      case PolylineType.LoopLeft:
        distH = (coords[0].x - coords[1].x)
        down = (coords[2].y > coords[1].y)
        distV = down ? (coords[2].y - coords[1].y) : (coords[1].y - coords[2].y)
        this.route = `W ${distH} ${down ? 'S' : 'N'} ${distV} E * ${down ? 'N' : 'S'} *`
        break;
      case PolylineType.LoopRight:
        distH = (coords[1].x - coords[0].x)
        down = (coords[2].y > coords[1].y)
        distV = down ? (coords[2].y - coords[1].y) : (coords[1].y - coords[2].y)
        this.route = `E ${distH} ${down ? 'S' : 'N'} ${distV} W * ${down ? 'N' : 'S'} *`
        break;
      default:
        this.route = 'S *'
    }
  }

  getCoords () {
    const points = this.#group.childNodes[0].getAttributeNS(null, 'points')
    const coords = Polyline.pointsToCoords(points)
    return coords
  }

  #removeDuplicateCoords (coords) {
    return coords.filter((c, i) => coords.findIndex(cc => cc.x === c.x && cc.y === c.y) === i)
  }

  move (deltaX, deltaY) {
    const coords = this.getCoords()
    const newCoords = coords.map(coord => {
      return { x: coord.x + deltaX, y: coord.y + deltaY }
    })
    this.#update(newCoords)
  }

  reRoute (route) {
    this.route = route
    const direction = new Direction({
      jointSource: this.source.jointCoords(),
      jointTarget: this.target.jointCoords()
    })
    const newCoords = direction.getCoords(this.route)
    this.#update(newCoords)
  }

  onClick (evt) {
    const group = evt.target.parentNode
    const diagram = group.ownerSVGElement.diagram
    diagram.addShapeAt(group.diagramElement)
  }

  getGroup () {
    return this.#group
  }
}

class JointsPair {
  segmentType
  firstJoint
  secondJoint

  nearJoint
  farJoint

  constructor (obj) {
    Object.assign(this, obj)
    let firstIsNear = false
    if (this.segmentType === SegmentType.HorizontalTop) {
      if (this.firstJoint.top.y <= this.secondJoint.top.y) {
        firstIsNear = true
      }
    } else if (this.segmentType === SegmentType.HorizontalBottom) {
      if (this.firstJoint.bottom.y >= this.secondJoint.bottom.y) {
        firstIsNear = true
      }
    }
    if (firstIsNear) {
      this.nearJoint = this.firstJoint
      this.farJoint = this.secondJoint
    } else {
      this.nearJoint = this.secondJoint
      this.farJoint = this.firstJoint
    }
  }

  areEquals () {
    return (this.firstJoint.top.y === this.secondJoint.top.y)
  }

  exceedsLimitForSelfJoin (y, coords) {
    if (this.segmentType === SegmentType.HorizontalTop) {
      return (Math.max(coords[0].y, coords[coords.length - 1].y) - y) < (this.nearJoint.left.y - this.nearJoint.top.y)
    } else if (this.segmentType === SegmentType.HorizontalBottom) {
      return (y - Math.min(coords[0].y, coords[coords.length - 1].y)) < (this.nearJoint.bottom.y - this.nearJoint.left.y)
    }
  }

  nearOutermost () {
    if (this.segmentType === SegmentType.HorizontalTop) {
      return this.nearJoint.top
    } else if (this.segmentType === SegmentType.HorizontalBottom) {
      return this.nearJoint.bottom
    }
  }

  exceedsNearOutermostY (y) {
    if (this.segmentType === SegmentType.HorizontalTop) {
      return (y <= this.nearJoint.top.y)
    } else if (this.segmentType === SegmentType.HorizontalBottom) {
      return (y >= this.nearJoint.bottom.y)
    }
  }

  exceedsNearLeftY (y) {
    if (this.segmentType === SegmentType.HorizontalTop) {
      return (y >= this.nearJoint.left.y)
    } else if (this.segmentType === SegmentType.HorizontalBottom) {
      return (y <= this.nearJoint.left.y)
    }
  }

  exceedsNearRightY (y) {
    if (this.segmentType === SegmentType.HorizontalTop) {
      return (y >= this.nearJoint.right.y)
    } else if (this.segmentType === SegmentType.HorizontalBottom) {
      return (y <= this.nearJoint.right.y)
    }
  }

  exceedsFarOutermostY (y) {
    if (this.segmentType === SegmentType.HorizontalTop) {
      return (y >= this.farJoint.top.y)
    } else if (this.segmentType === SegmentType.HorizontalBottom) {
      return (y <= this.farJoint.bottom.y)
    }
  }

  exceedsLimitY (y, yRef) {
    if (this.segmentType === SegmentType.HorizontalTop) {
      return (y > yRef)
    } else if (this.segmentType === SegmentType.HorizontalBottom) {
      return (y < yRef)
    }
  }

  isSourceSide (yIni, yEnd) {
    if (this.segmentType === SegmentType.HorizontalTop) {
      return (yIni < yEnd)
    } else if (this.segmentType === SegmentType.HorizontalBottom) {
      return (yIni > yEnd)
    }
  }
}
