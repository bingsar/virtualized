import { configureStore } from '@reduxjs/toolkit'
import { wowsApi } from '@/services/api/wowsApi'
import filters from '@/features/filters/model/filtersSlice'
import search from '@/features/search/model/searchSlice'

export const store = configureStore({
  reducer: {
    [wowsApi.reducerPath]: wowsApi.reducer,
    filters,
    search,
  },
  middleware: (g) => g().concat(wowsApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
