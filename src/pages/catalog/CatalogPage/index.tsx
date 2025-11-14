import './styles.scss'
import {
  useGetNationsQuery,
  useGetVehicleTypesQuery,
  useGetVehiclesQuery,
  useGetMediaPathQuery,
} from '@/services/api/wowsApi'
import { PageLoader } from '@/shared/ui/PageLoader'
import ErrorState from '@/shared/ui/ErrorState'
import VehicleList from '@/pages/catalog/ui/VehicleList'
import FiltersPanel from '@/features/filters/ui/FiltersPanel'
import { useCatalogQuerySync } from '@/pages/catalog/lib/useCatalogQuerySync'

export default function CatalogPage() {
  useCatalogQuerySync()

  const nationsQ = useGetNationsQuery()
  const typesQ = useGetVehicleTypesQuery()
  const mediaQ = useGetMediaPathQuery()
  const vehiclesQ = useGetVehiclesQuery()

  const loading = nationsQ.isLoading || typesQ.isLoading || mediaQ.isLoading || vehiclesQ.isLoading
  const error = nationsQ.isError || typesQ.isError || mediaQ.isError || vehiclesQ.isError

  if (loading) return <PageLoader />
  if (error) {
    const refetchAll = () => {
      nationsQ.refetch()
      typesQ.refetch()
      mediaQ.refetch()
      vehiclesQ.refetch()
    }
    return <ErrorState onRetry={refetchAll} />
  }

  return (
    <>
      <section className="filters">
        <FiltersPanel />
      </section>
      <section className="vehicles">
        <VehicleList />
      </section>
    </>
  )
}
