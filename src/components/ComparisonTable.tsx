import type { University } from '../types/university'

type Props = {
  items: University[]
}

const ComparisonTable = ({ items }: Props) => {
  if (!items.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-500">
        Select universities to compare side-by-side.
      </div>
    )
  }

  const renderRow = (label: string, valueGetter: (u: University) => string) => (
    <div className="grid grid-cols-1 gap-3 border-t border-slate-100 py-4 sm:grid-cols-[200px_1fr]">
      <div className="text-sm font-semibold text-slate-700">{label}</div>
      <div className="grid gap-3 sm:grid-cols-3">
        {items.map((u) => (
          <div
            key={`${label}-${u.id}`}
            className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700"
          >
            {valueGetter(u)}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[200px_1fr]">
        <div className="text-sm font-semibold text-slate-700">University</div>
        <div className="grid gap-3 sm:grid-cols-3">
          {items.map((u) => (
            <div
              key={u.id}
              className="flex items-center gap-2 rounded-lg border border-slate-100 p-3"
            >
              <img
                src={u.logoUrl}
                alt={u.name}
                className="h-10 w-10 rounded bg-slate-100 object-contain p-1"
              />
              <div>
                <div className="font-semibold text-slate-900">{u.name}</div>
                <div className="text-xs text-slate-500">{u.location}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {renderRow(
        'Mission',
        (u) => u.mission || '—',
      )}
      {renderRow(
        'Programs',
        (u) =>
          u.programs
            .slice(0, 3)
            .map((p) => p.title)
            .join(', ') || '—',
      )}
      {renderRow(
        'Tuition',
        (u) =>
          u.programs[0]?.tuitionFee
            ? `${u.programs[0].tuitionFee} (varies)`
            : '—',
      )}
      {renderRow(
        'Scholarships',
        (u) => u.admissions.scholarships.join(', ') || '—',
      )}
      {renderRow(
        'Exchange',
        (u) => u.cooperation.exchangePrograms.join(', ') || '—',
      )}
    </div>
  )
}

export default ComparisonTable

