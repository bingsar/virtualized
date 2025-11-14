import './styles.scss'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setQ, clear } from '@/features/search/model/searchSlice'
import { Close } from '@/assets/icons.tsx'

export default function SearchBox() {
  const dispatch = useAppDispatch()
  const q = useAppSelector((s) => s.search.q)

  return (
    <div className="search-box">
      <input
        id="search-input"
        value={q}
        onChange={(e) => dispatch(setQ(e.target.value))}
        placeholder="Search ships"
        className="search-box_input"
      />
      {q && (
        <div className="search-box_close" onClick={() => dispatch(clear())}>
          <Close />
        </div>
      )}
    </div>
  )
}
