import { useEffect, useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setLevel, setNation, setType } from '@/features/filters/model/filtersSlice'
import { setQ } from '@/features/search/model/searchSlice'

const normalizeStringList = (values: string[], toLowerCase = false) => {
  const next = new Set<string>()
  values.forEach((value) => {
    const trimmed = value.trim()
    if (!trimmed) return
    next.add(toLowerCase ? trimmed.toLowerCase() : trimmed)
  })
  return Array.from(next).sort()
}

const normalizeNumberList = (values: string[]) => {
  const next = new Set<number>()
  values.forEach((value) => {
    const parsed = Number.parseInt(value, 10)
    if (Number.isNaN(parsed)) return
    next.add(parsed)
  })
  return Array.from(next).sort((a, b) => a - b)
}

const arraysEqual = <T>(a: readonly T[], b: readonly T[]) =>
  a.length === b.length && a.every((value, index) => Object.is(value, b[index]))

const buildQueryString = (params: {
  nation: readonly string[]
  type: readonly string[]
  level: readonly number[]
  q: string
}) => {
  const search = new URLSearchParams()

  params.level.forEach((value) => search.append('level', String(value)))
  params.type.forEach((value) => search.append('type', value))
  params.nation.forEach((value) => search.append('nation', value))
  if (params.q.trim()) search.set('q', params.q.trim())

  return search.toString()
}

export function useCatalogQuerySync() {
  const [searchParams, setSearchParams] = useSearchParams()
  const dispatch = useAppDispatch()
  const filters = useAppSelector((state) => state.filters)
  const q = useAppSelector((state) => state.search.q)
  const searchString = searchParams.toString()
  const filtersRef = useRef(filters)
  const qRef = useRef(q)
  const lastSyncedQueryRef = useRef(searchString)

  useEffect(() => {
    filtersRef.current = filters
  }, [filters])

  useEffect(() => {
    qRef.current = q
  }, [q])

  useEffect(() => {
    const params = new URLSearchParams(searchString)
    const nextNation = normalizeStringList(params.getAll('nation'), true)
    const nextType = normalizeStringList(params.getAll('type'))
    const nextLevel = normalizeNumberList(params.getAll('level'))
    const nextQ = params.get('q') ?? ''
    const currentFilters = filtersRef.current
    const currentQ = qRef.current

    if (!arraysEqual(currentFilters.nation, nextNation)) dispatch(setNation(nextNation))
    if (!arraysEqual(currentFilters.type, nextType)) dispatch(setType(nextType))
    if (!arraysEqual(currentFilters.level, nextLevel)) dispatch(setLevel(nextLevel))
    if (currentQ !== nextQ) dispatch(setQ(nextQ))
    lastSyncedQueryRef.current = searchString
  }, [dispatch, searchString])

  const desiredQuery = useMemo(
    () =>
      buildQueryString({
        level: filters.level,
        type: filters.type,
        nation: filters.nation,
        q,
      }),
    [filters.level, filters.nation, filters.type, q],
  )

  useEffect(() => {
    if (desiredQuery === lastSyncedQueryRef.current) return
    lastSyncedQueryRef.current = desiredQuery
    setSearchParams(desiredQuery, { replace: true })
  }, [desiredQuery, setSearchParams])
}
