import React from 'react';
import { ShoppingCart, Sun, Moon, LogIn, LogOut, Settings } from 'lucide-react';

const KicksLabLogo = () => (
  <div style={{
    width: '58px',
    height: '58px',
    borderRadius: '50%',
    background: '#000',
    border: '2px solid #2a2a2a',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'hidden',
    padding: '6px',
    gap: '1px'
  }}>
    <span style={{ fontSize: '0.38rem', fontWeight: 900, color: '#fff', letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1 }}>KICKS</span>
    <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>👟</span>
    <span style={{ fontSize: '0.38rem', fontWeight: 900, color: '#fff', letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1 }}>LAB</span>
  </div>
);

const NAV_ITEMS = ['Novedades', 'Hombre', 'Mujer', 'Colecciones', 'Sobre Nosotros'];

export default function Navbar({ user, activeTab, setActiveTab, onSignOut, darkMode, onToggleDarkMode, cartCount = 0 }) {
  return (
    <nav style={{
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      width: '100%'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px',
        gap: '1rem'
      }}>

        {/* Circular Logo */}
        <div onClick={() => setActiveTab('store')} style={{ cursor: 'pointer', flexShrink: 0 }}>
          <KicksLabLogo />
        </div>

        {/* Center Nav Items */}
        <div style={{ display: 'flex', gap: '0.15rem', flex: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
          {NAV_ITEMS.map((item, i) => (
            <button
              key={item}
              onClick={() => setActiveTab('store')}
              style={{
                background: i === 0 ? 'rgba(255,255,255,0.1)' : 'transparent',
                border: 'none',
                color: i === 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.88rem',
                fontWeight: i === 0 ? 600 : 400,
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                fontFamily: 'inherit'
              }}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Right: Dark Mode + Cart + Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>

          {/* Dark mode toggle */}
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

          {/* Cart icon with badge */}
          <div style={{ position: 'relative', padding: '0.4rem', cursor: 'pointer' }}>
            <ShoppingCart size={22} color="var(--text-primary)" />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '0',
                right: '0',
                background: '#22c55e',
                color: '#fff',
                width: '17px',
                height: '17px',
                borderRadius: '50%',
                fontSize: '0.6rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1
              }}>
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </div>

          {/* Auth buttons */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => setActiveTab('admin')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeTab === 'admin' ? '#ff3f3f' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  padding: '0.4rem 0.5rem',
                  borderRadius: '6px',
                  transition: 'color 0.2s'
                }}
              >
                <Settings size={15} />
                Admin
              </button>
              <button
                onClick={onSignOut}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '6px',
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
                Salir
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('auth')}
              style={{
                background: 'var(--accent-gradient)',
                border: 'none',
                borderRadius: '7px',
                padding: '0.45rem 1rem',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontFamily: 'inherit',
                boxShadow: '0 2px 10px rgba(255,63,63,0.25)'
              }}
            >
              <LogIn size={14} />
              Ingresar
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
