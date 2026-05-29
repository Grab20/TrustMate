import Link from 'next/link'
import PlatformBadge from '@/components/ui/PlatformBadge'
import TrustScore from '@/components/ui/TrustScore'

export default function DriverCard({ driver }: { driver: any }) {
  const profile = driver.profiles
  const initials = profile?.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase() || '?'

  return (
    <div style={{ background: '#fafaf8', borderRadius: 16, border: '1px solid #ececea', padding: 24, transition: 'transform 0.2s' }}
      onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16 }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#d4edd8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#1a5c28', fontFamily: 'sans-serif', flexShrink: 0 }}>
          {initials}
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#0d1f0e' }}>{profile?.full_name || 'Driver'}</h3>
          <p style={{ margin: 0, fontSize: 13, color: '#888', fontFamily: 'sans-serif' }}>{profile?.location || 'Location not set'}</p>
        </div>
      </div>
      <div style={{ fontSize: 13, fontFamily: 'sans-serif', color: '#555', lineHeight: 2, marginBottom: 12 }}>
        <div>🕐 <strong>Years Driving:</strong> {driver.years_driving}+ yrs</div>
        <div>🅿️ <strong>Safe Parking:</strong> {driver.safe_parking ? 'Yes' : 'No'}</div>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14, alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: '#888', fontFamily: 'sans-serif' }}>Platforms:</span>
        {driver.platforms?.map((p: string) => <PlatformBadge key={p} name={p} />)}
      </div>
      <div style={{ padding: '12px 0', borderTop: '1px solid #ececea', borderBottom: '1px solid #ececea', marginBottom: 16 }}>
        <TrustScore score={driver.trust_score} size="md" />
      </div>
      <div style={{ fontSize: 12, fontFamily: 'sans-serif', color: '#666', lineHeight: 2 }}>
        <div>🚗 Rentals Completed: <strong>{driver.rentals_completed}</strong></div>
        <div>⚠️ Late Payments: <strong>{driver.late_payments}</strong> (Last 3 yrs)</div>
        <div>💥 Accidents: <strong>{driver.accidents}</strong></div>
      </div>
      <div style={{ marginTop: 20 }}>
        <Link href={`/drivers/${driver.id}`} style={{ display: 'block', textAlign: 'center', background: 'none', border: '1px solid #1a2e1a', color: '#1a2e1a', borderRadius: 8, padding: '9px', fontSize: 13, textDecoration: 'none', fontFamily: 'sans-serif' }}>
          View Profile
        </Link>
      </div>
    </div>
  )
}
