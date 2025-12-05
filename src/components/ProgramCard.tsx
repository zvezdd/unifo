import type { Program } from '../types/university'

type Props = {
  program: Program
  onClick?: () => void
}

const ProgramCard = ({ program, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className="flex w-full flex-col items-start gap-2 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="flex w-full items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {program.title}
          </h3>
          <p className="text-sm text-slate-500">{program.faculty}</p>
        </div>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-primary-700">
          {program.duration}
        </span>
      </div>
      <p className="line-clamp-2 text-sm text-slate-600">
        {program.description}
      </p>
      <p className="text-sm font-semibold text-primary-700">
        Tuition: {program.tuitionFee}
      </p>
    </button>
  )
}

export default ProgramCard

