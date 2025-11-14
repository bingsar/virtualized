import './styles.scss'
import { Outlet } from 'react-router-dom'
import { Header } from '@/shared/ui/Header'

export function MainLayout() {
  return (
    <div className="wrapper">
      <div className="app container">
        <Header />
        <Outlet />
      </div>
    </div>
  )
}
