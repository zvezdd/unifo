import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ComparisonTable from '../components/ComparisonTable'
import { useAppContext } from '../context/AppContext'

const ComparisonPage = () => {
  const { universities, comparison, toggleCompare } = useAppContext()
  const [params, setParams] = useSearchParams()

  useEffect(() => {
    const add = params.get('add')
    if (add) {
      toggleCompare(add)
      setParams({})
    }
  }, [params, setParams, toggleCompare])

  const items = universities.filter((u) => comparison.includes(u.id))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Compare universities</h1>
        <p className="text-sm text-slate-600">
          Select up to three universities to view programs, scholarships, and
          cooperation details side-by-side.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {universities.map((u) => {
          const active = comparison.includes(u.id)
          return (
            <button
              key={u.id}
              onClick={() => toggleCompare(u.id)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                active
                  ? 'border-primary-200 bg-primary-50 text-primary-700'
                  : 'border-slate-200 text-slate-700 hover:border-primary-200 hover:text-primary-700'
              }`}
            >
              {active ? 'Selected' : 'Select'} — {u.name}
            </button>
          )
        })}
      </div>

      <ComparisonTable items={items} />
    </div>
  )
}

export default ComparisonPage


