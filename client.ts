import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import TrustScore from '@/components/ui/TrustScore'
import PlatformBadge from '@/components/ui/PlatformBadge'
import RateDriverForm from '@/components/drivers/RateDriverForm'

export default async function DriverProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: driver } = await supabase
    .from('driver_profiles')
    .select('*, profiles(full_name, location, phone, created_at)')
    .eq('id', id)
    .single()

  if (!driver) notFound()

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, profiles(full_name)')
    .eq('driver_id', id)
    .order('created_at', { ascending: false })

  const { data: { user } } = await supabase.auth.getUser()

  const profile = driver.profiles
  const initials = profile?.full_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || '?'
  const avgRating = reviews && reviews.length > 0
    ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
      <Link href="/drivers" style={{ color: '#888', fontSize: 14, fontFamily: 'sans-serif', textDecoration: 'none' }}>← Back to drivers</Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, marginTop: 24 }}>
        {/* Left: profile */}
        <div>
          {/* Header */}
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 28 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#d4edd8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: '#1a5c28', fontFamily: 'sans-serif', flexShrink: 0 }}>
              {initials}
            </div>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0d1f0e', margin: '0 0 4px', letterSpacing: '-0.5px' }}>{profile?.full_name}</h1>
              <p style={{ margin: '0 0 8px', color: '#888', fontFamily: 'sans-serif', fontSize: 14 }}>📍 {profile?.location || 'Location not set'}</p>
              <TrustScore score={driver.trust_score} size="md" />
            </div>
          </div>

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
            {[
              { icon: '🚗', label: 'Rentals', value: driver.rentals_completed },
              { icon: '⚠️', label: 'Late Payments', value: driver.late_payments },
              { icon: '💥', label: 'Accidents', value: driver.accidents },
            ].map(s => (
              <div key={s.label} style={{ background: '#fafaf8', borderRadius: 12, border: '1px solid #ececea', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#0d1f0e', fontFamily: 'sans-serif' }}>{s.value}</div>
                <div style={{ fontSize: 12, color: '#888', fontFamily: 'sans-serif' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Details */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #ececea', padding: '20px 24px', marginBottom: 28 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, color: '#0d1f0e' }}>Driver details</h3>
            <div style={{ fontSize: 14, fontFamily: 'sans-serif', color: '#555', lineHeight: 2.2 }}>
              <div>🕐 <strong>Experience:</strong> {driver.years_driving}+ years driving</div>
              <div>🅿️ <strong>Safe Parking:</strong> {driver.safe_parking ? 'Yes' : 'No'}</div>
              <div>📋 <strong>License:</strong> {driver.license_verified ? '✅ Verified' : 'Not yet verified'}</div>
              <div>🪪 <strong>ID:</strong> {driver.id_verified ? '✅ Verified' : 'Not yet verified'}</div>
            </div>
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 13, color: '#888', fontFamily: 'sans-serif', marginBottom: 8 }}>Platforms:</p>
              <div style={{ display: 'flex', gap: 8 }}>
                {driver.platforms?.map((p: string) => <PlatformBadge key={p} name={p} />)}
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0d1f0e', marginBottom: 16 }}>
              Reviews {avgRating && <span style={{ fontSize: 14, color: '#888', fontWeight: 400, fontFamily: 'sans-serif' }}>· {avgRating} avg · {reviews?.length} total</span>}
            </h3>
            {reviews && reviews.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {reviews.map((r: any) => (
                  <div key={r.id} style={{ background: '#fff', borderRadius: 12, border: '1px solid #ececea', padding: '16px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: '#0d1f0e' }}>{r.profiles?.full_name}</span>
                      <div style={{ display: 'flex', gap: 2 }}>
                        {[1,2,3,4,5].map(i => (
                          <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= r.rating ? '#E8A520' : 'none'} stroke={i <= r.rating ? '#E8A520' : '#ccc'} strokeWidth="2">
                            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    {r.comment && <p style={{ margin: 0, fontSize: 14, color: '#555', fontFamily: 'sans-serif', lineHeight: 1.6 }}>{r.comment}</p>}
                    <p style={{ margin: '8px 0 0', fontSize: 12, color: '#bbb', fontFamily: 'sans-serif' }}>
                      {new Date(r.created_at).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#888', fontFamily: 'sans-serif', fontSize: 14 }}>No reviews yet</p>
            )}
          </div>
        </div>

        {/* Right: rate + contact */}
        <div>
          {user && user.id !== driver.user_id && (
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #ececea', padding: 24, marginBottom: 20, position: 'sticky', top: 80 }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 16, color: '#0d1f0e' }}>Rate this driver</h3>
              <RateDriverForm driverProfileId={id} reviewerId={user.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
