import { configureStore, type EnhancedStore } from '@reduxjs/toolkit'
import type { ReactElement, ReactNode } from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { render, type RenderOptions } from '@testing-library/react'
import type { RootState } from '@/app/store'
import filters from '@/features/filters/model/filtersSlice'
import search from '@/features/search/model/searchSlice'
import { vehicleReducer } from '@/entities/vehicle/model/vehicleSlice'
import { wowsApi } from '@/services/api/wowsApi'

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

export type TestStore = EnhancedStore<RootState>

export function setupTestStore(preloadedState?: DeepPartial<RootState>) {
  return configureStore({
    reducer: {
      [wowsApi.reducerPath]: wowsApi.reducer,
      filters,
      search,
      vehicle: vehicleReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(wowsApi.middleware),
    preloadedState: preloadedState as RootState,
  })
}

type ExtendedRenderOptions = {
  preloadedState?: DeepPartial<RootState>
  store?: TestStore
  route?: string
} & Omit<RenderOptions, 'queries'>

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState,
    store = setupTestStore(preloadedState),
    route = '/',
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </Provider>
    )
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}
