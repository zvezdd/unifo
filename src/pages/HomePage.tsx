import { Link } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import UniversitySearchBar from '../components/UniversitySearchBar'
import UniversityCard from '../components/UniversityCard'
import LoadingState from '../components/LoadingState'

const HomePage = () => {
  const { filtered, loading, error } = useAppContext()
  const featured = filtered.slice(0, 3)

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-2xl bg-gradient-to-r from-primary-600 to-indigo-500 px-6 py-10 text-white shadow-card">
        <div className="flex flex-col gap-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
            Kazakhstan University DataHub
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Explore every university in Kazakhstan
          </h1>
          <p className="max-w-2xl text-lg text-white/80">
            Search programs, compare universities, view 3D campus tours, and
            manage data through the built-in admin panel powered by Firebase.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/universities"
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-primary-700 shadow-sm transition hover:-translate-y-0.5"
            >
              Browse universities
            </Link>
            <Link
              to="/comparison"
              className="rounded-lg border border-white/50 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              Compare now
            </Link>
          </div>
        </div>
      </section>

      <UniversitySearchBar />

      {loading && <LoadingState label="Loading universities..." />}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Featured</h2>
          <Link
            to="/universities"
            className="text-sm font-semibold text-primary-600 hover:text-primary-700"
          >
            View all
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((uni) => (
            <UniversityCard key={uni.id} university={uni} />
          ))}
          {!featured.length && !loading && (
            <p className="text-sm text-slate-500">
              No universities found. Try seeding data from the admin panel.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

export default HomePage


