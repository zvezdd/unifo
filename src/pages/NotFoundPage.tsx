import { Link } from 'react-router-dom'

const NotFoundPage = () => (
  <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-card">
    <h1 className="text-2xl font-bold text-slate-900">Page not found</h1>
    <p className="mt-2 text-sm text-slate-600">
      The page you’re looking for doesn’t exist.
    </p>
    <Link
      to="/"
      className="mt-4 inline-flex rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
    >
      Go home
    </Link>
  </div>
)

export default NotFoundPage


