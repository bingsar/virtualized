import './styles.scss'
import { useAppSelector } from '@/app/hooks'
import {
  selectVehicleDisplayById,
  selectVehicleTypeDisplayById,
} from '@/entities/vehicle/model/vehicleDetails.selectors'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/shared/ui/Button'
import { toRoman } from '@/shared/lib/roman'
import type { Vehicle } from '@/shared/types/api'

type V = Vehicle & { id: string; effectiveType?: string }

type VehicleCardProps = {
  vehicle: V
  eager?: boolean
}

export default function VehicleCard({ vehicle, eager }: VehicleCardProps) {
  const location = useLocation()
  const display = useAppSelector((state) => selectVehicleDisplayById(state, vehicle.id))
  const typeDisplay = useAppSelector((state) => selectVehicleTypeDisplayById(state, vehicle.id))

  if (!display) return null

  const { title, nationLabel, nationIcon, image: img } = display

  const linkState = {
    from: {
      pathname: location.pathname,
      search: location.search,
    },
  }

  return (
    <Link to={`/vehicle/${vehicle.id}`} state={linkState} className="vehicle-card_link">
      <article className="vehicle-card">
        {img && (
          <img
            className="vehicle-card_bg"
            src={img}
            alt={title}
            loading={eager ? 'eager' : 'lazy'}
            fetchPriority={eager ? 'high' : 'auto'}
          />
        )}

        <header className="vehicle-card_header">
          <h3 className="vehicle-card_title">{title}</h3>
        </header>

        <div className="vehicle-card_overlay" />
        <div className="vehicle-card_content">
          <div className="vehicle-card_content_title">bundle contains:</div>
          <div className="vehicle-card_content_body">
            <div className="vehicle-card_content_meta">
              {nationIcon && (
                <img
                  className="vehicle-card_content_flag"
                  src={nationIcon}
                  alt={nationLabel}
                  width={18}
                  height={12}
                  loading="lazy"
                />
              )}
            </div>
            <span className="vehicle-card_content_level">{toRoman(vehicle.level)}</span>

            <span className="vehicle-card_content_nation">
              {typeDisplay?.icon ? (
                <img
                  className="vehicle-card_content_type-icon"
                  src={typeDisplay.icon}
                  alt={typeDisplay.label}
                  width={20}
                  height={20}
                  loading="lazy"
                />
              ) : vehicle.effectiveType ? (
                ` • ${vehicle.effectiveType}`
              ) : null}
            </span>
            <span>{title}</span>
          </div>
          <Button className="vehicle-card_content_btn" type="button">
            View
          </Button>
        </div>
      </article>
    </Link>
  )
}
