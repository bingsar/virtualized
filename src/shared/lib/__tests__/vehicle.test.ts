import { describe, expect, it } from 'vitest'
import { getVehicleDisplayData } from '../vehicle'
import { getDescription } from '@/shared/lib/locale'

describe('vehicle utils', () => {
  it('builds display data with localized labels and icons', () => {
    const data = getVehicleDisplayData(
      {
        name: 'Statenland',
        nation: 'Netherlands',
        icons: { medium: 'ships/statenland.png' },
        localization: { shortmark: { en: 'Statenland' } },
      },
      {
        iconsBase: 'https://cdn.test/',
        nationNameMap: { netherlands: 'The Netherlands' },
        nationIconMap: { netherlands: 'flags/nl.png' },
      },
    )

    expect(data).toEqual({
      title: 'Statenland',
      nationKey: 'netherlands',
      nationLabel: 'The Netherlands',
      nationIcon: 'https://cdn.test/flags/nl.png',
      image: 'https://cdn.test/ships/statenland.png',
    })
  })

  it('falls back to base data when icons or localization are missing', () => {
    const data = getVehicleDisplayData(
      {
        name: 'Unnamed',
        nation: 'Ussr',
        icons: {},
      },
      {
        iconsBase: 'https://cdn.test/',
        extraIconCandidates: ['fallbacks/default.png'],
      },
    )

    expect(data.title).toBe('Unnamed')
    expect(data.nationLabel).toBe('Ussr')
    expect(data.nationIcon).toBeUndefined()
    expect(data.image).toBe('https://cdn.test/fallbacks/default.png')
  })

  it('returns localized description when available', () => {
    const description = getDescription({
      localization: {
        description: {
          en: 'English description',
          fr: 'Description française',
        },
      },
    })

    expect(description).toBe('English description')
  })
})
