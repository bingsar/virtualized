import { Suspense, lazy } from 'react'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from 'react-router-dom'
import { ErrorBoundary } from '@/app-providers/ErrorBoundary.tsx'
import { MainLayout } from '@/shared/ui/MainLayout'
import { PageLoader } from '@/shared/ui/PageLoader'

const CatalogPage = lazy(() => import('@/pages/catalog/CatalogPage'))
const VehiclePage = lazy(() => import('@/pages/vehicle/VehiclePage'))

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <CatalogPage />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path="/vehicle/:id"
          element={
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <VehiclePage />
              </Suspense>
            </ErrorBoundary>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </>,
  ),
)

export function AppRouter() {
  return <RouterProvider router={router} />
}
