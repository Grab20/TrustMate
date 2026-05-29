const styles: Record<string, { bg: string; color: string }> = {
  Uber:    { bg: '#1a1a1a', color: '#fff' },
  Bolt:    { bg: '#34C759', color: '#fff' },
  inDrive: { bg: '#FF6B35', color: '#fff' },
}

export default function PlatformBadge({ name }: { name: string }) {
  const s = styles[name] || { bg: '#888', color: '#fff' }
  return (
    <span style={{
      background: s.bg,
      color: s.color,
      fontSize: 11,
      fontWeight: 600,
      padding: '3px 9px',
      borderRadius: 20,
      fontFamily: 'sans-serif',
      whiteSpace: 'nowrap',
    }}>
      {name}
    </span>
  )
}
