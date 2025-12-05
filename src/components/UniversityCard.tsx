import { Link } from 'react-router-dom'
import type { University } from '../types/university'
import { MapPinIcon, TrophyIcon } from '@heroicons/react/24/outline'
import { useAppContext } from '../context/AppContext'

type Props = {
  university: University
}

const UniversityCard = ({ university }: Props) => {
  const { toggleCompare, comparison } = useAppContext()
  const isCompared = comparison.includes(university.id)

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={university.logoUrl}
            alt={`${university.name} logo`}
            className="h-12 w-12 rounded bg-slate-100 object-contain p-1"
          />
          <div>
            <Link
              to={`/universities/${university.id}`}
              className="text-lg font-semibold text-slate-900 hover:text-primary-600"
            >
              {university.name}
            </Link>
            <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
              <MapPinIcon className="h-4 w-4" />
              <span>{university.location}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => toggleCompare(university.id)}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
            isCompared
              ? 'bg-primary-100 text-primary-700'
              : 'border border-slate-200 text-slate-600 hover:border-primary-200 hover:text-primary-700'
          }`}
        >
          {isCompared ? 'In comparison' : 'Compare'}
        </button>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-slate-600">
        {university.missionHistory}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {university.achievements.slice(0, 3).map((ach) => (
          <span
            key={ach}
            className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs text-primary-700"
          >
            <TrophyIcon className="h-4 w-4" />
            {ach}
          </span>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {university.programs.slice(0, 3).map((program) => (
          <span
            key={program.id}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
          >
            {program.title}
          </span>
        ))}
        {university.programs.length > 3 && (
          <span className="text-xs text-slate-500">
            +{university.programs.length - 3} more
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3 text-sm">
        <Link
          to={`/universities/${university.id}`}
          className="text-primary-600 hover:text-primary-700"
        >
          View details
        </Link>
        <Link
          to={`/comparison?add=${university.id}`}
          className="text-slate-500 hover:text-primary-600"
        >
          Add to comparison
        </Link>
      </div>
    </div>
  )
}

export default UniversityCard

