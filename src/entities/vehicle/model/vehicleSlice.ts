import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'
import { wowsApi } from '@/services/api/wowsApi'
import { getDisplayName } from '@/shared/lib/locale'
import type {
  NationsData,
  NationItem,
  VehicleDerived,
  VehiclesMap,
  VehicleTypeItem,
  VehicleTypeMap,
  VehiclesSliceState,
} from './types'
export type { VehicleDerived } from './types'

const initialState: VehiclesSliceState = {
  iconsBase: '',
  nations: {
    keys: [],
    nameMap: {},
    iconMap: {},
  },
  types: {
    map: {},
    keys: [],
    nameMap: {},
  },
  vehicles: {
    raw: {},
    list: [],
    map: {},
  },
}

const toNationArray = (data: NationsData): NationItem[] =>
  !data ? [] : Array.isArray(data) ? data : Object.values(data)

const nationKey = (n: NationItem) => String(n.name).toLowerCase()
const nationLabel = (n: NationItem) => n.localization?.mark?.en ?? n.name ?? nationKey(n)
const nationIcon = (n: NationItem) => n.icons?.default ?? undefined

const resolveTypeKey = (tags?: string[], typeMap?: VehicleTypeMap) => {
  if (!tags || !typeMap) return undefined

  const keys = new Map(Object.keys(typeMap).map((k) => [k.toLowerCase(), k]))

  for (const t of tags) {
    const k = keys.get(String(t).toLowerCase())
    if (k) return k
  }

  return undefined
}

const vehicleTypeLabel = (type: VehicleTypeItem | undefined, fallback: string) =>
  type?.localization?.mark?.en ?? type?.name ?? fallback

const buildVehicles = (raw: VehiclesMap, typeMap: VehicleTypeMap) => {
  const list: VehicleDerived[] = Object.entries(raw).map(([vehicleId, vehicle]) => {
    const effectiveType = vehicle.type ?? resolveTypeKey(vehicle.tags, typeMap)
    const nationLower = String(vehicle.nation).toLowerCase()
    const nameLower = String(vehicle.name ?? '').toLowerCase()
    const displayNameLower = getDisplayName(vehicle).toLowerCase()

    return {
      ...vehicle,
      id: vehicleId,
      effectiveType,
      nationLower,
      nameLower,
      displayNameLower,
    }
  })

  const map: Record<string, VehicleDerived> = {}
  for (const item of list) {
    map[item.id] = item
  }

  return { list, map }
}

const normalizeNations = (data: NationsData): VehiclesSliceState['nations'] => {
  const list = toNationArray(data)
  const keys: string[] = []
  const nameMap: Record<string, string> = {}
  const iconMap: Record<string, string | undefined> = {}

  for (const nation of list) {
    const key = nationKey(nation)
    if (!nameMap[key]) {
      keys.push(key)
    }
    nameMap[key] = nationLabel(nation)
    iconMap[key] = nationIcon(nation)
  }

  return { keys, nameMap, iconMap }
}

const normalizeTypes = (data: VehicleTypeMap | undefined): VehiclesSliceState['types'] => {
  const map = data ?? {}
  const keys = Object.keys(map)
  const nameMap: Record<string, string> = {}

  for (const key of keys) {
    nameMap[key] = vehicleTypeLabel(map[key], key)
  }

  return { map, keys, nameMap }
}

const vehiclesSlice = createSlice({
  name: 'vehicle',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(wowsApi.endpoints.getMediaPath.matchFulfilled, (state, { payload }) => {
      const data = payload?.data ?? ''
      state.iconsBase = data
    })

    builder.addMatcher(wowsApi.endpoints.getNations.matchFulfilled, (state, { payload }) => {
      const data = payload?.data as unknown as NationsData
      state.nations = normalizeNations(data)
    })

    builder.addMatcher(wowsApi.endpoints.getVehicleTypes.matchFulfilled, (state, { payload }) => {
      const data = payload?.data as unknown as VehicleTypeMap | undefined
      state.types = normalizeTypes(data)
      const derived = buildVehicles(state.vehicles.raw, state.types.map)
      state.vehicles.list = derived.list
      state.vehicles.map = derived.map
    })

    builder.addMatcher(wowsApi.endpoints.getVehicles.matchFulfilled, (state, { payload }) => {
      const data = payload?.data as unknown as VehiclesMap | undefined
      state.vehicles.raw = data ?? {}
      const derived = buildVehicles(state.vehicles.raw, state.types.map)
      state.vehicles.list = derived.list
      state.vehicles.map = derived.map
    })
  },
})

export const vehicleReducer = vehiclesSlice.reducer

export const selectIconsBase = (root: RootState) => root.vehicle.iconsBase

export const selectNationKeys = (root: RootState) => root.vehicle.nations.keys
export const selectNationNameMap = (root: RootState) => root.vehicle.nations.nameMap
export const selectNationIconMap = (root: RootState) => root.vehicle.nations.iconMap

export const selectVehicleTypeKeys = (root: RootState) => root.vehicle.types.keys
export const selectVehicleTypeNameMap = (root: RootState) => root.vehicle.types.nameMap
export const selectVehicleTypeMap = (root: RootState) => root.vehicle.types.map

export const selectVehiclesArray = (root: RootState) => root.vehicle.vehicles.list
export const selectVehiclesMap = (root: RootState) => root.vehicle.vehicles.map
