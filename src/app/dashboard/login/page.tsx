'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ArrowLeft, Eye, EyeOff, Lock, User } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      });

      if (!response.ok) {
        setError('Login yoki parol noto\'g\'ri');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Server bilan bog\'lanishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          background:
            'radial-gradient(ellipse at 30% 30%, rgba(192,131,90,0.06) 0%, transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(80,144,216,0.04) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      <form
        className="login-card"
        onSubmit={handleLogin}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <div
          style={{
            marginBottom: 32,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 'var(--radius-lg)',
              background: 'var(--accent-glow)',
              border: '1px solid var(--border-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <Image
              src="/logo.png"
              alt="Artline Decor Logo"
              width={64}
              height={64}
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', color: 'var(--accent-gold)', marginBottom: 4 }}>
              ARTLINE DECOR
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Admin boshqaruv paneli
            </p>
          </div>
        </div>

        <div className="input-group" style={{ marginBottom: 16, textAlign: 'left' }}>
          <label>Login</label>
          <div style={{ position: 'relative' }}>
            <User
              size={16}
              style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              className="input-field"
              placeholder="Admin logini"
              value={login}
              onChange={(e) => {
                setLogin(e.target.value);
                setError('');
              }}
              style={{ paddingLeft: 40 }}
              autoFocus
              autoComplete="username"
            />
          </div>
        </div>

        <div className="input-group" style={{ marginBottom: 8, textAlign: 'left' }}>
          <label>Parol</label>
          <div style={{ position: 'relative' }}>
            <Lock
              size={16}
              style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type={showPass ? 'text' : 'password'}
              className="input-field"
              placeholder="Admin paroli"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              style={{ paddingLeft: 40, paddingRight: 44 }}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              aria-label={showPass ? 'Parolni yashirish' : 'Parolni ko\'rsatish'}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                display: 'flex',
                padding: 4,
              }}
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {error && (
          <div
            style={{
              color: 'var(--error)',
              fontSize: '0.85rem',
              marginBottom: 12,
              padding: '8px 12px',
              background: 'rgba(216,88,88,0.08)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(216,88,88,0.2)',
              textAlign: 'left',
            }}
          >
            <AlertTriangle size={14} style={{ marginRight: 6, verticalAlign: 'text-bottom' }} />
            {error}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{
            width: '100%',
            justifyContent: 'center',
            marginTop: 16,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  border: '2px solid rgba(10,14,24,0.3)',
                  borderTopColor: '#0a0e18',
                  animation: 'spin 0.7s linear infinite',
                  display: 'inline-block',
                }}
              />
              Kirilmoqda...
            </span>
          ) : (
            'Kirish'
          )}
        </button>

        <a
          href="/"
          style={{
            display: 'block',
            marginTop: 20,
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            textAlign: 'center',
          }}
        >
          <ArrowLeft size={14} style={{ marginRight: 6, verticalAlign: 'text-bottom' }} />
          Bosh sahifaga qaytish
        </a>
      </form>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
