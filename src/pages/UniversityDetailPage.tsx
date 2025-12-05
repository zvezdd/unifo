import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ThreeDTourViewer from '../components/ThreeDTourViewer'
import ProgramCard from '../components/ProgramCard'
import LoadingState from '../components/LoadingState'
import { useAppContext } from '../context/AppContext'

const SectionCard = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => (
  <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
    <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
    <div className="mt-3 text-sm text-slate-700">{children}</div>
  </section>
)

const UniversityDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { universities, loading } = useAppContext()

  const university = useMemo(
    () => universities.find((u) => u.id === id),
    [id, universities],
  )

  if (loading && !university) {
    return <LoadingState label="Loading university..." />
  }

  if (!university) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center">
        <p className="text-sm text-slate-600">University not found.</p>
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <div className="flex flex-wrap items-center gap-4">
          <img
            src={university.logoUrl}
            alt={university.name}
            className="h-16 w-16 rounded bg-slate-100 object-contain p-2"
          />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {university.name}
            </h1>
            <p className="text-sm text-slate-500">{university.location}</p>
          </div>
        </div>
        <p className="text-sm text-slate-700">{university.mission}</p>
        <div className="flex flex-wrap gap-2">
          {university.achievements.map((ach) => (
            <span
              key={ach}
              className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-primary-700"
            >
              {ach}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="History">
          <p>{university.history}</p>
        </SectionCard>
        <SectionCard title="Leadership">
          <ul className="list-disc pl-4">
            {university.leadership.map((leader) => (
              <li key={leader}>{leader}</li>
            ))}
          </ul>
        </SectionCard>
        <SectionCard title="Admissions">
          <div className="space-y-2">
            <div>
              <p className="font-semibold">Requirements</p>
              <ul className="list-disc pl-4">
                {university.admissions.requirements.map((req) => (
                  <li key={req}>{req}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold">Deadlines</p>
              <ul className="list-disc pl-4">
                {university.admissions.deadlines.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold">Scholarships & Aid</p>
              <ul className="list-disc pl-4">
                {university.admissions.scholarships.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="International Cooperation">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="font-semibold">Partner universities</p>
            <ul className="mt-2 list-disc pl-4 text-sm text-slate-700">
              {university.cooperation.partners.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold">Exchange programs</p>
            <ul className="mt-2 list-disc pl-4 text-sm text-slate-700">
              {university.cooperation.exchangePrograms.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold">Foreign students</p>
            <p className="mt-2 text-sm text-slate-700">
              {university.cooperation.foreignStudentInfo}
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Academic programs">
        <div className="grid gap-3 md:grid-cols-2">
          {university.programs.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              onClick={() =>
                navigate(`/universities/${university.id}/programs/${program.id}`)
              }
            />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="3D Virtual Tour">
        <ThreeDTourViewer url={university.tour3dUrl} />
      </SectionCard>

      <div className="flex gap-3">
        <Link
          to="/comparison"
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
        >
          Compare universities
        </Link>
        <Link
          to="/universities"
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-primary-200 hover:text-primary-700"
        >
          Back to list
        </Link>
      </div>
    </div>
  )
}

export default UniversityDetailPage


