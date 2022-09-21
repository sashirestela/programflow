export class Svg {
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

  static clonedEvent (evt, x, y) {
    return {
      touches: evt.touches,
      clientX: x,
      clientY: y
    }
  }

  static get NS () {
    return 'http://www.w3.org/2000/svg'
  }
}
