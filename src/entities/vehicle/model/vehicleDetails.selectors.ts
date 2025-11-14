import { createSelector, weakMapMemoize } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'
import type { VehicleDerived } from './vehicleSlice'
import {
  selectIconsBase,
  selectNationIconMap,
  selectNationNameMap,
  selectVehicleTypeMap,
  selectVehiclesMap,
} from './vehicleSlice'
import { getVehicleDisplayData, type VehicleDisplayData } from '@/shared/lib/vehicle'
import { getAbsoluteIconPath } from '@/shared/lib/url'

type VehicleTypeEntity = ReturnType<typeof selectVehicleTypeMap>[string]

export type VehicleTypeDisplay = {
  key: string
  label: string
  icon?: string
}

const getVehicleTypeLabel = (type: VehicleTypeEntity | undefined, fallback: string) =>
  type?.localization?.mark?.en ?? type?.name ?? fallback

const selectVehicleId = (_: RootState, id: string) => id

export const selectVehicleById = createSelector(
  selectVehiclesMap,
  selectVehicleId,
  (vehiclesMap, id): VehicleDerived | null => vehiclesMap[id] ?? null,
  { memoize: weakMapMemoize },
)

export const selectVehicleDisplayById = createSelector(
  selectVehicleById,
  selectIconsBase,
  selectNationNameMap,
  selectNationIconMap,
  (vehicle, iconsBase, nationNameMap, nationIconMap): VehicleDisplayData | null => {
    if (!vehicle) return null

    return getVehicleDisplayData(vehicle, {
      iconsBase,
      nationNameMap,
      nationIconMap,
    })
  },
  { memoize: weakMapMemoize },
)

export const selectVehicleTypeDisplayById = createSelector(
  selectVehicleById,
  selectVehicleTypeMap,
  selectIconsBase,
  (vehicle, vehicleTypeMap, iconsBase): VehicleTypeDisplay | null => {
    if (!vehicle) return null

    const key = vehicle.effectiveType
    if (!key) return null

    const type = vehicleTypeMap[key]
    const label = getVehicleTypeLabel(type, key)
    const iconRel = type?.icons?.small ?? type?.icons?.default
    const icon = getAbsoluteIconPath(iconsBase, iconRel)

    return { key, label, icon }
  },
  { memoize: weakMapMemoize },
)
