import UniversityCard from '../components/UniversityCard'
import UniversitySearchBar from '../components/UniversitySearchBar'
import LoadingState from '../components/LoadingState'
import { useAppContext } from '../context/AppContext'

const UniversitiesPage = () => {
  const { filtered, loading, error } = useAppContext()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900">
          Universities in Kazakhstan
        </h1>
        <p className="text-sm text-slate-600">
          Search, filter, and explore all universities with program details,
          admissions info, and 3D campus tours.
        </p>
      </div>

      <UniversitySearchBar />

      {loading && <LoadingState label="Loading universities..." />}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((uni) => (
          <UniversityCard key={uni.id} university={uni} />
        ))}
      </div>

      {!filtered.length && !loading && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
          No universities match these filters. Try clearing filters or seeding
          sample data from the admin panel.
        </div>
      )}
    </div>
  )
}

export default UniversitiesPage


