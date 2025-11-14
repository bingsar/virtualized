import { describe, expect, it } from 'vitest'
import { vehicleReducer } from './vehicleSlice'
import { wowsApi } from '@/services/api/wowsApi'

const createActionType = (status: 'fulfilled' | 'rejected') =>
  `${wowsApi.reducerPath}/executeQuery/${status}`

const baseState = vehicleReducer(undefined, { type: 'init' })

describe('vehicle slice - load vehicles', () => {
  it('handles successful vehicle load', () => {
    const action = {
      type: createActionType('fulfilled'),
      payload: {
        data: {
          id: {
            level: 5,
            name: 'Petrozavodsk',
            nation: 'ussr',
            icons: { medium: 'medium.png' },
            localization: { shortmark: { en: 'Petrozavodsk' } },
            type: 'Destroyer',
          },
        },
      },
      meta: { arg: { endpointName: 'getVehicles' } },
    }

    const state = vehicleReducer(baseState, action as never)
    expect(state.vehicles.list).toHaveLength(1)
    expect(state.vehicles.map.id).toMatchObject({ id: 'id', effectiveType: 'Destroyer' })
  })

  it('ignores rejected vehicle load actions', () => {
    const fulfilledAction = {
      type: createActionType('fulfilled'),
      payload: { data: {} },
      meta: { arg: { endpointName: 'getVehicles' } },
    }
    const stateWithData = vehicleReducer(baseState, fulfilledAction as never)

    const rejectedAction = {
      type: createActionType('rejected'),
      error: { message: 'Network error' },
      meta: { arg: { endpointName: 'getVehicles' } },
    }

    const nextState = vehicleReducer(stateWithData, rejectedAction as never)
    expect(nextState).toEqual(stateWithData)
  })
})
