import './styles.scss'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useAppSelector } from '@/app/hooks'
import { selectFilteredVehicles } from '@/entities/vehicle/model/selectors'
import VehicleCard from '@/pages/catalog/ui/VehicleCard'

export default function VehicleList() {
  const items = useAppSelector(selectFilteredVehicles)
  const listRef = useRef<HTMLDivElement | null>(null)
  const [visibleIndexes, setVisibleIndexes] = useState<number[]>([])

  const itemsKey = useMemo(() => items.map((item) => item.id).join('|'), [items])

  useEffect(() => {
    const root = listRef.current
    if (!root) return

    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleIndexes((prev) => {
          const next = new Set(prev)
          for (const entry of entries) {
            const indexAttr = entry.target.getAttribute('data-index')
            if (!indexAttr) continue
            const index = Number(indexAttr)
            if (Number.isNaN(index)) continue

            if (entry.isIntersecting) {
              next.add(index)
            } else {
              next.delete(index)
            }
          }
          return Array.from(next).sort((a, b) => a - b)
        })
      },
      {
        root,
        rootMargin: '200px 0px',
        threshold: 0.01,
      },
    )

    const elements = root.querySelectorAll<HTMLDivElement>('.vehicle-list_item')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [items.length, itemsKey])

  if (!items.length) {
    return (
      <div className="vehicle-list_empty">
        <p className="vehicle-list_empty-text">No ships match the current filters</p>
      </div>
    )
  }

  return (
    <div className="vehicle-list" ref={listRef}>
      <div className="vehicle-list_grid">
        {items.map((vehicle, index) => {
          const isVisible = visibleIndexes.includes(index)
          const eager = index < 4

          return (
            <div key={vehicle.id} data-index={index} className="vehicle-list_item">
              {isVisible && <VehicleCard vehicle={vehicle} eager={eager} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
