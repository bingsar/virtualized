type LangMap = Record<string, string>
type Dict<T = unknown> = Record<string, T>

export type NationItem = {
  name: string
  icons?: Record<string, string | undefined>
  localization?: { mark?: LangMap }
  id?: number
}
export type NationsData = Dict<NationItem> | NationItem[] | undefined

type LocaleMap = Record<string, string>

export type VehicleCore = {
  level: number
  name: string
  nation: string
  tags?: string[]
  type?: string
  icons?: Record<string, string | undefined>
  localization?: {
    description?: LocaleMap
    shortmark?: LocaleMap
  }
  [k: string]: unknown
}

export type VehiclesMap = Dict<VehicleCore>

export type VehicleTypeItem = {
  name?: string
  icons?: Record<string, string>
  localization?: { mark?: LangMap }
  [k: string]: unknown
}
export type VehicleTypeMap = Dict<VehicleTypeItem>

export type VehicleDerived = VehicleCore & {
  id: string
  effectiveType?: string
  nationLower: string
  nameLower: string
  displayNameLower: string
}

export type VehiclesSliceState = {
  iconsBase: string
  nations: {
    keys: string[]
    nameMap: Record<string, string>
    iconMap: Record<string, string | undefined>
  }
  types: {
    map: VehicleTypeMap
    keys: string[]
    nameMap: Record<string, string>
  }
  vehicles: {
    raw: VehiclesMap
    list: VehicleDerived[]
    map: Record<string, VehicleDerived>
  }
}
