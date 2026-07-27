import React from 'react';
import { Sun, Moon, LogOut, Store as StoreIcon } from 'lucide-react';
import logoImg from '../assets/logo.png';

// Barra superior exclusiva de /admin. La Navbar pública (con carrito, secciones
// y links de la tienda) es sólo para los clientes y no se muestra acá.
export default function AdminBar({ user, darkMode, onToggleDarkMode, onSignOut, onGoToStore }) {
  return (
    <nav style={{
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      width: '100%'
    }}>
      <div className="nav-inner" style={{
        maxWidth: '1680px',
        margin: '0 auto',
        padding: '0 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
          <img
            src={logoImg}
            alt="$NEAKERS NIK"
            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
          />
          <span style={{
            fontWeight: 800,
            fontSize: '0.9rem',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: '#ff3f3f',
            whiteSpace: 'nowrap'
          }}>
            Admin
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
          <button
            onClick={onGoToStore}
            title="Ver la tienda"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--glass-border)',
              borderRadius: '7px',
              padding: '0.4rem 0.7rem',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontFamily: 'inherit',
              transition: 'all 0.2s'
            }}
          >
            <StoreIcon size={14} />
            <span className="admin-bar-label">Ver tienda</span>
          </button>

          <button
            onClick={onToggleDarkMode}
            title={darkMode ? 'Modo claro' : 'Modo oscuro'}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--glass-border)',
              borderRadius: '7px',
              padding: '0.4rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              transition: 'all 0.2s'
            }}
          >
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {user && (
            <button
              onClick={onSignOut}
              title="Cerrar sesión"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--glass-border)',
                borderRadius: '7px',
                padding: '0.4rem 0.7rem',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontFamily: 'inherit',
                transition: 'all 0.2s'
              }}
            >
              <LogOut size={14} />
              <span className="admin-bar-label">Salir</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
