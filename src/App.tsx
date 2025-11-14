import { ErrorBoundary } from '@/app-providers/ErrorBoundary.tsx'
import { Provider } from 'react-redux'
import { store } from '@/app/store'
import { AppRouter } from '@/app/router'

export default function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AppRouter />
      </Provider>
    </ErrorBoundary>
  )
}
