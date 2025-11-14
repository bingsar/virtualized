import './styles.scss'
import { Link, useLocation } from 'react-router-dom'
import { Logo } from '@/assets/icons'
import SearchBox from '@/features/search/ui/SearchBox'

export const Header = () => {
  const location = useLocation()
  const hideSearch = location.pathname.startsWith('/vehicle')

  return (
    <header className="nav-bar">
      <nav className="nav-bar_holder">
        <Link to="/" className="nav-bar_link">
          <Logo width="100" height="100" />
        </Link>
        {!hideSearch && <SearchBox />}
      </nav>
    </header>
  )
}
