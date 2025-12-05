type Props = {
  url?: string
}

const ThreeDTourViewer = ({ url }: Props) => {
  if (!url) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
        3D tour coming soon. Add an iframe link (Matterport/360°) via the admin
        panel.
      </div>
    )
  }
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 shadow-card">
      <iframe
        src={url}
        title="3D Campus Tour"
        className="h-[400px] w-full"
        allowFullScreen
        loading="lazy"
      />
    </div>
  )
}

export default ThreeDTourViewer


