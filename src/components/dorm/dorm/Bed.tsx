import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Popconfirm, message } from 'antd'
import { DormBedModel } from 'model/DormModel'
import axios from 'tools/axios'

export default function DormBed(props: {
  data: DormBedModel
  editBed: (bed: DormBedModel) => void
}) {
  const size2 = '90px'
  return (
    <div className="Bed">
      <div style={{ position: 'absolute', top: 0, right: 2 }}>
        <Popconfirm
          title="是否删除该寝室床？"
          onConfirm={async (e) => {
            await axios.delete(`/dorm/dormBed/${props.data.id}`)
            message.success('成功删除寝室床')
            props.editBed({ ...props.data, id: -1 })
          }}>
          <DeleteOutlined className="BedIcon" />
        </Popconfirm>
        <EditOutlined
          className="BedIcon"
          onClick={() => {
            props.editBed(props.data)
          }}
        />
      </div>
      <div style={{ marginLeft: 5 }}>
        <svg height={size2} width={size2} version="1.1" viewBox="0 0 512 512">
          <g>
            <g>
              <path
                d="M466.824,165.647v45.177H150.588c0-24.949-20.227-45.175-45.177-45.175H45.176v-45.178H0v271.059h45.176v-45.176h421.647
			v45.176H512V165.647H466.824z M45.176,301.176v-90.351h60.235L105.413,256h45.175h135.529v22.588
			c0,7.922,1.373,15.523,3.872,22.588H45.176z M376.471,278.588c0,12.455-10.133,22.588-22.588,22.588
			c-12.455,0-22.588-10.133-22.588-22.588V256h45.176V278.588z M466.824,301.176h-49.048c2.498-7.066,3.872-14.666,3.872-22.588V256
			h45.176V301.176z"
              />
            </g>
          </g>
        </svg>

        {props.data.studentID != undefined ? (
          <>
            <div className="BedText">姓名：{props.data.studentName}</div>
            <div className="BedText">学号：{props.data.studentNo}</div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}
