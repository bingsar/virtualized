import './styles.scss'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setQ, clear } from '@/features/search/model/searchSlice'
import { Close } from '@/assets/icons.tsx'

export default function SearchBox() {
  const dispatch = useAppDispatch()
  const q = useAppSelector((s) => s.search.q)
  const [value, setValue] = useState(q)

  useEffect(() => {
    setValue(q)
  }, [q])

  useEffect(() => {
    if (value !== q) {
      dispatch(setQ(value))
    }
  }, [dispatch, q, value])

  const handleClear = () => {
    setValue('')
    dispatch(clear())
  }

  return (
    <div className="search-box">
      <input
        id="search-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search ships"
        className="search-box_input"
      />
      {value && (
        <div className="search-box_close" onClick={handleClear}>
          <Close />
        </div>
      )}
    </div>
  )
}
