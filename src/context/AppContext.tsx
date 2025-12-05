import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useState,
} from 'react'
import type { PropsWithChildren } from 'react'
import {
  fetchUniversities,
  seedUniversities,
  upsertUniversity,
  deleteUniversity,
} from '../firebase/db'
import type { University, UniversityFilters } from '../types/university'

type AppContextState = {
  loading: boolean
  error?: string
  universities: University[]
  filtered: University[]
  comparison: string[]
  filters: UniversityFilters
  refresh: (filters?: UniversityFilters) => Promise<void>
  setFilters: (filters: UniversityFilters) => void
  toggleCompare: (id: string) => void
  seed: () => Promise<void>
  saveUniversity: (u: University) => Promise<void>
  removeUniversity: (id: string) => Promise<void>
}

const AppContext = createContext<AppContextState | undefined>(undefined)

export const AppProvider = ({ children }: PropsWithChildren) => {
  const [universities, setUniversities] = useState<University[]>([])
  const [filtered, setFiltered] = useState<University[]>([])
  const [comparison, setComparison] = useState<string[]>([])
  const [filters, setFilters] = useState<UniversityFilters>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  const load = useCallback(async (nextFilters?: UniversityFilters) => {
    setLoading(true)
    setError(undefined)
    try {
      const items = await fetchUniversities(nextFilters)
      setUniversities(items)
      setFiltered(items)
    } catch (err) {
      setError('Could not load universities. Check your Firebase config.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  const applyFilterState = (state: UniversityFilters, items: University[]) => {
    const { search, city, program } = state
    const next = items.filter((u) => {
      const matchesSearch = search
        ? u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.location.toLowerCase().includes(search.toLowerCase())
        : true
      const matchesCity = city
        ? u.location.toLowerCase().includes(city.toLowerCase())
        : true
      const matchesProgram = program
        ? u.programs.some((p) =>
            p.title.toLowerCase().includes(program.toLowerCase()),
          )
        : true
      return matchesSearch && matchesCity && matchesProgram
    })
    setFiltered(next)
  }

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    applyFilterState(filters, universities)
  }, [filters, universities])

  const toggleCompare = useCallback((id: string) => {
    setComparison((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id].slice(-3),
    )
  }, [])

  const seed = useCallback(async () => {
    setLoading(true)
    await seedUniversities()
    await load(filters)
    setLoading(false)
  }, [filters, load])

  const saveUniversity = useCallback(async (u: University) => {
    setLoading(true)
    await upsertUniversity(u)
    await load(filters)
    setLoading(false)
  }, [filters, load])

  const removeUniversity = useCallback(async (id: string) => {
    setLoading(true)
    await deleteUniversity(id)
    await load(filters)
    setLoading(false)
  }, [filters, load])

  const value = useMemo(
    () => ({
      loading,
      error,
      universities,
      filtered,
      comparison,
      filters,
      refresh: load,
      setFilters,
      toggleCompare,
      seed,
      saveUniversity,
      removeUniversity,
    }),
    [loading, error, universities, filtered, comparison, filters],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = () => {
  const ctx = useContext(AppContext)
  if (!ctx) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return ctx
}

