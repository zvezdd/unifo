import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAppContext } from '../context/AppContext'
import type { University } from '../types/university'
import LoadingState from '../components/LoadingState'

type FormValues = {
  id?: string
  name: string
  logoUrl: string
  location: string
  missionHistory: string
  achievements: string
  requirements: string
  deadlines: string
  scholarships: string
  partners: string
  exchangePrograms: string
  foreignStudentInfo: string
  tour3dUrl: string
  programTitle: string
  duration: string
  tuitionFee: string
  description: string
}

const toList = (value: string) =>
  value
    .split('\n')
    .map((v) => v.trim())
    .filter(Boolean)

const AdminPage = () => {
  const { universities, saveUniversity, removeUniversity, seed, loading } =
    useAppContext()
  const adminPass = import.meta.env.VITE_ADMIN_PASSCODE
  const [authorized, setAuthorized] = useState(() => {
    const sessionAuth = sessionStorage.getItem('admin_authorized')
    return sessionAuth === 'true' && adminPass
  })
  const [passInput, setPassInput] = useState('')
  const [authError, setAuthError] = useState('')
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      logoUrl: '',
      location: '',
      missionHistory: '',
      achievements: '',
      requirements: '',
      deadlines: '',
      scholarships: '',
      partners: '',
      exchangePrograms: '',
      foreignStudentInfo: '',
      tour3dUrl: '',
      programTitle: '',
      duration: '',
      tuitionFee: '',
      description: '',
    },
  })

  const onSubmit = async (values: FormValues) => {
    setSaveError('')
    setSaveSuccess(false)
    
    try {
      if (!values.name.trim()) {
        setSaveError('University name is required')
        return
      }

      const id =
        values.id ||
        values.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')

      const payload: University = {
        id,
        name: values.name.trim(),
        logoUrl:
          values.logoUrl?.trim() ||
          'https://placehold.co/120x120?text=University+Logo',
        location: values.location?.trim() || 'Kazakhstan',
        missionHistory: values.missionHistory?.trim() || '',
        achievements: toList(values.achievements),
        admissions: {
          requirements: toList(values.requirements),
          deadlines: toList(values.deadlines),
          scholarships: toList(values.scholarships),
        },
        cooperation: {
          partners: toList(values.partners),
          exchangePrograms: toList(values.exchangePrograms),
          foreignStudentInfo: values.foreignStudentInfo?.trim() || '',
        },
        tour3dUrl: values.tour3dUrl?.trim() || '',
        programs: values.programTitle?.trim()
          ? [
              {
                id: `${id}-${values.programTitle
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, '-')}`,
                title: values.programTitle.trim(),
                duration: values.duration?.trim() || '',
                tuitionFee: values.tuitionFee?.trim() || '',
                description: values.description?.trim() || '',
              },
            ]
          : [],
      }

      await saveUniversity(payload)
      setSaveSuccess(true)
      reset()
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('Error saving university:', error)
      setSaveError(
        error instanceof Error
          ? error.message
          : 'Failed to save university. Please try again.',
      )
    }
  }

  const onAuth = () => {
    if (!adminPass) {
      setAuthError('Admin passcode not configured. Please set VITE_ADMIN_PASSCODE in .env')
      return
    }
    
    if (passInput.trim() === adminPass.trim()) {
      setAuthorized(true)
      setAuthError('')
      sessionStorage.setItem('admin_authorized', 'true')
      setPassInput('')
    } else {
      setAuthError('Incorrect password. Please try again.')
      setPassInput('')
    }
  }

  const handleLogout = () => {
    setAuthorized(false)
    sessionStorage.removeItem('admin_authorized')
    setPassInput('')
    setAuthError('')
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onAuth()
    }
  }

  const sortedUniversities = useMemo(
    () => [...universities].sort((a, b) => a.name.localeCompare(b.name)),
    [universities],
  )

  if (!authorized) {
    return (
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-card max-w-md mx-auto">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Admin Access</h1>
          <p className="text-sm text-slate-600 mt-1">
            {adminPass
              ? 'Enter the admin password to continue.'
              : 'Admin password not configured. Please set VITE_ADMIN_PASSCODE in your .env file.'}
          </p>
        </div>
        {adminPass && (
          <>
            <div className="flex flex-col gap-2">
              <input
                type="password"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
                value={passInput}
                onChange={(e) => {
                  setPassInput(e.target.value)
                  setAuthError('')
                }}
                onKeyPress={handleKeyPress}
                placeholder="Enter admin password"
                autoFocus
              />
              {authError && (
                <p className="text-sm text-red-600" role="alert">
                  {authError}
                </p>
              )}
            </div>
            <button
              onClick={onAuth}
              className="w-full rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-200"
            >
              Continue
            </button>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
          <p className="text-sm text-slate-600">
            Manage universities and programs. Data persists to Firestore when
            Firebase is configured; otherwise it stays in memory.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={seed}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-primary-200 hover:text-primary-700"
          >
            Seed sample data
          </button>
          {adminPass && (
            <button
              onClick={handleLogout}
              className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 shadow-sm transition hover:border-red-300 hover:bg-red-50"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {(loading || isSubmitting) && (
        <LoadingState label="Saving changes..." />
      )}

      {saveError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-800">Error</p>
          <p className="text-sm text-red-600 mt-1">{saveError}</p>
        </div>
      )}

      {saveSuccess && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-semibold text-green-800">Success</p>
          <p className="text-sm text-green-600 mt-1">
            University saved successfully!
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-card"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold text-slate-700">Name</span>
            <input
              {...register('name', { required: true })}
              className="rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-primary-300 focus:outline-none"
              placeholder="University name"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold text-slate-700">Location</span>
            <input
              {...register('location')}
              className="rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-primary-300 focus:outline-none"
              placeholder="City, Country"
            />
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold text-slate-700">Logo URL</span>
            <input
              {...register('logoUrl')}
              className="rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-primary-300 focus:outline-none"
              placeholder="https://..."
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold text-slate-700">3D Tour URL</span>
            <input
              {...register('tour3dUrl')}
              className="rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-primary-300 focus:outline-none"
              placeholder="Matterport/360 iframe link"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-semibold text-slate-700">Mission & History</span>
          <textarea
            {...register('missionHistory')}
            rows={4}
            className="rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-primary-300 focus:outline-none"
            placeholder="University mission and history"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-semibold text-slate-700">
            Achievements (one per line)
          </span>
          <textarea
            {...register('achievements')}
            rows={2}
            className="rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-primary-300 focus:outline-none"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold text-slate-700">
              Admission requirements
            </span>
            <textarea
              {...register('requirements')}
              rows={2}
              className="rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-primary-300 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold text-slate-700">Deadlines</span>
            <textarea
              {...register('deadlines')}
              rows={2}
              className="rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-primary-300 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold text-slate-700">Scholarships</span>
            <textarea
              {...register('scholarships')}
              rows={2}
              className="rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-primary-300 focus:outline-none"
            />
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold text-slate-700">Partners</span>
            <textarea
              {...register('partners')}
              rows={2}
              className="rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-primary-300 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold text-slate-700">
              Exchange programs
            </span>
            <textarea
              {...register('exchangePrograms')}
              rows={2}
              className="rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-primary-300 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold text-slate-700">
              Info for foreign students
            </span>
            <textarea
              {...register('foreignStudentInfo')}
              rows={2}
              className="rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-primary-300 focus:outline-none"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-semibold text-slate-700">Program title</span>
          <input
            {...register('programTitle')}
            className="rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-primary-300 focus:outline-none"
            placeholder="e.g., Computer Science BSc"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold text-slate-700">Duration</span>
            <input
              {...register('duration')}
              className="rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-primary-300 focus:outline-none"
              placeholder="4 years"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold text-slate-700">Tuition fee</span>
            <input
              {...register('tuitionFee')}
              className="rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-primary-300 focus:outline-none"
              placeholder="$5,000 per year"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold text-slate-700">Description</span>
            <input
              {...register('description')}
              className="rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-primary-300 focus:outline-none"
              placeholder="Short summary"
            />
          </label>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-primary-200 hover:text-primary-700"
          >
            Reset
          </button>
          <button
            type="submit"
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
          >
            Save university
          </button>
        </div>
      </form>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
        <h2 className="text-lg font-semibold text-slate-900">
          Existing universities
        </h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {sortedUniversities.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
            >
              <div>
                <p className="font-semibold text-slate-900">{u.name}</p>
                <p className="text-xs text-slate-500">{u.location}</p>
              </div>
              <button
                onClick={() => removeUniversity(u.id)}
                className="text-xs font-semibold text-red-600 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          ))}
          {!sortedUniversities.length && (
            <p className="text-sm text-slate-500">
              No universities yet. Seed sample data or create a new record.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPage

