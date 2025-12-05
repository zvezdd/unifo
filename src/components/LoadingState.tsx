const LoadingState = ({ label = 'Loading...' }: { label?: string }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
      <div className="flex items-center gap-3">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
        <p className="text-sm text-slate-700">{label}</p>
      </div>
    </div>
  )
}

export default LoadingState


