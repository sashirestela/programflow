import { Diagram } from './view/diagram.js'
import * as shape from './view/shapes.js'
import { FlowLine } from './view/flowline.js'

const gs = 12
const w = (gs*12)
const h = (gs*2)
const u = (gs*2)
const g = (gs*3)
const d = (g+h)
const e = (gs*3)
const s = (gs*3)
const wt = (gs*1)

const x = (gs*30)
let y = 0

const diagram = new Diagram({
  id: 'main',
  holderDomId: 'myholder',
  shapeWidth: w,
  shapeHeight: h,
  shapeGap: g,
  defaultSouth: (gs*2),
  gridSize: gs
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
  cy: y += (d + h/2),
  width: w,
  height: h*2,
  text: 'Assignment'
})
const input = new shape.InteractionShape({
  id: 'inputShape',
  cx: x,
  cy: y += (d + h/2),
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
  width: u,
  height: u,
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
  text: 'WhileDo'
})
const aux2 = new shape.AuxiliarShape({
  id: 'aux2Shape',
  cx: x,
  cy: y += d,
  width: u,
  height: u,
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
const aux3 = new shape.AuxiliarShape({
  id: 'aux3Shape',
  cx: x,
  cy: y += d,
  width: u,
  height: u,
  text: 'Do'
})
const doLoop = new shape.LoopShape({
  id: 'doLoopShape',
  cx: x,
  cy: y += d,
  width: w,
  height: h,
  text: 'While'
})
const end = new shape.TerminalShape({
  id: 'endShape',
  cx: x,
  cy: y += d,
  width: w,
  height: h,
  text: 'End'
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
diagram.add(aux3)
diagram.add(doLoop)
diagram.add(end)

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
  route: 'S *',
  source: ifElse,
  target: aux1
})
const line5 = new FlowLine({
  id: 'line5',
  text: 'false',
  route: `E ${e} S * W *`,
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
  route: `E ${e} S ${s} W * N *`,
  source: loop,
  target: loop
})
const line9 = new FlowLine({
  id: 'line9',
  route: `W ${wt} S * E *`,
  text: 'end',
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
  target: aux3
})
const line12 = new FlowLine({
  id: 'line12',
  route: `E ${e+((w-u)/2)} S * W *`,
  source: aux3,
  target: doLoop
})
const line13 = new FlowLine({
  id: 'line13',
  route: `W ${wt} N * E *`,
  isActionable: false,
  source: doLoop,
  text: 'next',
  target: aux3
})
const line14 = new FlowLine({
  id: 'line14',
  route: 'S *',
  text: 'end',
  source: doLoop,
  target: end
})

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
diagram.add(line12)
diagram.add(line13)
diagram.add(line14)
