import './styles.scss'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/ui/Button'

type ErrorPageProps = {
  reloadApp: () => void
  error?: Error
}

export const ErrorPage = ({ reloadApp, error }: ErrorPageProps) => {
  const navigate = useNavigate()
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="error-page">
      <div className="error-page_container">
        <h1 className="error-page_title">Something went wrong</h1>
        <p className="error-page_text">
          An unexpected error occurred. You can try again or go to main page.
        </p>

        <div className="error-page_actions">
          <Button onClick={reloadApp}>Try again</Button>
          <Button onClick={() => navigate('/')}>Home</Button>
          {error && (
            <Button onClick={() => setShowDetails((v) => !v)}>
              {showDetails ? 'Hide details' : 'Show details'}
            </Button>
          )}
        </div>

        {showDetails && error && (
          <div className="error-page_details">
            <div className="error-page_details-title">{error.message}</div>
            <pre className="error-page_pre">{error.stack}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
