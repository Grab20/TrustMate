import { createClient } from '@/lib/supabase/server'
import DriverCard from '@/components/drivers/DriverCard'

export default async function DriversPage() {
  const supabase = await createClient()

  const { data: drivers } = await supabase
    .from('driver_profiles')
    .select('*, profiles(full_name, location, avatar_url)')
    .order('trust_score', { ascending: false })

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#0d1f0e', margin: '0 0 8px', letterSpacing: '-0.5px' }}>Verified Drivers</h1>
        <p style={{ margin: 0, color: '#888', fontFamily: 'sans-serif' }}>
          {drivers?.length || 0} drivers with verified Trust Scores
        </p>
      </div>

      {drivers && drivers.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
          {drivers.map((d: any) => <DriverCard key={d.id} driver={d} />)}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <p style={{ fontSize: 48, marginBottom: 16 }}>👤</p>
          <h3 style={{ fontSize: 20, color: '#0d1f0e', marginBottom: 8 }}>No drivers yet</h3>
          <p style={{ color: '#888', fontFamily: 'sans-serif' }}>Be the first to join as a driver</p>
        </div>
      )}
    </div>
  )
}
