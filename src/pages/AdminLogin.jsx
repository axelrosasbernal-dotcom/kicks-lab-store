import React, { useState } from 'react';
import { supabase } from '../integrations/supabase/supabaseClient';
import { ADMIN_EMAIL } from '../constants/admin';
import { Lock, LogIn, AlertCircle, Shield } from 'lucide-react';

// Login exclusivo del panel de administración (/admin).
// No pide email ni permite registrarse: la cuenta admin es única y fija,
// así que sólo se ingresa la contraseña.
export default function AdminLogin({ onAuthSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password,
      });
      if (error) throw error;
      if (data.user) onAuthSuccess(data.user);
    } catch (err) {
      console.error(err);
      if (err.message === 'Failed to fetch') {
        setError('Error de conexión: no se pudo contactar a Supabase. Verificá las credenciales en el archivo .env.');
      } else if (/invalid login credentials/i.test(err.message || '')) {
        setError('Contraseña incorrecta.');
      } else {
        setError(err.message || 'Ocurrió un error inesperado');
      }
      setPassword('');
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
        maxWidth: '400px',
        width: '100%',
        padding: '2.5rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(255, 63, 63, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            background: 'var(--accent-gradient)',
            padding: '1rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 25px rgba(255, 63, 63, 0.3)'
          }}>
            <Shield size={28} color="#fff" />
          </div>
        </div>

        <h2 style={{
          textAlign: 'center',
          fontSize: '1.6rem',
          fontWeight: 800,
          marginBottom: '0.5rem',
          fontFamily: 'var(--font-heading)'
        }}>
          Panel de Administración
        </h2>
        <p style={{
          textAlign: 'center',
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          marginBottom: '2rem'
        }}>
          Ingresá la contraseña para continuar.
        </p>

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

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label" htmlFor="admin-password">Contraseña</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                id="admin-password"
                type="password"
                required
                autoFocus
                autoComplete="current-password"
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
            ) : (
              <>
                <LogIn size={18} />
                <span>Ingresar</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
