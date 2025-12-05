import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import LoadingState from '../components/LoadingState'
import { useAppContext } from '../context/AppContext'

const ProgramDetailPage = () => {
  const { id, programId } = useParams()
  const navigate = useNavigate()
  const { universities, loading } = useAppContext()

  const university = useMemo(
    () => universities.find((u) => u.id === id),
    [id, universities],
  )
  const program = university?.programs.find((p) => p.id === programId)

  if (loading && !program) {
    return <LoadingState label="Loading program..." />
  }

  if (!university || !program) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center">
        <p className="text-sm text-slate-600">Program not found.</p>
        <button
          className="mt-3 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white"
          onClick={() => navigate(-1)}
        >
          Go back
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
      <div className="flex items-center gap-3">
        <img
          src={university.logoUrl}
          alt={university.name}
          className="h-12 w-12 rounded bg-slate-100 object-contain p-2"
        />
        <div>
          <h1 className="text-xl font-bold text-slate-900">{program.title}</h1>
          <p className="text-sm text-slate-500">
            {university.name} — {program.faculty}
          </p>
        </div>
      </div>

      <p className="text-sm text-slate-700">{program.description}</p>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Duration</p>
          <p>{program.duration}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Tuition</p>
          <p>{program.tuitionFee}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Faculty</p>
          <p>{program.faculty}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          to={`/universities/${university.id}`}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
        >
          Back to university
        </Link>
        <Link
          to="/universities"
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-primary-200 hover:text-primary-700"
        >
          Explore more
        </Link>
      </div>
    </div>
  )
}

export default ProgramDetailPage


