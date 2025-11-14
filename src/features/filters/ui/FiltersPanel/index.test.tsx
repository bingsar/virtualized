import { describe, expect, it, beforeEach, vi, type Mock } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FiltersPanel from '.'
import { renderWithProviders } from '@/tests/testUtils'
import { createDerivedVehicle, createVehicleSliceState } from '@/tests/fixtures/vehicles'
import { useWidth } from '@/shared/lib/useWidth'

vi.mock('@/shared/lib/useWidth', () => ({
  useWidth: vi.fn(() => 1400),
}))

const mockedUseWidth = useWidth as unknown as Mock

const vehicles = [
  createDerivedVehicle({
    id: '819283723',
    level: 6,
    name: 'Petrozavodsk',
    nation: 'ussr',
    effectiveType: 'Destroyer',
  }),
  createDerivedVehicle({
    id: '819283724',
    level: 7,
    name: 'Tokio',
    nation: 'japan',
    effectiveType: 'Cruiser',
  }),
]

const preloadedState = {
  vehicle: {
    ...createVehicleSliceState(vehicles),
    iconsBase: 'https://cdn.test',
    nations: {
      keys: ['ussr', 'japan'],
      nameMap: { ussr: 'Ussr', japan: 'Japan' },
      iconMap: { ussr: 'flags/ussr.png', japan: 'flags/japan.png' },
    },
    types: {
      map: {
        Destroyer: { name: 'Destroyer', icons: { small: 'types/destroyer.png' } },
        Cruiser: { name: 'Cruiser', icons: { small: 'types/cruiser.png' } },
      },
      keys: ['Destroyer', 'Cruiser'],
      nameMap: { Destroyer: 'Destroyer', Cruiser: 'Cruiser' },
    },
  },
  filters: { nation: [], type: [], level: [] },
  search: { q: '' },
}

describe('FiltersPanel', () => {
  beforeEach(() => {
    mockedUseWidth.mockReturnValue(1400)
  })

  it('renders desktop filters and allows selecting a nation', async () => {
    const user = userEvent.setup()
    const { store } = renderWithProviders(<FiltersPanel />, { preloadedState })

    await user.click(screen.getByRole('button', { name: /All nations/i }))
    await user.click(await screen.findByRole('button', { name: /Japan/i }))

    expect(store.getState().filters.nation).toEqual(['japan'])
  })

  it('renders mobile panel when width is small', async () => {
    mockedUseWidth.mockReturnValue(800)
    const user = userEvent.setup()
    const { store } = renderWithProviders(<FiltersPanel />, { preloadedState })

    await user.click(screen.getByText('Filters'))
    await user.click(await screen.findByRole('button', { name: 'Cruiser' }))

    expect(store.getState().filters.type).toEqual(['Cruiser'])
  })
})
