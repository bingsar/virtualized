import { describe, expect, it } from 'vitest'
import reducer, { setLevel, setNation, setType } from './filtersSlice'

describe('filters slice', () => {
  it('returns the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      nation: [],
      type: [],
      level: [],
    })
  })

  it('handles setNation', () => {
    const result = reducer(undefined, setNation(['ussr']))
    expect(result.nation).toEqual(['ussr'])
  })

  it('handles setType and setLevel', () => {
    const withType = reducer(undefined, setType(['Cruiser']))
    expect(withType.type).toEqual(['Cruiser'])

    const withLevel = reducer(withType, setLevel([7]))
    expect(withLevel.level).toEqual([7])
  })
})
