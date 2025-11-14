import './styles.scss'
import { type ReactNode } from 'react'

type Props = {
  children: ReactNode
  active: boolean
  onClick: () => void
  icon?: string
  size?: 'md' | 'lg'
}

export default function FilterOptionButton({
  children,
  active,
  onClick,
  icon,
  size = 'md',
}: Props) {
  const sizeClass = size === 'lg' ? ' filters_option--lg' : ''
  return (
    <button
      type="button"
      className={`filters_option${active ? ' filters_option--active' : ''}${sizeClass}`}
      onClick={onClick}
    >
      {icon ? <img className="filters_flag" src={icon} alt="" width={18} height={12} /> : null}
      <span>{children}</span>
    </button>
  )
}
