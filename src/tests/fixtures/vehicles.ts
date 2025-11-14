import type { VehicleDerived } from '@/entities/vehicle/model/vehicleSlice'
import { vehicleReducer } from '@/entities/vehicle/model/vehicleSlice'

export type DerivedVehicleInput = Partial<VehicleDerived> & {
  id: string
  name: string
  nation: string
  level: number
}

export const createDerivedVehicle = ({
  id,
  name,
  nation,
  level,
  ...rest
}: DerivedVehicleInput): VehicleDerived => ({
  id,
  name,
  nation,
  level,
  type: rest.type,
  icons: rest.icons ?? {},
  localization: rest.localization ?? { shortmark: { en: name } },
  tags: rest.tags ?? [],
  effectiveType: rest.effectiveType ?? rest.type,
  nationLower: rest.nationLower ?? nation.toLowerCase(),
  nameLower: rest.nameLower ?? name.toLowerCase(),
  displayNameLower: rest.displayNameLower ?? name.toLowerCase(),
})

export const createVehicleSliceState = (vehicles: VehicleDerived[]) => {
  const baseState = vehicleReducer(undefined, { type: 'init' } as never)
  return {
    ...baseState,
    vehicles: {
      raw: {},
      list: vehicles,
      map: vehicles.reduce<Record<string, VehicleDerived>>((acc, vehicle) => {
        acc[vehicle.id] = vehicle
        return acc
      }, {}),
    },
  }
}
