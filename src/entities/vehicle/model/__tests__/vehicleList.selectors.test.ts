import { describe, expect, it } from 'vitest'
import { selectFilteredVehicles } from '../vehicleList.selectors'
import type { VehicleDerived } from '../vehicleSlice'
import type { RootState } from '@/app/store'
import { createDerivedVehicle } from '@/tests/fixtures/vehicles'

const buildState = (vehicles: VehicleDerived[], filters: RootState['filters'], q = '') =>
  ({
    vehicle: {
      iconsBase: '',
      nations: { keys: [], nameMap: {}, iconMap: {} },
      types: { map: {}, keys: [], nameMap: {} },
      vehicles: {
        raw: {},
        list: vehicles,
        map: vehicles.reduce<Record<string, VehicleDerived>>((acc, vehicle) => {
          acc[vehicle.id] = vehicle
          return acc
        }, {}),
      },
    },
    filters,
    search: { q },
    wowsApi: {} as never,
  }) as RootState

describe('selectFilteredVehicles', () => {
  const destroyer = createDerivedVehicle({
    id: '898129123',
    name: 'Petrozavodsk',
    nation: 'Ussr',
    level: 6,
    effectiveType: 'Destroyer',
  })
  const cruiser = createDerivedVehicle({
    id: '898129124',
    name: 'Tokyo',
    nation: 'Japan',
    level: 8,
    effectiveType: 'Cruiser',
  })

  it('returns all vehicles when no filters applied', () => {
    const state = buildState([destroyer, cruiser], { nation: [], type: [], level: [] }, '')
    const result = selectFilteredVehicles(state)
    expect(result).toHaveLength(2)
  })

  it('filters vehicles by nation, type and level', () => {
    const state = buildState([destroyer, cruiser], {
      nation: ['japan'],
      type: ['Cruiser'],
      level: [8],
    })
    const result = selectFilteredVehicles(state)
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('898129124')
  })

  it('filters vehicles by search query across multiple fields', () => {
    const state = buildState([destroyer, cruiser], { nation: [], type: [], level: [] }, '898129123')
    const result = selectFilteredVehicles(state)
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('898129123')
  })
})
