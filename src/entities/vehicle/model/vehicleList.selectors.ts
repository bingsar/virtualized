import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'
import type { VehicleDerived } from './vehicleSlice'
import { selectVehiclesArray } from './vehicleSlice'

type FilterKey = 'nation' | 'type' | 'level'

const matchesFilters = (
  vehicle: VehicleDerived,
  filters: RootState['filters'],
  ignore?: FilterKey,
) => {
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

const selectFilters = (root: RootState) => root.filters
const selectSearch = (root: RootState) => root.search.q.toLowerCase()

const selectFilteredVehiclesAndAvailability = createSelector(
  selectVehiclesArray,
  selectFilters,
  selectSearch,
  (list, filters, q) => {
    const filtered: VehicleDerived[] = []
    const nationSet = new Set(filters.nation)
    const typeSet = new Set(filters.type)
    const levelSet = new Set(filters.level)

    for (const vehicle of list) {
      const passesSearch = q
        ? vehicle.displayNameLower.includes(q) ||
          vehicle.id.toLowerCase().includes(q) ||
          vehicle.nameLower.includes(q)
        : true

      if (passesSearch && matchesFilters(vehicle, filters)) {
        filtered.push(vehicle)
      }

      if (matchesFilters(vehicle, filters, 'nation')) nationSet.add(vehicle.nationLower)
      if (matchesFilters(vehicle, filters, 'type')) {
        const key = String(vehicle.effectiveType ?? '')
        if (key) typeSet.add(key)
      }
      if (matchesFilters(vehicle, filters, 'level')) levelSet.add(vehicle.level)
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
