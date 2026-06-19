import React from 'react';
import { ShoppingBag, LogIn, LogOut, User, Settings, Sun, Moon } from 'lucide-react';

export default function Navbar({ user, activeTab, setActiveTab, onSignOut, darkMode, onToggleDarkMode }) {
  return (
    <nav className="glass-panel" style={{
      margin: '1rem auto',
      padding: '1rem 2rem',
      maxWidth: '1200px',
      width: 'calc(100% - 2rem)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: 'var(--radius-md)',
      position: 'sticky',
      top: '1rem',
      zIndex: 100
    }}>
      <div 
        onClick={() => setActiveTab('store')} 
        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
      >
        <div style={{
          background: 'var(--accent-gradient)',
          padding: '0.5rem',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(255, 63, 63, 0.4)'
        }}>
          <ShoppingBag size={20} color="#fff" />
        </div>
        <span style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 800,
          fontSize: '1.25rem',
          letterSpacing: '0.05em',
          background: 'linear-gradient(to right, #fff, #9ca3af)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          KICKS LAB
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button 
          onClick={() => setActiveTab('store')}
          style={{
            background: 'none',
            border: 'none',
            fontWeight: 600,
            color: activeTab === 'store' ? '#ff3f3f' : 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'color 0.2s',
            fontSize: '0.95rem'
          }}
        >
          Catálogo
        </button>

        {user && (
          <button 
            onClick={() => setActiveTab('admin')}
            style={{
              background: 'none',
              border: 'none',
              fontWeight: 600,
              color: activeTab === 'admin' ? '#ff3f3f' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'color 0.2s',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Settings size={16} />
            Admin Panel
          </button>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onToggleDarkMode}
          title={darkMode ? 'Modo claro' : 'Modo oscuro'}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.45rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            transition: 'all 0.2s ease'
          }}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255,255,255,0.05)',
              padding: '0.4rem 0.8rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)'
            }}>
              <User size={14} />
              <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.email}
              </span>
            </div>
            <button 
              onClick={onSignOut} 
              className="btn-secondary"
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <LogOut size={16} />
              <span>Salir</span>
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setActiveTab('auth')} 
            className="btn-primary"
            style={{
              padding: '0.5rem 1.25rem',
              fontSize: '0.875rem',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <LogIn size={16} />
            <span>Ingresar</span>
          </button>
        )}
      </div>
    </nav>
  );
}
