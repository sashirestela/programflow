class Svg {
  static getMousePosition (svg, evt) {
    const CTM = svg.getScreenCTM()
    if (evt.touches) {
      evt = evt.touches[0]
    }
    return {
      x: (evt.clientX - CTM.e) / CTM.a,
      y: (evt.clientY - CTM.f) / CTM.d
    }
  }

  static getTranformTranslate (selected) {
    const svg = selected.ownerSVGElement
    const transforms = selected.transform.baseVal
    if (transforms.length === 0 || transforms[0].type !== window.SVGTransform.SVG_TRANSFORM_TRANSLATE) {
      const translate = svg.createSVGTransform()
      translate.setTranslate(0, 0)
      selected.transform.baseVal.insertItemBefore(translate, 0)
    }
    return transforms[0]
  }

  static get NS () {
    return 'http://www.w3.org/2000/svg'
  }

  static get MARGIN_SELECTION () {
    return 6
  }

  static get PADDING_TEXT_VERTICAL () {
    return 5
  }

  static get RADIUS_ADD_BUTTON () {
    return 8
  }

  static get POSITION_ADD_BUTTON () {
    return 3 / 8
  }

  static get TITLE_BUTTON () {
    return 'Add Statement'
  }
}

class MovementType {
  constructor (type) {
    this.type = type
  }

  static Horizontal = new MovementType('Horizontal')
  static Vertical = new MovementType('Vertical')
}

class TerminalType {
  contructor (type) {
    this.type = type
  }

  static Source = new TerminalType('Source')
  static Target = new TerminalType('Target')
}

class SegmentType {
  constructor (type) {
    this.type = type
  }

  static VerticalInner = new SegmentType('VerticalInner')
  static VerticalOuter = new SegmentType('VerticalOuter')
  static HorizontalTop = new SegmentType('HorizontalTop')
  static HorizontalBottom = new SegmentType('HorizontalBottom')
  static Undraggable = new SegmentType('Undraggable')
}

class Polyline {
  static coordsToPoints (coords) {
    const result = coords.reduce((points, coord) => {
      points += `${coord.x},${coord.y} `
      return points
    }, '').trim()
    return result
  }

  static pointsToCoords (points) {
    const result = points.trim().split(' ').reduce((coords, point) => {
      const pair = point.split(',')
      coords.push({ x: parseFloat(pair[0]), y: parseFloat(pair[1]) })
      return coords
    }, [])
    return result
  }

  static pickedSegmentOnPoints (points, coord) {
    const segment = []
    const coords = Polyline.pointsToCoords(points)
    for (let i = 0; i < coords.length - 1; i++) {
      const j = i + 1
      if (coords[i].x === coords[j].x) {
        if ((coord.y > coords[i].y && coord.y < coords[j].y) ||
          (coord.y > coords[j].y && coord.y < coords[i].y)) {
          if (Math.abs(coord.x - coords[i].x) <= Svg.MARGIN_SELECTION) {
            segment.push(coords[i])
            segment.push(coords[j])
            break
          }
        }
      } else if (coords[i].y === coords[j].y) {
        if ((coord.x > coords[i].x && coord.x < coords[j].x) ||
          (coord.x > coords[j].x && coord.x < coords[i].x)) {
          if (Math.abs(coord.y - coords[i].y) <= Svg.MARGIN_SELECTION) {
            segment.push(coords[i])
            segment.push(coords[j])
            break
          }
        }
      }
    }
    return segment
  }

  static isSegmentAlongBorder (segment, borderLines) {
    return borderLines.some(line =>
      segment[0].x >= line[0].x && segment[0].x <= line[1].x &&
      segment[0].y >= line[0].y && segment[0].y <= line[1].y &&
      segment[1].x >= line[0].x && segment[1].x <= line[1].x &&
      segment[1].y >= line[0].y && segment[1].y <= line[1].y)
  }

  static isVerticalAndOutsideOfJoints (segment, firstJoint, secondJoint) {
    const highest = (firstJoint.top.y < secondJoint.top.y ? firstJoint.top : secondJoint.top)
    const lowest = (firstJoint.bottom.y > secondJoint.bottom.y ? firstJoint.bottom : secondJoint.bottom)
    return segment[0].x === segment[1].x &&
      ((segment[0].y <= highest.y && segment[1].y <= highest.y) ||
      (segment[0].y >= lowest.y && segment[1].y >= lowest.y))
  }

