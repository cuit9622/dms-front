export interface DormModel {
  key?: string
  id: number
  dormBeds?: DormBedModel[]
  dormBuildingID: number
  floor: number
  name: string
  size: number
}

export interface DormBedModel {
  id: number
  studentID: number
  dormID?: number
  studentName?: string
  studentNo?: string
}

export interface SelectOption {
  value: number
  label: string
}
