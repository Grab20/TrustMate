import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import CarCard from '@/components/cars/CarCard'
import DriverCard from '@/components/drivers/DriverCard'

export default async function Home() {
  const supabase = await createClient()

  const { data: cars } = await supabase
    .from('cars')
    .select('*, profiles(full_name, location)')
    .eq('status', 'available')
    .limit(3)

  const { data: drivers } = await supabase
    .from('driver_profiles')
    .select('*, profiles(full_name, location, avatar_url)')
    .order('trust_score', { ascending: false })
    .limit(3)

  return (
    <div>
      {/* HERO */}
      <section style={{ background: 'linear-gradient(160deg, #f0ede6 0%, #e8f4ec 100%)', padding: '80px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <span style={{ background: '#d4edd8', color: '#1a5c28', fontSize: 12, fontWeight: 600, padding: '5px 14px', borderRadius: 20, fontFamily: 'sans-serif', letterSpacing: '0.5px' }}>
            SOUTH AFRICA&apos;S #1 E-HAILING FLEET PLATFORM
          </span>
          <h1 style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.15, margin: '24px 0 16px', letterSpacing: '-1.5px', color: '#0d1f0e' }}>
            Connect e-Hailing<br />Car Owners &amp; Drivers
          </h1>
          <p style={{ fontSize: 18, color: '#4a5a4a', marginBottom: 40, fontFamily: 'sans-serif', lineHeight: 1.6 }}>
            Rent vehicles safely using verified Trust Scores
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/cars" style={{ background: '#1a2e1a', color: '#fff', borderRadius: 10, padding: '14px 32px', fontSize: 15, textDecoration: 'none', fontFamily: 'sans-serif' }}>
              Browse Cars
            </Link>
            <Link href="/auth/register" style={{ background: '#fff', color: '#1a2e1a', borderRadius: 10, padding: '14px 32px', fontSize: 15, textDecoration: 'none', fontFamily: 'sans-serif', border: '1px solid #d0d0cc' }}>
              List My Car
            </Link>
          </div>
        </div>
      </section>

      {/* WHY TRUSTMATE */}
      <section style={{ padding: '72px 40px', background: '#fff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 34, fontWeight: 700, marginBottom: 48, color: '#0d1f0e', letterSpacing: '-0.5px' }}>Why use TrustMate?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {[
              { icon: '🛡️', title: 'Owners approve drivers using Trust Score', desc: 'Comprehensive driver verification built from real rental history' },
              { icon: '⚠️', title: 'Late payment & accident transparency', desc: 'Full history of payments and incidents — no surprises' },
              { icon: '👤', title: 'Drivers build rental history & owner reviews', desc: 'Reputation-based trust system that rewards reliable drivers' },
              { icon: '📄', title: 'Fraud-checked document verification', desc: 'Secure and verified documentation for every driver on the platform' },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, padding: 24, borderRadius: 12, border: '1px solid #ececea', background: '#fafaf8' }}>
                <span style={{ fontSize: 28 }}>{f.icon}</span>
                <div>
                  <h4 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700, color: '#1a2e1a' }}>{f.title}</h4>
                  <p style={{ margin: 0, fontSize: 14, color: '#666', fontFamily: 'sans-serif', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AVAILABLE CARS */}
      <section style={{ padding: '72px 40px', background: '#fafaf8' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 30, fontWeight: 700, color: '#0d1f0e', margin: 0 }}>Available Cars Near You</h2>
            <Link href="/cars" style={{ fontSize: 14, color: '#1a5c28', fontFamily: 'sans-serif', textDecoration: 'none' }}>View all →</Link>
          </div>
          {cars && cars.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {cars.map((car: any) => <CarCard key={car.id} car={car} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#888', fontFamily: 'sans-serif' }}>
              <p>No cars listed yet. <Link href="/cars/new" style={{ color: '#1a5c28' }}>Be the first to list yours →</Link></p>
            </div>
          )}
        </div>
      </section>

      {/* VERIFIED DRIVERS */}
      <section style={{ padding: '72px 40px', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 30, fontWeight: 700, color: '#0d1f0e', margin: 0 }}>Top Verified Drivers</h2>
            <Link href="/drivers" style={{ fontSize: 14, color: '#1a5c28', fontFamily: 'sans-serif', textDecoration: 'none' }}>View all →</Link>
          </div>
          {drivers && drivers.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {drivers.map((d: any) => <DriverCard key={d.id} driver={d} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#888', fontFamily: 'sans-serif' }}>
              <p>No drivers yet. <Link href="/auth/register" style={{ color: '#1a5c28' }}>Register as a driver →</Link></p>
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '72px 40px', background: '#f0ede6' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 34, fontWeight: 700, marginBottom: 48, color: '#0d1f0e', letterSpacing: '-0.5px' }}>How it works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: '#1a2e1a', marginBottom: 20 }}>🚗 For Drivers</h4>
              {['Create your profile & upload documents','Build your Trust Score with rentals','Browse & apply to cars in your area','Get approved by owners via Trust Score'].map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'flex-start' }}>
                  <div style={{ minWidth: 26, height: 26, borderRadius: '50%', background: '#1a2e1a', color: '#fff', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', fontWeight: 700 }}>{i+1}</div>
                  <span style={{ fontSize: 14, color: '#444', fontFamily: 'sans-serif', lineHeight: 1.6 }}>{s}</span>
                </div>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: '#1a2e1a', marginBottom: 20 }}>🏠 For Owners</h4>
              {['List your car with pricing & requirements','Review driver applications & Trust Scores','Approve drivers you trust','Rate drivers after each rental period'].map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'flex-start' }}>
                  <div style={{ minWidth: 26, height: 26, borderRadius: '50%', background: '#1a5c28', color: '#fff', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', fontWeight: 700 }}>{i+1}</div>
                  <span style={{ fontSize: 14, color: '#444', fontFamily: 'sans-serif', lineHeight: 1.6 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '72px 40px', background: '#1a2e1a', textAlign: 'center' }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, color: '#fff', marginBottom: 16, letterSpacing: '-0.5px' }}>Ready to get started?</h2>
        <p style={{ color: '#9ab89c', fontSize: 16, marginBottom: 36, fontFamily: 'sans-serif' }}>Join TrustMate — South Africa&apos;s trusted e-hailing fleet platform</p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <Link href="/auth/register?role=owner" style={{ background: '#fff', color: '#1a2e1a', borderRadius: 10, padding: '14px 32px', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>List My Car</Link>
          <Link href="/auth/register?role=driver" style={{ background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,0.4)', borderRadius: 10, padding: '14px 32px', fontSize: 15, fontFamily: 'sans-serif', textDecoration: 'none' }}>Find a Car to Drive</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0d1a0e', padding: '32px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <span style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>TrustMate</span>
        <p style={{ color: '#4a6b4c', fontSize: 13, margin: 0, fontFamily: 'sans-serif' }}>© 2026 TrustMate. Connecting South Africa&apos;s e-hailing ecosystem.</p>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <a key={l} href="#" style={{ color: '#4a6b4c', fontSize: 13, textDecoration: 'none', fontFamily: 'sans-serif' }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}
