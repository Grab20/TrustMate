import Link from 'next/link'
import PlatformBadge from '@/components/ui/PlatformBadge'
import type { Car } from '@/lib/types'

export default function CarCard({ car }: { car: Car & { profiles?: any } }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 16, border: '1px solid #ececea',
      overflow: 'hidden', transition: 'transform 0.2s',
    }}
      onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
      <div style={{ height: 180, background: '#f0ede6', overflow: 'hidden', position: 'relative' }}>
        {car.image_url ? (
          <img src={car.image_url} alt={`${car.make} ${car.model}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>🚗</div>
        )}
        <span style={{
          position: 'absolute', top: 12, right: 12,
          background: car.status === 'available' ? '#d4edd8' : '#fee2e2',
          color: car.status === 'available' ? '#1a5c28' : '#8b2020',
          fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, fontFamily: 'sans-serif'
        }}>
          {car.status === 'available' ? 'Available' : 'Rented'}
        </span>
      </div>
      <div style={{ padding: '16px 20px 20px' }}>
        <h3 style={{ margin: '0 0 2px', fontSize: 18, fontWeight: 700, color: '#0d1f0e' }}>
          {car.make} {car.model}
        </h3>
        <p style={{ margin: '0 0 12px', color: '#888', fontSize: 13, fontFamily: 'sans-serif' }}>{car.year}</p>
        <div style={{ fontSize: 13, fontFamily: 'sans-serif', color: '#555', lineHeight: 2 }}>
          <div>📍 <strong>Location:</strong> {car.location}</div>
          <div>💰 <strong>Deposit:</strong> {car.deposit || 'None'}</div>
          <div>🛡️ <strong>Insurance:</strong> {car.insurance ? 'Included' : 'No'}</div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '12px 0', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#888', fontFamily: 'sans-serif' }}>Platforms:</span>
          {car.platforms?.map(p => <PlatformBadge key={p} name={p} />)}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#1a2e1a' }}>
            R{car.price_per_week.toLocaleString()}
            <span style={{ fontSize: 13, fontWeight: 400, color: '#888', fontFamily: 'sans-serif' }}> / week</span>
          </span>
          <Link href={`/cars/${car.id}`} style={{
            background: '#1a2e1a', color: '#fff', borderRadius: 8,
            padding: '9px 18px', fontSize: 13, textDecoration: 'none', fontFamily: 'sans-serif'
          }}>
            View & Apply
          </Link>
        </div>
      </div>
    </div>
  )
}
