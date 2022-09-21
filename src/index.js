import { Diagram } from './view/diagram.js'
import * as shape from './view/shapes.js'
import { FlowLine } from './view/flowline.js'

const w = 120
const h = 40
const d = 80
const x = 300
let y = 50

const diagram = new Diagram({
  id: 'main',
  holderDomId: 'myholder',
  className: 'programflow'
})

const single = new shape.SingleShape({
  id: 'singleShape',
  cx: x,
  cy: y += d,
  width: w,
  height: h,
  text: 'Single'
})
const interaction = new shape.InteractionShape({
  id: 'interactionShape',
  cx: x,
  cy: y += d,
  width: w,
  height: h,
  text: 'Interaction'
})
const split = new shape.SplitShape({
  id: 'splitShape',
  cx: x,
  cy: y += d,
  width: w,
  height: h,
  text: 'Split'
})
const terminal = new shape.TerminalShape({
  id: 'terminalShape',
  cx: x,
  cy: y += d,
  width: w,
  height: h,
  text: 'Terminal'
})
const loop = new shape.LoopShape({
  id: 'loopShape',
  cx: x,
  cy: y += d,
  width: w,
  height: h,
  text: 'Loop'
})
const aux = new shape.AuxiliarShape({
  id: 'auxShape',
  cx: x,
  cy: y += d,
  width: h * 2 / 3,
  height: h * 2 / 3,
  text: 'Aux'
})

const line1 = new FlowLine({
  id: 'line1',
  route: 'E 50 N 75 W * S *',
  source: single,
  target: single
})
const line2 = new FlowLine({
  id: 'line2',
  route: 'S *',
  source: single,
  target: interaction
})
const line3 = new FlowLine({
  id: 'line3',
  route: 'S *',
  source: interaction,
  target: split
})
const line4 = new FlowLine({
  id: 'line4',
  text: 'true',
  textDistance: -50,
  route: 'W 100 S * E *',
  source: split,
  target: terminal
})
const line5 = new FlowLine({
  id: 'line5',
  text: 'false',
  textDistance: 50,
  route: 'E 100 S * W *',
  source: split,
  target: terminal
})
const line6 = new FlowLine({
  id: 'line6',
  route: 'S *',
  source: terminal,
  target: loop
})
const line7 = new FlowLine({
  id: 'line7',
  route: 'S *',
  source: loop,
  target: aux
})

diagram.add(single)
diagram.add(interaction)
diagram.add(split)
diagram.add(terminal)
diagram.add(loop)
diagram.add(aux)
diagram.add(line1)
diagram.add(line2)
diagram.add(line3)
diagram.add(line4)
diagram.add(line5)
diagram.add(line6)
diagram.add(line7)
