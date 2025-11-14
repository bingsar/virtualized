import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'
import { wowsApi } from '@/services/api/wowsApi'
import { getDisplayName } from '@/shared/lib/locale'
import { getVehicleDisplayData } from '@/shared/lib/vehicle'
import { getAbsoluteIconPath } from '@/shared/lib/url'

type LangMap = Record<string, string>
type Dict<T = unknown> = Record<string, T>

type NationItem = {
  name: string
  icons?: Record<string, string | undefined>
  localization?: { mark?: LangMap }
  id?: number
}
type NationsData = Dict<NationItem> | NationItem[] | undefined

type LocaleMap = Record<string, string>

type VehicleCore = {
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

type VehiclesMap = Dict<VehicleCore>

type VehicleTypeItem = {
  name?: string
  icons?: Record<string, string>
  localization?: { mark?: LangMap }
  [k: string]: unknown
}
type VehicleTypeMap = Dict<VehicleTypeItem>

type VehicleDerived = VehicleCore & {
  id: string
  effectiveType?: string
  nationLower: string
  nameLower: string
  displayNameLower: string
}

type FiltersState = RootState['filters']
type FilterKey = 'nation' | 'type' | 'level'

type VehicleTypeDisplay = {
  key: string
  label: string
  icon?: string
}

const selVehicles = wowsApi.endpoints.getVehicles.select()
const selNations = wowsApi.endpoints.getNations.select()
const selTypes = wowsApi.endpoints.getVehicleTypes.select()
const selMedia = wowsApi.endpoints.getMediaPath.select()
const selFilters = (s: RootState) => s.filters
const selSearch = (s: RootState) => s.search.q.toLowerCase()

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

const matchesFilters = (vehicle: VehicleDerived, filters: FiltersState, ignore?: FilterKey) => {
  const typeKey = String(vehicle.effectiveType ?? '')

  const nationMatch =
    ignore === 'nation' ||
    (filters.nation.length ? filters.nation.includes(vehicle.nationLower) : true)
  const typeMatch =
    ignore === 'type' || (filters.type.length ? filters.type.includes(typeKey) : true)
  const levelMatch =
    ignore === 'level' || (filters.level.length ? filters.level.includes(vehicle.level) : true)

  return nationMatch && typeMatch && levelMatch
}

export const selectIconsBase = createSelector(selMedia, (r) => r.data?.data ?? '')

export const selectTypeMap = createSelector(
  selTypes,
  (r) => (r.data?.data as VehicleTypeMap | undefined) ?? {},
)

export const selectVehicleTypeKeys = createSelector(selectTypeMap, (types) => Object.keys(types))

export const selectVehicleTypeNameMap = createSelector(selectTypeMap, (types) => {
  const nameMap: Record<string, string> = {}

  for (const key of Object.keys(types)) {
    nameMap[key] = vehicleTypeLabel(types[key], key)
  }

  return nameMap
})

export const selectNationsNormalized = createSelector(selNations, (r) => {
  const list = toNationArray(r.data?.data as NationsData)
  const nameMap: Record<string, string> = {}
  const iconMap: Record<string, string | undefined> = {}

  for (const n of list) {
    const k = nationKey(n)
    nameMap[k] = nationLabel(n)
    iconMap[k] = nationIcon(n)
  }

  const keys = Object.keys(nameMap)

  return { keys, nameMap, iconMap }
})

export const selectNationKeys = createSelector(selectNationsNormalized, (n) => n.keys)
export const selectNationNameMap = createSelector(selectNationsNormalized, (n) => n.nameMap)
export const selectNationIconMap = createSelector(selectNationsNormalized, (n) => n.iconMap)

export const selectVehiclesArray = createSelector(
  [selVehicles, selTypes],
  (vehiclesResponse, vehicleTypesResponse) => {
    const vehiclesMap = (vehiclesResponse.data?.data as VehiclesMap) ?? {}
    const vehicleTypesMap = (vehicleTypesResponse.data?.data as VehicleTypeMap | undefined) ?? {}

    return Object.entries(vehiclesMap).map<VehicleDerived>(([vehicleId, vehicle]) => {
      const effectiveType = vehicle.type ?? resolveTypeKey(vehicle.tags, vehicleTypesMap)
      const nationLower = String(vehicle.nation).toLowerCase()
      const nameLower = vehicle.name.toLowerCase()
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
  },
)

export const selectVehiclesMap = createSelector(selectVehiclesArray, (list) => {
  const map: Record<string, VehicleDerived> = {}
  for (const v of list) {
    map[v.id] = v
  }
  return map
})

export const makeSelectVehicleById = (id: string) =>
  createSelector(selectVehiclesMap, (map) => map[id] ?? null)

export const makeSelectVehicleDisplayById = (id: string) =>
  createSelector(
    selectVehiclesMap,
    selectIconsBase,
    selectNationNameMap,
    selectNationIconMap,
    (vehicles, iconsBase, nationNameMap, nationIconMap) => {
      const vehicle = vehicles[id]
      if (!vehicle) return null

      return getVehicleDisplayData(vehicle, {
        iconsBase,
        nationNameMap,
        nationIconMap,
      })
    },
  )

export const makeSelectVehicleTypeDisplayById = (id: string) =>
  createSelector(
    selectVehiclesMap,
    selectTypeMap,
    selectIconsBase,
    (vehicles, types, iconsBase) => {
      const v = vehicles[id]
      if (!v) return null

      const key = v.effectiveType
      if (!key) return null

      const t = types[key]
      const label = vehicleTypeLabel(t, key)
      const iconRel = t?.icons?.small ?? t?.icons?.default
      const icon = getAbsoluteIconPath(iconsBase, iconRel)

      return { key, label, icon } as VehicleTypeDisplay
    },
  )

const selectFilteredVehiclesAndAvailability = createSelector(
  selectVehiclesArray,
  selFilters,
  selSearch,
  (list, f, q) => {
    const qLower = q

    const filtered: VehicleDerived[] = []
    const nationSet = new Set(f.nation)
    const typeSet = new Set(f.type)
    const levelSet = new Set(f.level)

    for (const v of list) {
      const passesSearch = qLower
        ? v.displayNameLower.includes(qLower) ||
          v.id.toLowerCase().includes(qLower) ||
          v.nameLower.includes(qLower)
        : true

      if (passesSearch && matchesFilters(v, f)) {
        filtered.push(v)
      }

      if (matchesFilters(v, f, 'nation')) nationSet.add(v.nationLower)
      if (matchesFilters(v, f, 'type')) {
        const key = String(v.effectiveType ?? '')
        if (key) typeSet.add(key)
      }
      if (matchesFilters(v, f, 'level')) levelSet.add(v.level)
    }

    return {
      filtered,
      availability: {
        nation: Array.from(nationSet),
        type: Array.from(typeSet),
        level: Array.from(levelSet).sort((a, b) => a - b),
      },
    }
  },
)

export const selectFilteredVehicles = createSelector(
  selectFilteredVehiclesAndAvailability,
  (result) => result.filtered,
)

export const selectFilterAvailability = createSelector(
  selectFilteredVehiclesAndAvailability,
  (result) => result.availability,
)
