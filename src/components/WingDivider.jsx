export default function WingDivider({ flip = false }) {
  const gradientId = flip ? 'wing-grad-flip' : 'wing-grad'
  return (
    <div className={`wing-divider ${flip ? 'is-flip' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
            {flip ? (
              <>
                <stop offset="0%" stopColor="#D4E157" />
                <stop offset="100%" stopColor="#1FAE64" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#1FAE64" />
                <stop offset="100%" stopColor="#D4E157" />
              </>
            )}
          </linearGradient>
        </defs>
        <path
          d={flip
            ? 'M0 0 H1440 V60 Q1220 10 980 50 Q720 100 480 60 Q240 24 0 54 Z'
            : 'M0 90 H1440 V30 Q1220 80 980 40 Q720 -10 480 30 Q240 66 0 36 Z'}
          fill={`url(#${gradientId})`}
        />
      </svg>
    </div>
  )
}