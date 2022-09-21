import { Svg } from './../utils/svg_utils.js'

export class FlowLine {
  id = null
  text = null
  textDistance = 0
  route = null
  source = null
  target = null

  #group

  constructor (obj) {
    Object.assign(this, obj)
    this.#config()
  }

  #config () {
    this.source.connect(this)
    this.target.connect(this)

    const direction = new Direction({
      route: this.route,
      pointsSource: this.source.getJointPoints(),
      pointsTarget: this.target.getJointPoints()
    })

    this.#group = document.createElementNS(Svg.NS, 'g')
    this.#group.setAttributeNS(null, 'id', this.id)
    this.#group.classList.add('draggable')

    const points = direction.getPoints()
    const polyline = document.createElementNS(Svg.NS, 'polyline')
    polyline.setAttributeNS(null, 'points', this.#concatenatePoints(points))
    const polyline1 = polyline.cloneNode(true)
    polyline1.classList.add('flowlines-shadow')
    const polyline2 = polyline.cloneNode(true)
    polyline2.classList.add('flowlines')
    this.#group.appendChild(polyline1)
    this.#group.appendChild(polyline2)

    if (this.text !== null) {
      const textCoord = this.#calculateTextCoord(points)
      const text = document.createElementNS(Svg.NS, 'text')
      text.setAttributeNS(null, 'text-anchor', 'middle')
      text.setAttributeNS(null, 'x', textCoord.x)
      text.setAttributeNS(null, 'y', textCoord.y)
      text.appendChild(document.createTextNode(`[${this.text}]`))
      this.#group.appendChild(text)
    }

    this.#group.diagramElement = this
  }

  #concatenatePoints (points) {
    let strPoints = ''
    for (let i = 0; i < points.length; i++) {
      strPoints += `${points[i].x},${points[i].y} `
    }
    return strPoints
  }

  #calculateTextCoord (points) {
    let point1 = { x: null, y: null }
    let point2 = { x: null, y: null }
    let distance
    if (this.textDistance >= 0) {
      point1 = points[0]
      point2 = points[1]
      distance = this.textDistance
    } else {
      point1 = points[points.length - 1]
      point2 = points[points.length - 2]
      distance = -1 * this.textDistance
    }
    const textCoord = point1
    if (point1.x === point2.x) {
      textCoord.y += distance * (point1.y < point2.y ? 1 : -1)
    } else if (point1.y === point2.y) {
      textCoord.x += distance * (point1.x < point2.x ? 1 : -1)
      textCoord.y -= 5
    }
    return textCoord
  }

  startDrag (evt) {
    // Keep it to allow generic calling from Diagram
  }

  drag (evt) {
    const svg = this.#group.ownerSVGElement
    const pointsSource = this.source.getJointPoints()
    const pointsTarget = this.target.getJointPoints()
    const coord = Svg.getMousePosition(svg, evt)

    let refSource = null
    if (coord.x <= pointsSource.left.x) {
      refSource = pointsSource.left
    } else if (coord.x >= pointsSource.right.x) {
      refSource = pointsSource.right
    } else {
      refSource = pointsSource.bottom
    }
    let refTarget = null
    if (coord.x <= pointsTarget.left.x) {
      refTarget = pointsTarget.left
    } else if (coord.x >= pointsTarget.right.x) {
      refTarget = pointsTarget.right
    } else {
      refTarget = pointsTarget.top
    }

    let strPoints = `${refSource.x},${refSource.y} `
    if (coord.x !== refSource.x) {
      strPoints += `${coord.x},${refSource.y} `
    }
    if (coord.x !== refTarget.x) {
      strPoints += `${coord.x},${refTarget.y} `
    }
    strPoints += `${refTarget.x},${refTarget.y}`

    const polyline1 = this.#group.childNodes[0]
    polyline1.setAttributeNS(null, 'points', strPoints)
    const polyline2 = this.#group.childNodes[1]
    polyline2.setAttributeNS(null, 'points', strPoints)
  }

  getGroup () {
    return this.#group
  }
}

class Direction {
  route
  pointsSource
  pointsTarget

  constructor (obj) {
    Object.assign(this, obj)
  }

  #calculateStartPoint (address) {
    switch (address) {
      case 'W':
        return this.pointsSource.left
      case 'S':
        return this.pointsSource.bottom
      case 'E':
        return this.pointsSource.right
      case 'N':
        return this.pointsSource.top
    }
  }

  #calculateEndPoint (address) {
    switch (address) {
      case 'W':
        return this.pointsTarget.right
      case 'S':
        return this.pointsTarget.top
      case 'E':
        return this.pointsTarget.left
      case 'N':
        return this.pointsTarget.bottom
    }
  }

  getPoints () {
    const routeArray = this.route.split(' ')
    const startPoint = this.#calculateStartPoint(routeArray[0])
    const endPoint = this.#calculateEndPoint(routeArray[routeArray.length - 2])
    const points = [startPoint]
    for (let i = 0; i < routeArray.length; i += 2) {
      const address = routeArray[i]
      const value = routeArray[i + 1]
      const prevPoint = points[points.length - 1]
      const newPoint = { x: null, y: null }
      if ('WE'.includes(address)) {
        newPoint.y = prevPoint.y
        if (value === '*') {
          newPoint.x = endPoint.x
        } else {
          newPoint.x = prevPoint.x + parseInt(value) * (address === 'E' ? 1 : -1)
        }
      } else if ('SN'.includes(address)) {
        newPoint.x = prevPoint.x
        if (value === '*') {
          newPoint.y = endPoint.y
        } else {
          newPoint.y = prevPoint.y + parseInt(value) * (address === 'S' ? 1 : -1)
        }
      }
      points.push(newPoint)
    }
    return points
  }
}
