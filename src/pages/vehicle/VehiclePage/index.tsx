import './styles.scss'
import { useParams, Link, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import {
  selectVehicleById,
  selectVehicleDisplayById,
  selectVehicleTypeDisplayById,
} from '@/entities/vehicle/model/vehicleDetails.selectors'
import {
  useGetVehiclesQuery,
  useGetNationsQuery,
  useGetVehicleTypesQuery,
  useGetMediaPathQuery,
} from '@/services/api/wowsApi'
import { getDescription } from '@/shared/lib/locale'
import ErrorState from '@/shared/ui/ErrorState'
import { PageLoader } from '@/shared/ui/PageLoader'
import { toRoman } from '@/shared/lib/roman'

export default function VehiclePage() {
  const { id = '' } = useParams()
  const location = useLocation()

  const vehiclesQ = useGetVehiclesQuery()
  const nationsQ = useGetNationsQuery()
  const typesQ = useGetVehicleTypesQuery()
  const mediaQ = useGetMediaPathQuery()

  const loading =
    vehiclesQ.isUninitialized ||
    vehiclesQ.isLoading ||
    nationsQ.isLoading ||
    typesQ.isLoading ||
    mediaQ.isLoading
  const error = vehiclesQ.isError || nationsQ.isError || typesQ.isError || mediaQ.isError

  const vehicle = useAppSelector((state) => selectVehicleById(state, id))
  const display = useAppSelector((state) => selectVehicleDisplayById(state, id))
  const typeDisplay = useAppSelector((state) => selectVehicleTypeDisplayById(state, id))

  if (loading) return <PageLoader />
  if (error)
    return (
      <ErrorState
        onRetry={() => {
          vehiclesQ.refetch()
          nationsQ.refetch()
          typesQ.refetch()
          mediaQ.refetch()
        }}
      />
    )

  if (!vehicle || !display) {
    return (
      <div>
        <p>Not found</p>
        <Link
          to={
            location.state?.from
              ? { pathname: location.state.from.pathname, search: location.state.from.search }
              : '/'
          }
        >
          Back
        </Link>
      </div>
    )
  }

  const { title, nationLabel, image: icon, nationIcon } = display
  const description = getDescription(vehicle)
  const backLink =
    location.state?.from && typeof location.state.from.pathname === 'string'
      ? { pathname: location.state.from.pathname, search: location.state.from.search }
      : '/'

  return (
    <div className="vehicle-page">
      <Link to={backLink}>Back</Link>
      {icon && (
        <div className="vehicle-page_image">
          <img src={icon} alt={title} width={435} height={256} style={{ objectFit: 'contain' }} />
        </div>
      )}
      <h1>{title}</h1>
      <div className="vehicle-page_bundle">
        {nationIcon && (
          <span>
            <img src={nationIcon} alt={nationLabel} width={18} height={12} loading="lazy" />
          </span>
        )}
        <span>
          {typeDisplay?.icon ? (
            <img
              src={typeDisplay.icon}
              alt={typeDisplay.label}
              width={20}
              height={20}
              loading="lazy"
            />
          ) : typeDisplay?.key ? (
            ` • ${typeDisplay.key}`
          ) : null}
        </span>
        <span>{toRoman(vehicle.level)}</span>
      </div>
      {description && (
        <section className="vehicle-page_description">
          <h2>History</h2>
          <p>{description}</p>
        </section>
      )}
    </div>
  )
}
