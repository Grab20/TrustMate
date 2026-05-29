import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PlatformBadge from '@/components/ui/PlatformBadge'
import ApplyButton from '@/components/cars/ApplyButton'

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: car } = await supabase
    .from('cars')
    .select('*, profiles(full_name, phone, location)')
    .eq('id', id)
    .single()

  if (!car) notFound()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: existingApp } = user ? await supabase
    .from('applications')
    .select('id, status')
    .eq('car_id', id)
    .eq('driver_id', user.id)
    .single() : { data: null }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
      <Link href="/cars" style={{ color: '#888', fontSize: 14, fontFamily: 'sans-serif', textDecoration: 'none' }}>← Back to cars</Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32, marginTop: 24 }}>
        {/* Left: car info */}
        <div>
          <div style={{ borderRadius: 16, overflow: 'hidden', background: '#f0ede6', height: 320, marginBottom: 24 }}>
            {car.image_url ? (
              <img src={car.image_url} alt={`${car.make} ${car.model}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80 }}>🚗</div>
            )}
          </div>

          <h1 style={{ fontSize: 32, fontWeight: 700, color: '#0d1f0e', margin: '0 0 4px', letterSpacing: '-0.5px' }}>
            {car.make} {car.model}
          </h1>
          <p style={{ margin: '0 0 20px', color: '#888', fontFamily: 'sans-serif' }}>{car.year} · {car.location}</p>

          {car.description && (
            <p style={{ fontSize: 15, color: '#555', fontFamily: 'sans-serif', lineHeight: 1.7, marginBottom: 24 }}>{car.description}</p>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { icon: '💰', label: 'Weekly Rate', value: `R${car.price_per_week?.toLocaleString()}/week` },
              { icon: '🔐', label: 'Deposit', value: car.deposit || 'None required' },
              { icon: '🛡️', label: 'Insurance', value: car.insurance ? 'Included' : 'Not included' },
              { icon: '📍', label: 'Location', value: car.location },
            ].map(item => (
              <div key={item.label} style={{ background: '#fafaf8', borderRadius: 10, padding: '14px 16px', border: '1px solid #ececea' }}>
                <p style={{ margin: '0 0 2px', fontSize: 12, color: '#888', fontFamily: 'sans-serif' }}>{item.icon} {item.label}</p>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0d1f0e' }}>{item.value}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20 }}>
            <p style={{ fontSize: 13, color: '#888', fontFamily: 'sans-serif', marginBottom: 8 }}>Platforms accepted:</p>
            <div style={{ display: 'flex', gap: 8 }}>
              {car.platforms?.map((p: string) => <PlatformBadge key={p} name={p} />)}
            </div>
          </div>
        </div>

        {/* Right: apply card */}
        <div>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #ececea', padding: 28, position: 'sticky', top: 80 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#1a2e1a', marginBottom: 4 }}>
              R{car.price_per_week?.toLocaleString()}<span style={{ fontSize: 16, fontWeight: 400, color: '#888', fontFamily: 'sans-serif' }}>/week</span>
            </div>
            <p style={{ margin: '0 0 20px', color: '#888', fontSize: 13, fontFamily: 'sans-serif' }}>
              Posted by {car.profiles?.full_name}
            </p>

            {existingApp ? (
              <div style={{ background: existingApp.status === 'approved' ? '#d4edd8' : '#fef3c7', borderRadius: 10, padding: '14px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontFamily: 'sans-serif', fontSize: 14, color: existingApp.status === 'approved' ? '#1a5c28' : '#7c5c00', fontWeight: 600 }}>
                  Application {existingApp.status}
                </p>
              </div>
            ) : (
              <ApplyButton carId={car.id} userId={user?.id} />
            )}

            <div style={{ marginTop: 20, padding: '14px', background: '#f0ede6', borderRadius: 10 }}>
              <p style={{ margin: '0 0 6px', fontSize: 13, fontWeight: 700, color: '#1a2e1a' }}>🛡️ TrustMate Protection</p>
              <p style={{ margin: 0, fontSize: 12, color: '#666', fontFamily: 'sans-serif', lineHeight: 1.6 }}>
                All drivers are verified with Trust Scores based on their rental history.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
