'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #f0ede6 0%, #e8f4ec 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 40, width: '100%', maxWidth: 420, border: '1px solid #ececea' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ fontSize: 22, fontWeight: 700, color: '#1a2e1a', textDecoration: 'none' }}>TrustMate</Link>
          <h2 style={{ margin: '12px 0 4px', fontSize: 24, fontWeight: 700, color: '#0d1f0e' }}>Welcome back</h2>
          <p style={{ margin: 0, color: '#888', fontSize: 14, fontFamily: 'sans-serif' }}>Sign in to your account</p>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#8b2020', padding: '10px 14px', borderRadius: 8, fontSize: 13, fontFamily: 'sans-serif', marginBottom: 20 }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontFamily: 'sans-serif', color: '#555', marginBottom: 6, fontWeight: 600 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{ width: '100%', padding: '11px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14, fontFamily: 'sans-serif', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontFamily: 'sans-serif', color: '#555', marginBottom: 6, fontWeight: 600 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{ width: '100%', padding: '11px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14, fontFamily: 'sans-serif', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <button onClick={handleLogin} disabled={loading}
            style={{ background: '#1a2e1a', color: '#fff', border: 'none', borderRadius: 8, padding: '13px', cursor: loading ? 'default' : 'pointer', fontSize: 15, fontFamily: 'sans-serif', opacity: loading ? 0.7 : 1, marginTop: 4 }}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, fontFamily: 'sans-serif', color: '#666' }}>
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" style={{ color: '#1a5c28', textDecoration: 'none', fontWeight: 600 }}>Register free</Link>
        </p>
      </div>
    </div>
  )
}
