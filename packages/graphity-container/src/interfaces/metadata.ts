import { Name } from './common'

export interface MetadataStorable {
  injectParams: Map<Function, MetadataInjectParam[]>
  injectProps: Map<Function, MetadataInjectProp[]>
}

export interface MetadataInjectParam {
  target: Function
  property: PropertyKey | null
  index: number
  name: Name<any>
  resolver: ((instance: any) => any) | null
}

export interface MetadataInjectProp {
  target: Function
  property: PropertyKey
  name: Name<any>
  resolver: ((instance: any) => any) | null
}
