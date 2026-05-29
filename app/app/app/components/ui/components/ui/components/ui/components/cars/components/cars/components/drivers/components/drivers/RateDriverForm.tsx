'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function RateDriverForm({ driverProfileId, reviewerId }: { driverProfileId: string; reviewerId: string }) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleSubmit = async () => {
    if (!rating) return
    setLoading(true)
    const { error } = await supabase.from('reviews').insert({
      reviewer_id: reviewerId,
      driver_id: driverProfileId,
      rating,
      comment: comment || null,
    })
    if (!error) setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '16px 0' }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>✓</div>
        <p style={{ fontFamily: 'sans-serif', fontSize: 14, color: '#1a5c28', fontWeight: 700, margin: 0 }}>Review submitted!</p>
        <p style={{ fontFamily: 'sans-serif', fontSize: 13, color: '#888', margin: '4px 0 0' }}>Trust Score has been updated</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 16 }}>
        {[1,2,3,4,5].map(i => (
          <svg key={i} width="36" height="36" viewBox="0 0 24 24" style={{ cursor: 'pointer' }}
            fill={i <= (hover || rating) ? '#E8A520' : 'none'}
            stroke={i <= (hover || rating) ? '#E8A520' : '#ccc'}
            strokeWidth="2"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(i)}>
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Leave a comment..."
        rows={3}
        style={{ width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 13, fontFamily: 'sans-serif', resize: 'vertical', marginBottom: 12, boxSizing: 'border-box', outline: 'none' }}
      />
      <button onClick={handleSubmit} disabled={!rating || loading}
        style={{ width: '100%', background: rating ? '#1a2e1a' : '#ccc', color: '#fff', border: 'none', borderRadius: 8, padding: '11px', cursor: rating ? 'pointer' : 'default', fontSize: 14, fontFamily: 'sans-serif' }}>
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </div>
  )
}
