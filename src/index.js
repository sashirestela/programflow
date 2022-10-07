import { Diagram } from './view/diagram.js'
import * as shape from './view/shapes.js'
import { FlowLine } from './view/flowline.js'

const w = 120
const h = 30
const d = 65
const x = 300
let y = 0

const diagram = new Diagram({
  id: 'main',
  holderDomId: 'myholder',
  className: 'programflow'
})

const start = new shape.TerminalShape({
  id: 'startShape',
  cx: x,
  cy: y += d,
  width: w,
  height: h,
  text: 'Main'
})
const assignment = new shape.SingleShape({
  id: 'assignmentShape',
  cx: x,
  cy: y += d,
  width: w,
  height: h,
  text: 'Assignment'
})
const input = new shape.InteractionShape({
  id: 'inputShape',
  cx: x,
  cy: y += d,
  width: w,
  height: h,
  text: 'Input'
})
const ifElse = new shape.SplitShape({
  id: 'ifElseShape',
  cx: x,
  cy: y += d,
  width: w,
  height: h,
  text: 'IfElse'
})
const aux1 = new shape.AuxiliarShape({
  id: 'aux1Shape',
  cx: x,
  cy: y += d,
  width: h * 2 / 3,
  height: h * 2 / 3,
  text: ''
})
const invocation = new shape.SingleShape({
  id: 'invocationShape',
  cx: x,
  cy: y += d,
  width: w,
  height: h,
  text: 'Invocation'
})
const loop = new shape.LoopShape({
  id: 'loopShape',
  cx: x,
  cy: y += d,
  width: w,
  height: h,
  text: 'Loop'
})
const aux2 = new shape.AuxiliarShape({
  id: 'aux2Shape',
  cx: x,
  cy: y += d,
  width: h * 2 / 3,
  height: h * 2 / 3,
  text: ''
})
const output = new shape.InteractionShape({
  id: 'outputShape',
  cx: x,
  cy: y += d,
  width: w,
  height: h,
  text: 'Output'
})
const end = new shape.TerminalShape({
  id: 'endShape',
  cx: x,
  cy: y += d,
  width: w,
  height: h,
  text: 'End'
})

const line1 = new FlowLine({
  id: 'line1',
  route: 'S *',
  source: start,
  target: assignment
})
const line2 = new FlowLine({
  id: 'line2',
  route: 'S *',
  source: assignment,
  target: input
})
const line3 = new FlowLine({
  id: 'line3',
  route: 'S *',
  source: input,
  target: ifElse
})
const line4 = new FlowLine({
  id: 'line4',
  text: 'true',
  textGap: 20,
  route: 'W 40 S * E *',
  source: ifElse,
  target: aux1
})
const line5 = new FlowLine({
  id: 'line5',
  text: 'false',
  textGap: 20,
  route: 'E 40 S * W *',
  source: ifElse,
  target: aux1
})
const line6 = new FlowLine({
  id: 'line6',
  route: 'S *',
  source: aux1,
  target: invocation
})
const line7 = new FlowLine({
  id: 'line7',
  route: 'S *',
  source: invocation,
  target: loop
})
const line8 = new FlowLine({
  id: 'line8',
  text: 'next',
  textGap: 20,
  route: 'S 30 W 100 N * E *',
  source: loop,
  target: loop
})
const line9 = new FlowLine({
  id: 'line9',
  route: 'E 40 S * W *',
  text: 'end',
  textGap: 20,
  isActionable: false,
  source: loop,
  target: aux2
})
const line10 = new FlowLine({
  id: 'line10',
  route: 'S *',
  source: aux2,
  target: output
})
const line11 = new FlowLine({
  id: 'line11',
  route: 'S *',
  source: output,
  target: end
})

diagram.add(start)
diagram.add(assignment)
diagram.add(input)
diagram.add(ifElse)
diagram.add(aux1)
diagram.add(invocation)
diagram.add(loop)
diagram.add(aux2)
diagram.add(output)
diagram.add(end)
diagram.add(line1)
diagram.add(line2)
diagram.add(line3)
diagram.add(line4)
diagram.add(line5)
diagram.add(line6)
diagram.add(line7)
diagram.add(line8)
diagram.add(line9)
diagram.add(line10)
diagram.add(line11)
