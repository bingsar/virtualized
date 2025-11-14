import './styles.scss'
import { useEffect, useState } from 'react'
import FilterOptionButton from '@/features/filters/ui/FilterOptionButton'
import { Close } from '@/assets/icons.tsx'

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

type Props = {
  nationTitle: string
  typeTitle: string
  levelTitle: string
  nationOptions: NationOption[]
  typeOptions: TypeOption[]
  levelOptions: LevelOption[]
  onSelectNation: (value?: string) => void
  onSelectType: (value?: string) => void
  onSelectLevel: (value?: number) => void
}

export default function FiltersPanelMobile({
  nationTitle,
  typeTitle,
  levelTitle,
  nationOptions,
  typeOptions,
  levelOptions,
  onSelectNation,
  onSelectType,
  onSelectLevel,
}: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (typeof document === 'undefined') return

    const body = document.body
    const html = document.documentElement

    if (open) {
      body.classList.add('filters-scroll-lock')
      html.classList.add('filters-scroll-lock')
    } else {
      body.classList.remove('filters-scroll-lock')
      html.classList.remove('filters-scroll-lock')
    }

    return () => {
      body.classList.remove('filters-scroll-lock')
      html.classList.remove('filters-scroll-lock')
    }
  }, [open])

  return (
    <>
      <div className="filters filters--mobile-trigger" onClick={() => setOpen(true)}>
        <div className="filters_trigger-label">Filters</div>
        <div className="filters_trigger-summary">
          <span className="filters_trigger-summary_item">{nationTitle}</span>
          <span className="filters_trigger-summary_item">{typeTitle}</span>
          <span className="filters_trigger-summary_item">{levelTitle}</span>
        </div>
      </div>

      {open && (
        <div className="filters_mobile-overlay" onClick={() => setOpen(false)}>
          <div className="filters_mobile-panel" onClick={(e) => e.stopPropagation()}>
            <header className="filters_mobile-header">
              <span className="filters_mobile-title">Filters</span>
              <button type="button" className="filters_mobile-close" onClick={() => setOpen(false)}>
                <Close color="#FFF" />
              </button>
            </header>

            <div className="filters_mobile-body">
              <section className="filters_mobile-section">
                <h3 className="filters_mobile-section-title">Nation</h3>
                <div className="filters_list filters_list--mobile">
                  {nationOptions.map((i) => (
                    <FilterOptionButton
                      key={i.key}
                      active={i.active}
                      onClick={() => onSelectNation(i.value)}
                      icon={i.icon}
                      size="lg"
                    >
                      {i.label}
                    </FilterOptionButton>
                  ))}
                </div>
              </section>

              <section className="filters_mobile-section">
                <h3 className="filters_mobile-section-title">Type</h3>
                <div className="filters_list filters_list--mobile">
                  {typeOptions.map((i) => (
                    <FilterOptionButton
                      key={i.key}
                      active={i.active}
                      onClick={() => onSelectType(i.value)}
                      size="lg"
                    >
                      {i.label}
                    </FilterOptionButton>
                  ))}
                </div>
              </section>

              <section className="filters_mobile-section">
                <h3 className="filters_mobile-section-title">Tier</h3>
                <div className="filters_list filters_list--mobile">
                  {levelOptions.map((i) => (
                    <FilterOptionButton
                      key={i.key}
                      active={i.active}
                      onClick={() => onSelectLevel(i.value)}
                      size="lg"
                    >
                      {i.label}
                    </FilterOptionButton>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
