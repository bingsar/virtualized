import { getDisplayName } from '@/shared/lib/locale'
import { getAbsoluteIconPath } from '@/shared/lib/url'

type LocaleMap = Record<string, string>

type VehicleLike = {
  name: string
  nation: string
  icons?: Record<string, string | undefined>
  localization?: {
    shortmark?: LocaleMap
  }
}

type IconKey = keyof NonNullable<VehicleLike['icons']>

type VehicleDisplayOptions = {
  iconsBase?: string
  nationNameMap?: Record<string, string>
  nationIconMap?: Record<string, string | undefined>
  extraIconCandidates?: Array<string | undefined>
  iconPriority?: IconKey[]
}

export type VehicleDisplayData = {
  title: string
  nationKey: string
  nationLabel: string
  nationIcon?: string
  image?: string
}

export function getVehicleDisplayData<T extends VehicleLike>(
  vehicle: T,
  options: VehicleDisplayOptions = {},
): VehicleDisplayData {
  const nationKey = vehicle.nation.toLowerCase()
  const title = getDisplayName(vehicle)
  const nationLabel = options.nationNameMap?.[nationKey] ?? vehicle.nation
  const nationRel = options.nationIconMap?.[nationKey]
  const nationIcon = getAbsoluteIconPath(options.iconsBase, nationRel)

  const priority = options.iconPriority ?? ['medium', 'large', 'small', 'default']
  const iconCandidates = [
    ...priority.map((key) => vehicle.icons?.[key]),
    ...(options.extraIconCandidates ?? []),
  ]
  const imageRel = iconCandidates.find((rel) => Boolean(rel))
  const image = getAbsoluteIconPath(options.iconsBase, imageRel)

  return { title, nationKey, nationLabel, nationIcon, image }
}
