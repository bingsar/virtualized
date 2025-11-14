import './styles.scss'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronDown } from '@/assets/icons.tsx'

type Props = {
  title: string
  children: (close: () => void) => ReactNode
}

export function Dropdown({ title, children }: Props) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const btnRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    const handleClickAway = (e: MouseEvent) => {
      if (!rootRef.current) return
      const target = e.target as Node
      if (rootRef.current.contains(target)) return
      setOpen(false)
    }
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickAway)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleClickAway)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [])

  const close = () => setOpen(false)

  return (
    <div className="filters_group" ref={rootRef}>
      <button
        ref={btnRef}
        type="button"
        className="filters_group_title"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
      >
        {title}
        <ChevronDown className="filters_group_arrow" />
      </button>

      {open && (
        <div className="filter-block_drop" role="listbox">
          <div className="filters_group_dropdown-body">
            {children(close)}
          </div>
        </div>
      )}
    </div>
  )
}
