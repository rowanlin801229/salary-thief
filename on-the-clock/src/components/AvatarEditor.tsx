function PencilIcon() {
  return (
    <svg className="auth-avatar-edit-icon" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"
      />
    </svg>
  )
}

export function AvatarEditor({
  photoSrc,
  fallbackText,
  uploading,
  onPick,
  title
}: {
  photoSrc: string
  fallbackText: string
  uploading: boolean
  onPick: () => void
  title: string
}) {
  return (
    <div className="auth-avatar-container">
      {photoSrc ? (
        <img className="auth-avatar" src={photoSrc} alt="" />
      ) : (
        <span className="auth-avatar auth-avatar-fallback">{fallbackText}</span>
      )}
      <button
        type="button"
        className="auth-avatar-edit"
        onClick={onPick}
        disabled={uploading}
        title={title}
        aria-label={title}
      >
        {uploading ? <span className="auth-avatar-edit-busy" /> : <PencilIcon />}
      </button>
    </div>
  )
}
