import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import VehicleCard from '.'
import { renderWithProviders } from '@/tests/testUtils'
import { createDerivedVehicle, createVehicleSliceState } from '@/tests/fixtures/vehicles'

describe('VehicleCard', () => {
  it('renders vehicle basics and type icon', () => {
    const vehicle = createDerivedVehicle({
      id: '819283723',
      level: 7,
      name: 'Petrozavodsk',
      nation: 'Netherlands',
      effectiveType: 'Cruiser',
      icons: { medium: 'vehicles/petrozavodsk.png' },
      localization: { shortmark: { en: 'Petrozavodsk' } },
    })

    const preloadedState = {
      vehicle: {
        ...createVehicleSliceState([vehicle]),
        iconsBase: 'https://cdn.test',
        nations: {
          keys: ['netherlands'],
          nameMap: { netherlands: 'The Netherlands' },
          iconMap: { netherlands: 'flags/nl.png' },
        },
        types: {
          map: { Cruiser: { name: 'Cruiser', icons: { small: 'types/cruiser.png' } } },
          keys: ['Cruiser'],
          nameMap: { Cruiser: 'Cruiser' },
        },
      },
      filters: { nation: [], type: [], level: [] },
      search: { q: '' },
    }

    renderWithProviders(<VehicleCard vehicle={vehicle} eager />, {
      preloadedState,
    })

    expect(screen.getByRole('heading', { level: 3, name: 'Petrozavodsk' })).toBeInTheDocument()
    expect(screen.getByText('VII')).toBeInTheDocument()
    expect(screen.getByAltText('The Netherlands')).toBeInTheDocument()
    expect(screen.getByAltText('Cruiser')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', '/vehicle/819283723')
  })
})
