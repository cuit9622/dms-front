import { Empty } from 'antd'
import { DormBedModel, DormModel } from 'model/DormModel'
import DormBed from './Bed'

export default function Dorm(props: {
  data: DormModel
  editBed: (bed: DormBedModel) => void
}) {
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
      }}>
      {props.data.dormBeds != undefined ? (
        (() => {
          props.data.dormBeds.sort((a, b) => {
            return a.id - b.id
          })
          return props.data.dormBeds.map((item: DormBedModel) => (
            <DormBed
              key={item.id}
              data={{ ...item, dormID: props.data.id }}
              editBed={props.editBed}
            />
          ))
        })()
      ) : (
        <Empty style={{ width: '100%' }} />
      )}
    </div>
  )
}
