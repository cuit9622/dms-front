import { Col, Row, Statistic } from 'antd'
import { useEffect, useState } from 'react'
import axios from 'tools/axios'
import DormChart from './DormChart'
import Notice from './Notice'

export default function Home() {
  const [repairNum, setRepairNum] = useState(0)
  const [option, setOption] = useState({
    title: {
      left: 25,
      text: `学生统计`,
    },
    xAxis: {
      data: [] as string[],
    },
    yAxis: {
      type: 'value',
      boundaryGap: false,
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100,
      },
      {
        start: 100,
        end: 0,
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
    series: [
      {
        name: '人数',
        data: [] as number[],
        type: 'bar',
        stack: 'x',
      },
    ],
  })
  useEffect(() => {
    ;(async () => {
      axios.get('/dormRepair/repair/getNum').then((rep) => {
        setRepairNum(rep.data)
      })
      const rep = await axios.get('/dorm/dormCount')
      const values: number[] = []
      const names: string[] = []
      const data: { count?: number; id: number; name: string }[] = rep.data
      for (const item of data) {
        values.push(item.count ? item.count : 0)
        names.push(item.name)
      }
      setOption((option) => {
        return {
          ...option,
          series: {
            ...option.series,
            data: values,
          },
          xAxis: {
            data: names,
          },
        }
      })
    })()
  }, [])
  return (
    <div style={{ width: '100%' }}>
      <Row style={{ margin: 20 }} gutter={16}>
        <Col span={12}>
          <Statistic title="寝室栋数" value={option.xAxis.data.length} />
        </Col>
        <Col span={12}>
          <Statistic title="待处理报修" value={repairNum} />
        </Col>
      </Row>
      <DormChart option={option} />
      <Notice />
    </div>
  )
}
