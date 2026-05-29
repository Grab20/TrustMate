interface Props {
  score: number
  size?: 'sm' | 'md' | 'lg'
}

export default function TrustScore({ score, size = 'md' }: Props) {
  const color = score >= 90 ? '#1a5c28' : score >= 75 ? '#7c5c00' : '#8b2020'
  const bg = score >= 90 ? '#d4edd8' : score >= 75 ? '#fef3c7' : '#fee2e2'
  const label = score >= 90 ? 'Excellent' : score >= 75 ? 'Good' : 'Building'

  const sizes = {
    sm: { score: 16, label: 11, pad: '4px 10px' },
    md: { score: 20, label: 12, pad: '6px 14px' },
    lg: { score: 28, label: 13, pad: '10px 18px' },
  }
  const s = sizes[size]
  const stars = Math.round((score / 100) * 5)

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: bg, borderRadius: 999, padding: s.pad }}>
      <span style={{ fontSize: s.score, fontWeight: 700, color, fontFamily: 'sans-serif', lineHeight: 1 }}>
        {score}
        <span style={{ fontSize: s.label, fontWeight: 400 }}>/100</span>
      </span>
      <span style={{ display: 'flex', gap: 1 }}>
        {[1,2,3,4,5].map(i => (
          <svg key={i} width={s.label + 2} height={s.label + 2} viewBox="0 0 24 24"
            fill={i <= stars ? '#E8A520' : 'none'}
            stroke={i <= stars ? '#E8A520' : '#ccc'}
            strokeWidth="2">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
        ))}
      </span>
      <span style={{ fontSize: s.label, color, fontFamily: 'sans-serif' }}>{label}</span>
    </div>
  )
}
