import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { useAppContext } from '../context/AppContext'

const UniversitySearchBar = () => {
  const { filters, setFilters } = useAppContext()
  const [searchParams, setSearchParams] = useSearchParams()
  const [localSearch, setLocalSearch] = useState(filters.search || '')
  const [city, setCity] = useState(filters.city || '')
  const [program, setProgram] = useState(filters.program || '')

  useEffect(() => {
    const add = searchParams.get('add')
    if (add) {
      setSearchParams({})
    }
  }, [searchParams, setSearchParams])

  const applyFilters = () => {
    setFilters({
      search: localSearch || undefined,
      city: city || undefined,
      program: program || undefined,
    })
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-card">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm focus-within:border-primary-300">
          <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
          <input
            className="w-full border-none text-sm outline-none"
            placeholder="Search universities by name or city"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
          />
        </div>
        <button
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
          onClick={applyFilters}
        >
          <FunnelIcon className="h-5 w-5" />
          Filter
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <input
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-300 focus:outline-none"
          placeholder="Filter by city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-300 focus:outline-none"
          placeholder="Filter by program name"
          value={program}
          onChange={(e) => setProgram(e.target.value)}
        />
        <button
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 shadow-sm transition hover:border-primary-200 hover:text-primary-700"
          onClick={() => {
            setLocalSearch('')
            setCity('')
            setProgram('')
            setFilters({})
          }}
        >
          Clear filters
        </button>
      </div>
    </div>
  )
}

export default UniversitySearchBar


