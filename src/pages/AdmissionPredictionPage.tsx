import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAppContext } from '../context/AppContext'
import { predictAdmissionChance } from '../services/aiPrediction'
import LoadingState from '../components/LoadingState'

type FormValues = {
  gpa: string
  untScore: string
  ielts: string
  sat: string
  program: string
  budget: string
}

const AdmissionPredictionPage = () => {
  const { id } = useParams()
  const { universities } = useAppContext()
  const [prediction, setPrediction] = useState<{
    chance: number
    explanation: string
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const university = universities.find((u) => u.id === id)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      gpa: '',
      untScore: '',
      ielts: '',
      sat: '',
      program: '',
      budget: '',
    },
  })

  const onSubmit = async (values: FormValues) => {
    if (!university) {
      setError('University not found')
      return
    }

    setLoading(true)
    setError('')
    setPrediction(null)

    try {
      const selectedProgram = university.programs.find(
        (p) => p.title === values.program,
      )

      const result = await predictAdmissionChance({
        universityName: university.name,
        program: values.program || 'Not specified',
        gpa: values.gpa,
        untScore: values.untScore,
        ielts: values.ielts,
        sat: values.sat,
        budget: values.budget,
        universityRequirements: university.admissions.requirements,
        universityDeadlines: university.admissions.deadlines,
        programTuitionFee: selectedProgram?.tuitionFee,
      })

      setPrediction(result)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to get admission prediction. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  if (!university) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center">
        <p className="text-sm text-slate-600">University not found.</p>
        <Link
          to="/universities"
          className="mt-3 inline-block rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Go back
        </Link>
      </div>
    )
  }

  const getChanceColor = (chance: number) => {
    if (chance >= 70) return 'text-green-600 bg-green-50'
    if (chance >= 40) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getChanceLabel = (chance: number) => {
    if (chance >= 70) return 'High'
    if (chance >= 40) return 'Medium'
    return 'Low'
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-card">
        <img
          src={university.logoUrl}
          alt={university.name}
          className="h-12 w-12 rounded bg-slate-100 object-contain p-2"
        />
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Admission Prediction
          </h1>
          <p className="text-sm text-slate-500">{university.name}</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-card"
      >
        <h2 className="text-lg font-semibold text-slate-900">
          Your Academic Profile
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold text-slate-700">GPA</span>
            <input
              {...register('gpa', {
                required: 'GPA is required',
                pattern: {
                  value: /^[0-4](\.[0-9]{1,2})?$/,
                  message: 'GPA must be between 0.0 and 4.0',
                },
              })}
              type="text"
              placeholder="e.g., 3.5"
              className="rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-primary-300 focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold text-slate-700">UNT Score</span>
            <input
              {...register('untScore', {
                required: 'UNT score is required',
              })}
              type="text"
              placeholder="e.g., 120"
              className="rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-primary-300 focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold text-slate-700">IELTS Score</span>
            <input
              {...register('ielts', {
                required: 'IELTS score is required',
                pattern: {
                  value: /^[0-9](\.[0-9])?$/,
                  message: 'IELTS must be between 0.0 and 9.0',
                },
              })}
              type="text"
              placeholder="e.g., 7.0"
              className="rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-primary-300 focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold text-slate-700">SAT Score</span>
            <input
              {...register('sat')}
              type="text"
              placeholder="e.g., 1400 (optional)"
              className="rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-primary-300 focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold text-slate-700">Program</span>
            <select
              {...register('program', { required: 'Program is required' })}
              className="rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-primary-300 focus:outline-none"
            >
              <option value="">Select a program</option>
              {university.programs.map((p) => (
                <option key={p.id} value={p.title}>
                  {p.title}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold text-slate-700">Budget (per year)</span>
            <input
              {...register('budget', { required: 'Budget is required' })}
              type="text"
              placeholder="e.g., $5,000"
              className="rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-primary-300 focus:outline-none"
            />
          </label>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="rounded-lg bg-primary-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Get Prediction'}
          </button>
          <Link
            to={`/universities/${id}`}
            className="rounded-lg border border-slate-200 px-6 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-primary-200 hover:text-primary-700"
          >
            Cancel
          </Link>
        </div>
      </form>

      {loading && <LoadingState label="Analyzing your profile..." />}

      {prediction && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Admission Prediction Result
          </h2>

          <div className="mb-6 flex items-center justify-center">
            <div
              className={`flex flex-col items-center justify-center rounded-full p-8 ${getChanceColor(prediction.chance)}`}
            >
              <div className="text-5xl font-bold">{prediction.chance}%</div>
              <div className="mt-2 text-sm font-semibold">
                {getChanceLabel(prediction.chance)} Chance
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <h3 className="mb-2 text-sm font-semibold text-slate-900">
              Analysis
            </h3>
            <p className="text-sm text-slate-700 whitespace-pre-line">
              {prediction.explanation}
            </p>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => {
                setPrediction(null)
                setError('')
              }}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-primary-200 hover:text-primary-700"
            >
              Try Again
            </button>
            <Link
              to={`/universities/${id}`}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
            >
              Back to University
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdmissionPredictionPage

