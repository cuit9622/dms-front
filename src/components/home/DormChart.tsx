import ReactEChartsCore from 'echarts-for-react/lib/core'
import { BarChart } from 'echarts/charts'
import {
  DataZoomComponent,
  GridComponent,
  MarkPointComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { createRef, useRef } from 'react'

echarts.use([
  BarChart,
  TooltipComponent,
  TitleComponent,
  CanvasRenderer,
  GridComponent,
  DataZoomComponent,
  ToolboxComponent,
  MarkPointComponent,
])

export default function DormChart(props: { option: any }) {
  const echartRef = useRef(createRef() as any)
  return (
    <ReactEChartsCore ref={echartRef} echarts={echarts} option={props.option} />
  )
}
