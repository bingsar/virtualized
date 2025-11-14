import './styles.scss'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setQ, clear } from '@/features/search/model/searchSlice'
import { Close } from '@/assets/icons.tsx'

const DEBOUNCE_MS = 200

export default function SearchBox() {
  const dispatch = useAppDispatch()
  const q = useAppSelector((s) => s.search.q)
  const [value, setValue] = useState(q)

  useEffect(() => {
    setValue(q)
  }, [q])

  useEffect(() => {
    if (value === q) return
    const handle = window.setTimeout(() => {
      dispatch(setQ(value))
    }, DEBOUNCE_MS)
    return () => window.clearTimeout(handle)
  }, [dispatch, q, value])

  const handleClear = () => {
    setValue('')
    dispatch(clear())
  }

  return (
    <div className="search-box">
      <label className="visually-hidden" htmlFor="search-input">
        Search ships
      </label>
      <input
        id="search-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search ships"
        className="search-box_input"
        type="search"
        aria-label="Search ships"
      />
      {value && (
        <button
          type="button"
          className="search-box_close"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <Close />
        </button>
      )}
    </div>
  )
}
