import './styles.scss'
import { useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setNation, setType, setLevel } from '@/features/filters/model/filtersSlice'
import {
  selectNationKeys,
  selectNationNameMap,
  selectNationIconMap,
  selectVehicleTypeKeys,
  selectVehicleTypeNameMap,
  selectIconsBase,
  selectFilterAvailability,
} from '@/entities/vehicle/model/selectors'
import { getAbsoluteIconPath } from '@/shared/lib/url'
import { Dropdown } from '@/shared/ui/Dropdown'
import { toRoman } from '@/shared/lib/roman.ts'
import FilterOptionButton from '@/features/filters/ui/FilterOptionButton'
import FiltersPanelMobile from '@/features/filters/ui/FiltersPanelMobile'
import { useWidth } from '@/shared/lib/useWidth'

type NationOption = {
  key: string
  label: string
  icon?: string
  active: boolean
  value?: string
}

type TypeOption = {
  key: string
  label: string
  active: boolean
  value?: string
}

type LevelOption = {
  key: string
  label: string
  active: boolean
  value?: number
}

const LEVELS = Array.from({ length: 10 }, (_, i) => i + 1)

export default function FiltersPanel() {
  const dispatch = useAppDispatch()
  const f = useAppSelector((s) => s.filters)
  const nationKeys = useAppSelector(selectNationKeys)
  const nationNameMap = useAppSelector(selectNationNameMap)
  const nationIconMap = useAppSelector(selectNationIconMap)
  const iconsBase = useAppSelector(selectIconsBase)
  const typeKeys = useAppSelector(selectVehicleTypeKeys)
  const typeNameMap = useAppSelector(selectVehicleTypeNameMap)
  const availability = useAppSelector(selectFilterAvailability)

  const width = useWidth()
  const isMobile = width > 0 && width < 1200

  const availableNationSet = useMemo(() => new Set(availability.nation), [availability.nation])
  const availableTypeSet = useMemo(() => new Set(availability.type), [availability.type])
  const availableLevelSet = useMemo(() => new Set(availability.level), [availability.level])

  useEffect(() => {
    const nextNation = f.nation.filter((value) => availableNationSet.has(value))
    const nextType = f.type.filter((value) => availableTypeSet.has(value))
    const nextLevel = f.level.filter((value) => availableLevelSet.has(value))

    if (nextNation.length !== f.nation.length) dispatch(setNation(nextNation))
    if (nextType.length !== f.type.length) dispatch(setType(nextType))
    if (nextLevel.length !== f.level.length) dispatch(setLevel(nextLevel))
  }, [availableLevelSet, availableNationSet, availableTypeSet, dispatch, f.level, f.nation, f.type])

  const nationOptions: NationOption[] = useMemo(() => {
    const options = nationKeys
      .filter((n) => availableNationSet.has(n))
      .map((n) => ({
        key: n,
        label: nationNameMap[n] ?? n,
        icon: getAbsoluteIconPath(iconsBase, nationIconMap[n]),
        active: f.nation.includes(n),
        value: n,
      }))
    return [
      {
        key: '__all_nations',
        label: 'All nations',
        icon: undefined,
        active: f.nation.length === 0,
        value: undefined,
      },
      ...options,
    ]
  }, [availableNationSet, f.nation, iconsBase, nationIconMap, nationKeys, nationNameMap])

  const typeOptions: TypeOption[] = useMemo(
    () => [
      {
        key: '__all_types',
        label: 'All types',
        active: f.type.length === 0,
        value: undefined,
      },
      ...typeKeys
        .filter((t) => availableTypeSet.has(t))
        .map((t) => ({
          key: t,
          label: typeNameMap[t] ?? t,
          active: f.type.includes(t),
          value: t,
        })),
    ],
    [availableTypeSet, f.type, typeKeys, typeNameMap],
  )

  const levelOptions: LevelOption[] = useMemo(
    () => [
      {
        key: '__all_levels',
        label: 'All tiers',
        active: f.level.length === 0,
        value: undefined,
      },
      ...LEVELS.filter((level) => availableLevelSet.has(level)).map((level) => ({
        key: String(level),
        label: `Tier ${toRoman(level)}`,
        active: f.level.includes(level),
        value: level,
      })),
    ],
    [availableLevelSet, f.level],
  )

  const handleNationSelect = (value?: string) => {
    dispatch(setNation(value ? [value] : []))
  }

  const handleTypeSelect = (value?: string) => {
    dispatch(setType(value ? [value] : []))
  }

  const handleLevelSelect = (value?: number) => {
    dispatch(setLevel(typeof value === 'number' ? [value] : []))
  }

  const nationTitle =
    f.nation.length && nationOptions.length
      ? (nationOptions.find((option) => option.value === f.nation[0])?.label ?? 'All nations')
      : 'All nations'
  const typeTitle =
    f.type.length && typeOptions.length
      ? (typeOptions.find((option) => option.value === f.type[0])?.label ?? 'All types')
      : 'All types'
  const levelTitle =
    f.level.length && levelOptions.length
      ? (levelOptions.find((option) => option.value === f.level[0])?.label ?? 'All tiers')
      : 'All tiers'

  if (isMobile) {
    return (
      <FiltersPanelMobile
        nationTitle={nationTitle}
        typeTitle={typeTitle}
        levelTitle={levelTitle}
        nationOptions={nationOptions}
        typeOptions={typeOptions}
        levelOptions={levelOptions}
        onSelectNation={handleNationSelect}
        onSelectType={handleTypeSelect}
        onSelectLevel={handleLevelSelect}
      />
    )
  }

  return (
    <div className="filters">
      <Dropdown title={nationTitle}>
        {(close) => (
          <div className="filters_list">
            {nationOptions.map((i) => (
              <FilterOptionButton
                key={i.key}
                active={i.active}
                onClick={() => {
                  handleNationSelect(i.value)
                  close()
                }}
                icon={i.icon}
              >
                {i.label}
              </FilterOptionButton>
            ))}
          </div>
        )}
      </Dropdown>

      <Dropdown title={typeTitle}>
        {(close) => (
          <div className="filters_list">
            {typeOptions.map((i) => (
              <FilterOptionButton
                key={i.key}
                active={i.active}
                onClick={() => {
                  handleTypeSelect(i.value)
                  close()
                }}
              >
                {i.label}
              </FilterOptionButton>
            ))}
          </div>
        )}
      </Dropdown>

      <Dropdown title={levelTitle}>
        {(close) => (
          <div className="filters_list">
            {levelOptions.map((i) => (
              <FilterOptionButton
                key={i.key}
                active={i.active}
                onClick={() => {
                  handleLevelSelect(i.value)
                  close()
                }}
              >
                {i.label}
              </FilterOptionButton>
            ))}
          </div>
        )}
      </Dropdown>
    </div>
  )
}
