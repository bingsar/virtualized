export type NationsResponse = {
  status?: string
  data: Record<string, { name: string }>
}

export type VehicleTypesResponse = {
  status?: string
  data: Record<
    string,
    {
      name: string
      icons?: Record<string, string>
    }
  >
}

export type MediaPathResponse = { status?: string; data: string }

export type Vehicle = {
  level: number
  name: string
  nation: string
  type?: string
  icons?: { small?: string; medium?: string; large?: string; default?: string }
  localization?: { shortmark?: Record<string, string>; description?: Record<string, string> }
  id?: string
}
export type VehiclesResponse = { status?: string; data: Record<string, Vehicle> }
