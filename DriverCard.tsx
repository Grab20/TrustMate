import { createClient } from '@/lib/supabase/server'
import CarCard from '@/components/cars/CarCard'
import Link from 'next/link'

export default async function CarsPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('cars')
    .select('*, profiles(full_name, location)')
    .eq('status', 'available')
    .order('created_at', { ascending: false })

  if (params.location) query = query.ilike('location', `%${params.location}%`)
  if (params.max_price) query = query.lte('price_per_week', parseInt(params.max_price))
  if (params.platform) query = query.contains('platforms', [params.platform])

  const { data: cars } = await query

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: '#0d1f0e', margin: '0 0 6px', letterSpacing: '-0.5px' }}>Available Cars</h1>
          <p style={{ margin: 0, color: '#888', fontFamily: 'sans-serif', fontSize: 14 }}>
            {cars?.length || 0} cars available for e-hailing
          </p>
        </div>
        <Link href="/cars/new" style={{ background: '#1a2e1a', color: '#fff', borderRadius: 8, padding: '10px 20px', textDecoration: 'none', fontSize: 14, fontFamily: 'sans-serif' }}>
          + List My Car
        </Link>
      </div>

      {/* Filters */}
      <form method="GET" style={{ display: 'flex', gap: 12, marginBottom: 36, flexWrap: 'wrap' }}>
        <input name="location" defaultValue={params.location} placeholder="📍 Location"
          style={{ flex: 1, minWidth: 160, padding: '10px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14, fontFamily: 'sans-serif', outline: 'none' }} />
        <input name="max_price" type="number" defaultValue={params.max_price} placeholder="Max R/week"
          style={{ width: 140, padding: '10px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14, fontFamily: 'sans-serif', outline: 'none' }} />
        <select name="platform" defaultValue={params.platform}
          style={{ width: 160, padding: '10px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14, fontFamily: 'sans-serif', outline: 'none', background: '#fff' }}>
          <option value="">All platforms</option>
          <option value="Uber">Uber</option>
          <option value="Bolt">Bolt</option>
          <option value="inDrive">inDrive</option>
        </select>
        <button type="submit" style={{ background: '#1a2e1a', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', fontSize: 14, fontFamily: 'sans-serif' }}>
          Search
        </button>
        {(params.location || params.max_price || params.platform) && (
          <Link href="/cars" style={{ color: '#888', fontSize: 14, fontFamily: 'sans-serif', textDecoration: 'none', padding: '10px 0', display: 'flex', alignItems: 'center' }}>
            Clear filters ✕
          </Link>
        )}
      </form>

      {cars && cars.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
          {cars.map((car: any) => <CarCard key={car.id} car={car} />)}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <p style={{ fontSize: 48, marginBottom: 16 }}>🚗</p>
          <h3 style={{ fontSize: 20, color: '#0d1f0e', marginBottom: 8 }}>No cars found</h3>
          <p style={{ color: '#888', fontFamily: 'sans-serif', marginBottom: 20 }}>Try adjusting your filters or check back later</p>
          <Link href="/cars/new" style={{ color: '#1a5c28', fontFamily: 'sans-serif', textDecoration: 'none' }}>Be the first to list a car →</Link>
        </div>
      )}
    </div>
  )
}
