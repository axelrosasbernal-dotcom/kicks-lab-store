import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Mail, Lock, LogIn, UserPlus, AlertCircle, Sparkles } from 'lucide-react';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión con Google');
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        if (data.user) {
          setMessage('¡Inicio de sesión exitoso! Redirigiendo...');
          setTimeout(() => onAuthSuccess(data.user), 1000);
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin
          }
        });
        if (error) throw error;
        if (data.user) {
          setMessage('¡Registro exitoso! Por favor revisa tu correo para confirmar tu cuenta o inicia sesión.');
          setEmail('');
          setPassword('');
        }
      }
    } catch (err) {
      console.error(err);
      if (err.message === 'Failed to fetch') {
        setError('Error de conexión: No se pudo contactar a Supabase. Verifica que hayas configurado las credenciales correctas en tu archivo .env.');
      } else {
        setError(err.message || 'Ocurrió un error inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '3rem 1.5rem',
      minHeight: '60vh'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '420px',
        width: '100%',
        padding: '2.5rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(255, 63, 63, 0.1)'
      }}>
        {/* Header Icon */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            background: 'var(--accent-gradient)',
            padding: '1rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 25px rgba(255, 63, 63, 0.3)'
          }}>
            <Sparkles size={28} color="#fff" />
          </div>
        </div>

        {/* Title */}
        <h2 style={{
          textAlign: 'center',
          fontSize: '1.75rem',
          fontWeight: 800,
          marginBottom: '0.5rem',
          fontFamily: 'var(--font-heading)'
        }}>
          {isLogin ? '¡Bienvenido de vuelta!' : 'Crea tu Cuenta'}
        </h2>
        <p style={{
          textAlign: 'center',
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          marginBottom: '2rem'
        }}>
          {isLogin
            ? 'Inicia sesión para acceder a tu cuenta.'
            : 'Regístrate para explorar nuestro catálogo.'}
        </p>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            background: 'rgba(255,255,255,0.05)',
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: googleLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            marginBottom: '1.25rem',
            opacity: googleLoading ? 0.7 : 1,
            fontFamily: 'inherit'
          }}
          onMouseEnter={e => { if (!googleLoading) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
        >
          {googleLoading ? (
            <span style={{
              width: '18px',
              height: '18px',
              border: '2px solid rgba(255,255,255,0.2)',
              borderTopColor: '#fff',
              borderRadius: '50%',
              animation: 'spin 0.6s linear infinite',
              display: 'inline-block'
            }} />
          ) : (
            <GoogleIcon />
          )}
          {googleLoading ? 'Redirigiendo...' : 'Continuar con Google'}
        </button>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>o continúa con correo</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border-color)',
          padding: '0.25rem',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1.5rem'
        }}>
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(''); setMessage(''); }}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '6px',
              border: 'none',
              background: isLogin ? 'var(--accent-gradient)' : 'transparent',
              color: isLogin ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Ingresar
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(''); setMessage(''); }}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '6px',
              border: 'none',
              background: !isLogin ? 'var(--accent-gradient)' : 'transparent',
              color: !isLogin ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Registrarse
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div style={{
              background: 'rgba(34, 197, 94, 0.12)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              color: '#4ade80',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              marginBottom: '1.25rem'
            }}>
              {message}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="auth-email">Correo Electrónico</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                id="auth-email"
                type="email"
                required
                className="form-input"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label" htmlFor="auth-password">Contraseña</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                id="auth-password"
                type="password"
                required
                minLength={6}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
            disabled={loading}
          >
            {loading ? (
              <span style={{
                width: '18px',
                height: '18px',
                border: '2px solid rgba(255,255,255,0.2)',
                borderTopColor: '#fff',
                borderRadius: '50%',
                animation: 'spin 0.6s linear infinite',
                display: 'inline-block'
              }} />
            ) : isLogin ? (
              <>
                <LogIn size={18} />
                <span>Iniciar Sesión</span>
              </>
            ) : (
              <>
                <UserPlus size={18} />
                <span>Crear Cuenta</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
