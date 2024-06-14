import {
  Button,
  Collapse,
  CollapseProps,
  Pagination,
  Popconfirm,
  Select,
} from 'antd'
import { GlobalContext } from 'app'
import { DormBedModel, DormModel, SelectOption } from 'model/DormModel'
import React, { useContext, useEffect, useRef, useState } from 'react'
import axios from 'tools/axios'
import { DormBuilding } from './DormBuildingMgr'
import { DormEditor } from './DormEditor'
import './dorm.css'
import Dorm from './dorm/Dorm'
import { DormBedEditor } from './dorm/DormBedEditor'

interface DormRequest extends PageRequest {
  dormBuildingID: number
  floor: number
}

const DormMgr: React.FC = () => {
  const dorm = useRef<DormModel>({
    id: 0,
    dormBuildingID: 0,
    floor: 0,
    name: '',
    size: 0,
  })
  const bed = useRef<DormBedModel>({
    id: 0,
    studentID: 0,
  })
  const [dormModal, setDormModal] = useState(false)
  const [bedModal, setBedModal] = useState(false)
  const [builings, SetBuildings] = useState<SelectOption[]>([])
  const buildingFloor = useRef<Map<number, number>>(new Map())
  const [floors, SetFloors] = useState<SelectOption[]>([])

  const [loading, setLoading] = useState(true)
  const [list, setList] = useState<CollapseProps['items']>([])
  const [total, setTotal] = useState<number>(0)
  const [update, setUpdate] = useState<boolean>(false)
  const [reqParam, setReqParam] = useState<DormRequest>({
    page: 1,
    pageSize: 5,
    dormBuildingID: 1,
    floor: 1,
  })
  const { messageApi } = useContext(GlobalContext)

  useEffect(() => {
    ;(async () => {
      const res = await axios.get('/dorm/dormBuilding', {
        params: {
          page: 1,
          pageSize: 100,
        },
      })
      const data: PageResult<DormBuilding> = res.data

      buildingFloor.current.clear()
      SetBuildings(
        data.records.map((item) => {
          buildingFloor.current.set(item.id, item.floor!)
          return {
            value: item.id,
            label: `${item.name} (${item.sex == 0 ? '女' : '男'})`,
          }
        })
      )
      const buildingID = data.records[0].id
      const floor = buildingFloor.current.get(buildingID)
      const floors: SelectOption[] = []
      for (let i = 1; i <= floor!; i++) {
        floors.push({
          value: i,
          label: `${i}楼`,
        })
      }
      SetFloors(floors)

      setReqParam({
        ...reqParam,
        dormBuildingID: buildingID,
        floor: 1,
      })
    })()
  }, [])
  useEffect(() => {
    if (dormModal == true || bedModal == true) {
      return
    }
    loadList()
  }, [update, reqParam, dormModal, bedModal])

  const loadList = async () => {
    const res = await axios.get('/dorm/dorm', { params: reqParam })
    const data: PageResult<DormModel> = res.data
    setTotal(data.total)
    setList(
      data.records.map((item: DormModel) => {
        return {
          key: item.id,
          label: item.name,
          children: <Dorm data={item} editBed={editBed} />,
          extra: (
            <>
              <Popconfirm
                title="是否删除该寝室？"
                onCancel={(e) => {
                  e?.stopPropagation()
                }}
                onConfirm={async (e) => {
                  e?.stopPropagation()
                  delDorm(item.id)
                }}>
                <Button
                  danger
                  style={{ marginRight: 10 }}
                  onClick={(e) => {
                    e.stopPropagation()
                  }}>
                  删除寝室
                </Button>
              </Popconfirm>
              <Button
                style={{ marginRight: 10 }}
                onClick={(e) => {
                  e.stopPropagation()
                  dorm.current = {
                    ...item,
                    dormBuildingID: reqParam.dormBuildingID,
                    floor: reqParam.floor,
                  }
                  setDormModal(true)
                }}>
                编辑寝室
              </Button>
              <Button
                type="primary"
                onClick={async (e) => {
                  e.stopPropagation()
                  await axios.put('/dorm/dormBed', {
                    id: 0,
                    dormID: item.id,
                    studentNo: '',
                    studentID: 0,
                  })
                  messageApi.success('成功添加寝室床')
                  setUpdate((update) => !update)
                }}>
                添加床位
              </Button>
            </>
          ),
        }
      })
    )
    setLoading(false)
  }

  const editBed = (bedData: DormBedModel) => {
    if (bedData.id == -1) {
      setUpdate((update) => !update)
      return
    }
    bed.current = bedData
    setBedModal(true)
  }
  // 单条删除
  const delDorm = async (id: number) => {
    await axios.delete(`/dorm/dorm/${id}`)
    messageApi.success('成功删除')
    if (list?.length == 1) {
      setReqParam((old) => {
        return { ...old, page: old.page - 1 }
      })
    }
    setUpdate((update) => !update)
  }

  return (
    <>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: 5,
            }}>
            <Select
              disabled={loading}
              allowClear={false}
              placeholder="请选择寝室楼"
              style={{ width: 130, marginRight: 5 }}
              onChange={(v) => {
                setLoading(true)

                const floor = buildingFloor.current.get(v)
                const floors: SelectOption[] = []
                for (let i = 1; i <= floor!; i++) {
                  floors.push({
                    value: i,
                    label: `${i}楼`,
                  })
                }
                SetFloors(floors)

                setReqParam({
                  ...reqParam,
                  dormBuildingID: v,
                  floor: 1,
                })
              }}
              options={builings}
              value={reqParam.dormBuildingID}
            />
            <Select
              disabled={loading}
              allowClear={false}
              placeholder="请选择楼层"
              style={{ width: 130 }}
              onChange={(v) => {
                setLoading(true)
                setReqParam({
                  ...reqParam,
                  floor: v,
                })
              }}
              options={floors}
              value={reqParam.floor}
            />
            <Button
              type="primary"
              style={{ marginLeft: 'auto', marginRight: 17 }}
              onClick={() => {
                dorm.current = {
                  id: 0,
                  name: '',
                  size: 0,
                  dormBuildingID: reqParam.dormBuildingID,
                  floor: reqParam.floor,
                }
                setDormModal(true)
              }}>
              添加寝室
            </Button>
          </div>
        </div>
        <DormEditor
          dorm={dorm.current}
          modalOpen={dormModal}
          setModalOpen={setDormModal}
        />
        <DormBedEditor
          bed={bed.current}
          modalOpen={bedModal}
          setModalOpen={setBedModal}
        />
        <Collapse accordion items={list} />
        <Pagination
          disabled={loading}
          style={{ float: 'right' }}
          pageSize={reqParam.pageSize}
          showSizeChanger
          pageSizeOptions={[5, 10, 15, 20]}
          onChange={(page, pageSize) => {
            setLoading(true)
            setReqParam({
              ...reqParam,
              page: page,
              pageSize: pageSize,
            })
          }}
          total={total}
          showQuickJumper
          showTotal={(total) => `总共${total}条数据`}
        />
      </div>
    </>
  )
}

export default DormMgr