  static segmentTypeOnPoints (segment, points) {
    const coords = Polyline.pointsToCoords(points)
    if (segment[0].x === segment[1].x) {
      const longest = [coords[0], coords[0]]
      for (let i = 0; i < coords.length - 1; i++) {
        const j = i + 1
        if (coords[i].x === coords[j].x) {
          if (Math.abs(coords[j].y - coords[i].y) > Math.abs(longest[1].y - longest[0].y)) {
            longest[0] = coords[i]
            longest[1] = coords[j]
          }
        }
      }
      if (Math.abs(coords[coords.length - 1].y - coords[0].y) === Math.abs(longest[1].y - longest[0].y)) {
        return SegmentType.VerticalInner
      } else {
        return SegmentType.VerticalOuter
      }
    } else if (segment[0].y === segment[1].y) {
      let highest = coords[0].y
      let lowest = coords[0].y
      for (let i = 0; i < coords.length - 1; i++) {
        const j = i + 1
        if (coords[i].y === coords[j].y) {
          if (coords[i].y < highest) {
            highest = coords[i].y
          }
          if (coords[i].y > lowest) {
            lowest = coords[i].y
          }
        }
      }
      if (segment[0].y === highest) {
        return SegmentType.HorizontalTop
      } else if (segment[0].y === lowest) {
        return SegmentType.HorizontalBottom
      } else {
        return SegmentType.Undraggable
      }
    } else {
      return SegmentType.Undraggable
    }
  }

  static coordAlongCoords (distance, coords, isForText = false) {
    let coord = { x: null, y: null }
    let coordCurr = { x: null, y: null }
    let coordNext = { x: null, y: null }
    let distAbs = Math.abs(distance)
    for (let i = 0; i < coords.length - 1; i++) {
      coordCurr = coords[distance >= 0 ? i : coords.length - 1 - i]
      coordNext = coords[distance >= 0 ? i + 1 : coords.length - 2 - i]
      let dist = Math.sqrt(Math.pow(coordNext.x - coordCurr.x, 2) + Math.pow(coordNext.y - coordCurr.y, 2))
      if (distAbs <= dist) {
        coord = { x: coordCurr.x, y: coordCurr.y }
        if (coordCurr.x === coordNext.x) {
          coord.y += distAbs * (coordCurr.y < coordNext.y ? 1 : -1)
        } else if (coordCurr.y === coordNext.y) {
          coord.x += distAbs * (coordCurr.x < coordNext.x ? 1 : -1)
          if (isForText) coord.y -= Svg.PADDING_TEXT_VERTICAL
        }
        break
      } else {
        distAbs -= dist
      }
    }
    return coord
  }

  static length (coords) {
    let total = 0
    let coordCurr, coordNext
    for (let i = 0; i < coords.length - 1; i++) {
      coordCurr = coords[i]
      coordNext = coords[i + 1]
      total += Math.sqrt(Math.pow(coordNext.x - coordCurr.x, 2) + Math.pow(coordNext.y - coordCurr.y, 2))
    }
    return total
  }
}

class Direction {
  jointSource
  jointTarget

  constructor (obj) {
    Object.assign(this, obj)
  }

  #calculateStartCoord (address) {
    switch (address) {
      case 'W':
        return this.jointSource.left
      case 'S':
        return this.jointSource.bottom
      case 'E':
        return this.jointSource.right
      case 'N':
        return this.jointSource.top
    }
  }

  #calculateEndCoord (address) {
    switch (address) {
      case 'W':
        return this.jointTarget.right
      case 'S':
        return this.jointTarget.top
      case 'E':
        return this.jointTarget.left
      case 'N':
        return this.jointTarget.bottom
    }
  }

  getCoords (route) {
    const routeArray = route.split(' ')
    const startCoord = this.#calculateStartCoord(routeArray[0])
    const endCoord = this.#calculateEndCoord(routeArray[routeArray.length - 2])
    const coords = [startCoord]
    for (let i = 0; i < routeArray.length; i += 2) {
      const address = routeArray[i]
      const value = routeArray[i + 1]
      const prevCoord = coords[coords.length - 1]
      const newCoord = { x: null, y: null }
      if ('WE'.includes(address)) {
        newCoord.y = prevCoord.y
        if (value === '*') {
          newCoord.x = endCoord.x
        } else {
          newCoord.x = prevCoord.x + parseInt(value) * (address === 'E' ? 1 : -1)
        }
      } else if ('SN'.includes(address)) {
        newCoord.x = prevCoord.x
        if (value === '*') {
          newCoord.y = endCoord.y
        } else {
          newCoord.y = prevCoord.y + parseInt(value) * (address === 'S' ? 1 : -1)
        }
      }
      coords.push(newCoord)
    }
    return coords
  }
}

export {
  Svg,
  MovementType,
  TerminalType,
  SegmentType,
  Polyline,
  Direction
}
