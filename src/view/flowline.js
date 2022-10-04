import { Svg, MovementType, TerminalType, SegmentType, Polyline, Direction } from './../utils/graphics.js'

export class FlowLine {
  id = null
  text = null
  textDistance = 0
  route = null
  source = null
  target = null

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

    this.#group = document.createElementNS(Svg.NS, 'g')
    this.#group.setAttributeNS(null, 'id', this.id)
    this.#group.classList.add('draggable')

    const coords = direction.getCoords(this.route)
    const polyline = document.createElementNS(Svg.NS, 'polyline')
    polyline.setAttributeNS(null, 'points', Polyline.coordsToPoints(coords))
    const polyline1 = polyline.cloneNode(true)
    polyline1.classList.add('flowlines-shadow')
    const polyline2 = polyline.cloneNode(true)
    polyline2.classList.add('flowlines')
    this.#group.appendChild(polyline1)
    this.#group.appendChild(polyline2)

    if (this.text !== null) {
      const textCoord = this.#calculateTextCoord(coords)
      const text = document.createElementNS(Svg.NS, 'text')
      text.setAttributeNS(null, 'text-anchor', 'middle')
      text.setAttributeNS(null, 'x', textCoord.x)
      text.setAttributeNS(null, 'y', textCoord.y)
      text.appendChild(document.createTextNode(this.text))
      this.#group.appendChild(text)
    }

    this.#group.diagramElement = this
  }

  #calculateTextCoord (coords) {
    let coord1 = { x: null, y: null }
    let coord2 = { x: null, y: null }
    let distance
    if (this.textDistance >= 0) {
      coord1 = coords[0]
      coord2 = coords[1]
      distance = this.textDistance
    } else {
      coord1 = coords[coords.length - 1]
      coord2 = coords[coords.length - 2]
      distance = -1 * this.textDistance
    }
    const textCoord = coord1
    if (coord1.x === coord2.x) {
      textCoord.y += distance * (coord1.y < coord2.y ? 1 : -1)
    } else if (coord1.y === coord2.y) {
      textCoord.x += distance * (coord1.x < coord2.x ? 1 : -1)
      textCoord.y -= 5
    }
    return textCoord
  }

  startDrag (evt) {
    const svg = this.#group.ownerSVGElement
    const jointSource = this.source.jointCoords()
    const jointTarget = this.target.jointCoords()
    const coord = Svg.getMousePosition(svg, evt)
    const points = this.#group.childNodes[0].getAttributeNS(null, 'points')
    const segment = Polyline.pickedSegmentOnPoints(points, coord, Svg.MARGIN)
    let isDraggable = (segment.length > 0)
    isDraggable = isDraggable &&
      !Polyline.isVerticalAndOutsideOfJoints(segment, jointSource, jointTarget)
    isDraggable = isDraggable &&
      !(Polyline.isSegmentAlongBorder(segment, this.source.borderLines()) ||
        Polyline.isSegmentAlongBorder(segment, this.target.borderLines()))
    if (isDraggable) {
      this.#selectedSegmentType = Polyline.segmentTypeOnPoints(segment, points)
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
    const svg = this.#group.ownerSVGElement
    const jointSource = this.source.jointCoords()
    const jointTarget = this.target.jointCoords()
    const coord = Svg.getMousePosition(svg, evt)
    let points
    if (this.#selectedSegmentType === SegmentType.VerticalInner) {
      points = this.#dragVerticalInner(coord, jointSource, jointTarget)
    } else if (this.#selectedSegmentType === SegmentType.VerticalOuter) {
      points = this.#dragVerticalOutter(coord, jointSource, jointTarget)
    } else if (this.#selectedSegmentType === SegmentType.HorizontalTop ||
      this.#selectedSegmentType === SegmentType.HorizontalBottom) {
      points = this.#dragHorizontal(coord, jointSource, jointTarget)
    }
    if (this.#selectedSegmentType !== SegmentType.Undraggable) {
      const polyline1 = this.#group.childNodes[0]
      polyline1.setAttributeNS(null, 'points', points)
      const polyline2 = this.#group.childNodes[1]
      polyline2.setAttributeNS(null, 'points', points)
      const text = this.#group.childNodes[2]
      if (text !== undefined) {
        const textCoord = this.#calculateTextCoord(Polyline.pointsToCoords(points))
        text.setAttributeNS(null, 'x', textCoord.x)
        text.setAttributeNS(null, 'y', textCoord.y)
      }
    }
  }

  #dragVerticalInner (coord, jointSource, jointTarget) {
    let strPoints
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
    strPoints = `${refSource.x},${refSource.y} `
    if (coord.x !== refSource.x) {
      strPoints += `${coord.x},${refSource.y} `
    }
    if (coord.x !== refTarget.x) {
      strPoints += `${coord.x},${refTarget.y} `
    }
    strPoints += `${refTarget.x},${refTarget.y}`
    return strPoints
  }

  #dragVerticalOutter (coord, jointSource, jointTarget) {
    let strPoints
    const coords = this.#getCoords()
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
    strPoints = `${refSource.x},${refSource.y} `
    if (lowerSource) {
      if (coord.x !== refSource.x) {
        strPoints += `${coord.x},${refSource.y} `
      }
    } else {
      strPoints += `${refSource.x},${this.#selectedSegment[0].y} `
      strPoints += `${coord.x},${this.#selectedSegment[0].y} `
    }
    if (lowerTarget) {
      if (coord.x !== refTarget.x) {
        strPoints += `${coord.x},${refTarget.y} `
      }
    } else {
      strPoints += `${coord.x},${this.#selectedSegment[1].y} `
      strPoints += `${refTarget.x},${this.#selectedSegment[1].y} `
    }
    strPoints += `${refTarget.x},${refTarget.y}`
    return strPoints
  }

  #dragHorizontal (coord, jointSource, jointTarget) {
    let strPoints
    const coords = this.#getCoords()
    const joints = new JointsPair({
      segmentType: this.#selectedSegmentType,
      firstJoint: jointSource,
      secondJoint: jointTarget
    })
    if (joints.areEquals() && joints.exceedsLimitForSelfJoin(coord.y, coords)) {
      strPoints = Polyline.coordsToPoints(coords)
      return strPoints
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
      const newCoords = [ref]
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
      strPoints = Polyline.coordsToPoints(newCoords)
    } else {
      const newCoords = []
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
      strPoints = Polyline.coordsToPoints(newCoords)
    }
    return strPoints
  }

  startShapeDrag (terminalType) {
    const jointCoords = (terminalType === TerminalType.Source
      ? this.source.jointCoords()
      : this.target.jointCoords())
    const coords = this.#getCoords()
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
    let coords = this.#getCoords()
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
    const points = Polyline.coordsToPoints(coords)
    const polyline1 = this.#group.childNodes[0]
    polyline1.setAttributeNS(null, 'points', points)
    const polyline2 = this.#group.childNodes[1]
    polyline2.setAttributeNS(null, 'points', points)
    const text = this.#group.childNodes[2]
    if (text !== undefined) {
      const textCoord = this.#calculateTextCoord(coords)
      text.setAttributeNS(null, 'x', textCoord.x)
      text.setAttributeNS(null, 'y', textCoord.y)
    }
  }

  #getCoords () {
    const points = this.#group.childNodes[0].getAttributeNS(null, 'points')
    const coords = Polyline.pointsToCoords(points)
    return coords
  }

  #removeDuplicateCoords (coords) {
    return coords.filter((c, i) => coords.findIndex(cc => cc.x === c.x && cc.y === c.y) === i)
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
