import { describe, expect, it, beforeEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CatalogPage from './CatalogPage'
import { renderWithProviders } from '@/tests/testUtils'
import { createDerivedVehicle, createVehicleSliceState } from '@/tests/fixtures/vehicles'

vi.mock('@/shared/lib/useWidth', () => ({
  useWidth: () => 1600,
}))

const queryMocks = vi.hoisted(() => {
  let loading = true
  const createQueryState = () => ({
    isUninitialized: false,
    isLoading: loading,
    isError: false,
    refetch: vi.fn(),
  })
  return {
    get loading() {
      return loading
    },
    set loading(value: boolean) {
      loading = value
    },
    nationsQueryMock: vi.fn(() => ({ ...createQueryState(), data: {} })),
    typesQueryMock: vi.fn(() => ({ ...createQueryState(), data: {} })),
    mediaQueryMock: vi.fn(() => ({ ...createQueryState(), data: { data: 'cdn' } })),
    vehiclesQueryMock: vi.fn(() => ({ ...createQueryState(), data: {} })),
  }
})

vi.mock('@/services/api/wowsApi', async (importOriginal) => {
  const actual = await importOriginal<any>()
  return {
    ...actual,
    useGetNationsQuery: queryMocks.nationsQueryMock,
    useGetVehicleTypesQuery: queryMocks.typesQueryMock,
    useGetMediaPathQuery: queryMocks.mediaQueryMock,
    useGetVehiclesQuery: queryMocks.vehiclesQueryMock,
  }
})

const vehicles = [
  createDerivedVehicle({
    id: '889232323',
    level: 4,
    name: 'Petrozavodsk',
    nation: 'ussr',
    effectiveType: 'Destroyer',
  }),
  createDerivedVehicle({
    id: '889232324',
    level: 7,
    name: 'Tokio',
    nation: 'japan',
    effectiveType: 'Cruiser',
  }),
]

const preloadedState = {
  vehicle: {
    ...createVehicleSliceState(vehicles),
    iconsBase: 'https://cdn.test/some',
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

describe('CatalogPage integration', () => {
  beforeEach(() => {
    queryMocks.loading = true
    queryMocks.nationsQueryMock.mockClear()
    queryMocks.typesQueryMock.mockClear()
    queryMocks.mediaQueryMock.mockClear()
    queryMocks.vehiclesQueryMock.mockClear()
  })

  it('shows loader, renders vehicles and filters via search', async () => {
    const user = userEvent.setup()
    const { container, rerender } = renderWithProviders(<CatalogPage />, {
      preloadedState,
    })

    expect(container.querySelector('.loader')).not.toBeNull()

    queryMocks.loading = false
    rerender(<CatalogPage />)

    await waitFor(() => {
      expect(container.querySelector('.loader')).toBeNull()
    })
    expect(await screen.findAllByRole('heading', { level: 3 })).toHaveLength(2)

    await user.click(screen.getByRole('button', { name: /All types/i }))
    await user.click(await screen.findByRole('button', { name: 'Cruiser' }))

    await waitFor(() => {
      expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(1)
    })

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Tokio')
  })
})
