import './styles.scss'

type Props = { message?: string; onRetry?: () => void; actionLabel?: string }

export default function ErrorState({
  message = 'Something went wrong',
  onRetry,
  actionLabel = 'Retry',
}: Props) {
  return (
    <div className="error-state">
      <div className="error-state_container">
        <h2 className="error-state_title">{message}</h2>
        {onRetry && (
          <div className="error-state_actions">
            <button className="btn btn_primary" onClick={onRetry}>
              {actionLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
