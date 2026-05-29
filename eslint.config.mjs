'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ApplyButton({ carId, userId }: { carId: string; userId?: string }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [applied, setApplied] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleApply = async () => {
    if (!userId) { router.push('/auth/login'); return }
    setLoading(true)
    const { error } = await supabase.from('applications').insert({
      car_id: carId,
      driver_id: userId,
      message: message || null,
      status: 'pending',
    })
    if (error) {
      alert(error.message)
      setLoading(false)
    } else {
      setApplied(true)
    }
  }

  if (applied) {
    return (
      <div style={{ background: '#d4edd8', borderRadius: 10, padding: '16px', textAlign: 'center' }}>
        <p style={{ margin: 0, fontFamily: 'sans-serif', fontSize: 14, color: '#1a5c28', fontWeight: 700 }}>
          ✓ Application sent!
        </p>
        <p style={{ margin: '4px 0 0', fontFamily: 'sans-serif', fontSize: 13, color: '#2a7c3a' }}>
          The owner will review your Trust Score
        </p>
      </div>
    )
  }

  return (
    <div>
      <textarea
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Optional message to the owner..."
        rows={3}
        style={{ width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 13, fontFamily: 'sans-serif', resize: 'vertical', marginBottom: 12, boxSizing: 'border-box', outline: 'none' }}
      />
      <button onClick={handleApply} disabled={loading}
        style={{ width: '100%', background: '#1a2e1a', color: '#fff', border: 'none', borderRadius: 8, padding: '13px', cursor: loading ? 'default' : 'pointer', fontSize: 15, fontFamily: 'sans-serif', opacity: loading ? 0.7 : 1 }}>
        {!userId ? 'Login to Apply' : loading ? 'Sending...' : 'Apply for this Car →'}
      </button>
    </div>
  )
}
