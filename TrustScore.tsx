'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const PLATFORMS = ['Uber', 'Bolt', 'inDrive']

export default function NewCarPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    make: '', model: '', year: new Date().getFullYear(),
    location: '', deposit: '', insurance: false,
    platforms: [] as string[], price_per_week: '',
    description: '', image_url: '',
  })

  const togglePlatform = (p: string) => {
    setForm(f => ({
      ...f,
      platforms: f.platforms.includes(p) ? f.platforms.filter(x => x !== p) : [...f.platforms, p]
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    if (!form.make || !form.model || !form.location || !form.price_per_week) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    const { error } = await supabase.from('cars').insert({
      owner_id: user.id,
      make: form.make,
      model: form.model,
      year: form.year,
      location: form.location,
      deposit: form.deposit || null,
      insurance: form.insurance,
      platforms: form.platforms,
      price_per_week: parseInt(form.price_per_week),
      description: form.description || null,
      image_url: form.image_url || null,
      status: 'available',
    })

    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard')
  }

  const inputStyle = { width: '100%', padding: '11px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14, fontFamily: 'sans-serif', outline: 'none', boxSizing: 'border-box' as const }
  const labelStyle = { display: 'block' as const, fontSize: 13, fontFamily: 'sans-serif', color: '#555', marginBottom: 6, fontWeight: 600 as const }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ marginBottom: 32 }}>
        <Link href="/dashboard" style={{ color: '#888', fontSize: 14, fontFamily: 'sans-serif', textDecoration: 'none' }}>← Back to dashboard</Link>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0d1f0e', margin: '12px 0 6px', letterSpacing: '-0.5px' }}>List your car</h1>
        <p style={{ margin: 0, color: '#888', fontFamily: 'sans-serif' }}>Connect with verified e-hailing drivers</p>
      </div>

      {error && (
        <div style={{ background: '#fee2e2', color: '#8b2020', padding: '10px 14px', borderRadius: 8, fontSize: 13, fontFamily: 'sans-serif', marginBottom: 20 }}>
          {error}
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #ececea', padding: 32 }}>
        <h3 style={{ margin: '0 0 20px', fontSize: 16, color: '#0d1f0e' }}>Vehicle details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Make *</label>
            <input value={form.make} onChange={e => setForm({...form, make: e.target.value})} placeholder="Toyota" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Model *</label>
            <input value={form.model} onChange={e => setForm({...form, model: e.target.value})} placeholder="Corolla" style={inputStyle} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Year *</label>
            <input type="number" value={form.year} onChange={e => setForm({...form, year: parseInt(e.target.value)})} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Location *</label>
            <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Sandton, Johannesburg" style={inputStyle} />
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Image URL (optional)</label>
          <input value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} placeholder="https://..." style={inputStyle} />
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #ececea', margin: '24px 0' }} />
        <h3 style={{ margin: '0 0 20px', fontSize: 16, color: '#0d1f0e' }}>Rental terms</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Weekly rate (R) *</label>
            <input type="number" value={form.price_per_week} onChange={e => setForm({...form, price_per_week: e.target.value})} placeholder="2500" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Deposit required</label>
            <input value={form.deposit} onChange={e => setForm({...form, deposit: e.target.value})} placeholder="R5,000 or leave blank" style={inputStyle} />
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.insurance} onChange={e => setForm({...form, insurance: e.target.checked})}
              style={{ width: 16, height: 16, cursor: 'pointer' }} />
            Insurance included
          </label>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Platforms allowed</label>
          <div style={{ display: 'flex', gap: 10 }}>
            {PLATFORMS.map(p => (
              <button key={p} type="button" onClick={() => togglePlatform(p)}
                style={{
                  padding: '8px 16px', borderRadius: 20, border: '1px solid',
                  borderColor: form.platforms.includes(p) ? '#1a2e1a' : '#e0e0e0',
                  background: form.platforms.includes(p) ? '#1a2e1a' : '#fff',
                  color: form.platforms.includes(p) ? '#fff' : '#444',
                  cursor: 'pointer', fontSize: 13, fontFamily: 'sans-serif',
                }}>
                {p}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Description (optional)</label>
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
            placeholder="Any additional info for drivers..."
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' as const }} />
        </div>

        <button onClick={handleSubmit} disabled={loading}
          style={{ width: '100%', background: '#1a2e1a', color: '#fff', border: 'none', borderRadius: 8, padding: '14px', cursor: loading ? 'default' : 'pointer', fontSize: 15, fontFamily: 'sans-serif', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Listing car...' : 'List My Car →'}
        </button>
      </div>
    </div>
  )
}
