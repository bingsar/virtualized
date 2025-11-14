import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_BASE } from '@/shared/config/env'
import type {
  NationsResponse,
  VehicleTypesResponse,
  VehiclesResponse,
  MediaPathResponse,
} from '@/shared/types/api'

export const wowsApi = createApi({
  reducerPath: 'wowsApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE }),
  endpoints: (b) => ({
    getNations: b.query<NationsResponse, void>({ query: () => 'nations/' }),
    getVehicleTypes: b.query<VehicleTypesResponse, void>({ query: () => 'vehicle_types_common/' }),
    getMediaPath: b.query<MediaPathResponse, void>({ query: () => 'media_path/' }),
    getVehicles: b.query<VehiclesResponse, void>({ query: () => 'vehicles/' }),
  }),
})

export const {
  useGetNationsQuery,
  useGetVehicleTypesQuery,
  useGetMediaPathQuery,
  useGetVehiclesQuery,
} = wowsApi
