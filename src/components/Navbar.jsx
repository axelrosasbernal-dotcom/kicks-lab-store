import React, { useState, useRef, useEffect } from 'react';
import { ShoppingCart, Sun, Moon, LogIn, LogOut, Settings } from 'lucide-react';
import logoImg from '../assets/logo.png';

const BrandLogo = () => (
  <div style={{
    width: '62px',
    height: '62px',
    borderRadius: '50%',
    overflow: 'hidden',
    flexShrink: 0,
    boxShadow: '0 0 0 2px rgba(255,215,0,0.35), 0 4px 18px rgba(0,0,0,0.6)',
    transition: 'box-shadow 0.25s'
  }}>
    <img
      src={logoImg}
      alt="$NEAKERS NIK"
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
    />
  </div>
);

const NAV_ITEMS = ['Novedades', 'Nosotros', 'Testimonios', 'Contacto'];

const SCROLL_MAP = {
  'Nosotros':    'sobre-nosotros',
  'Testimonios': 'testimonios',
  'Contacto':    'contacto',
};

export default function Navbar({ user, isAdmin, activeTab, setActiveTab, onSignOut, darkMode, onToggleDarkMode, cartCount = 0, onCartClick, genderFilter, setGenderFilter }) {
  const [activeNavItem, setActiveNavItem] = useState('Novedades');
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navContainerRef = useRef(null);
  const buttonRefs = useRef({});

  const updatePill = (item) => {
    const btn = buttonRefs.current[item];
    const container = navContainerRef.current;
    if (btn && container) {
      const btnRect = btn.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setPillStyle({ left: btnRect.left - containerRect.left, width: btnRect.width, opacity: 1 });
    }
  };

  useEffect(() => { updatePill(activeNavItem); }, [activeNavItem]);

  useEffect(() => {
    const onResize = () => updatePill(activeNavItem);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [activeNavItem]);

  const handleNavClick = (item) => {
    setActiveNavItem(item);
    setActiveTab('store');
    if (SCROLL_MAP[item]) {
      setTimeout(() => document.getElementById(SCROLL_MAP[item])?.scrollIntoView({ behavior: 'smooth' }), 80);
    } else {
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 80);
    }
  };

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
        <div
          onClick={() => setActiveTab('store')}
          style={{ cursor: 'pointer', flexShrink: 0 }}
          onMouseEnter={e => e.currentTarget.firstChild.style.boxShadow = '0 0 0 2px rgba(255,215,0,0.7), 0 6px 24px rgba(0,0,0,0.7)'}
          onMouseLeave={e => e.currentTarget.firstChild.style.boxShadow = '0 0 0 2px rgba(255,215,0,0.35), 0 4px 18px rgba(0,0,0,0.6)'}
        >
          <BrandLogo />
        </div>

        {/* Center Nav Items */}
        <div
          ref={navContainerRef}
          style={{ display: 'flex', gap: '0.15rem', flex: 1, justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}
        >
          {/* Sliding pill */}
          <div style={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            left: pillStyle.left,
            width: pillStyle.width,
            height: '34px',
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '6px',
            transition: 'left 0.28s cubic-bezier(0.4,0,0.2,1), width 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.15s',
            opacity: pillStyle.opacity,
            pointerEvents: 'none',
            zIndex: 0,
          }} />

          {NAV_ITEMS.map((item) => {
            const active = activeNavItem === item;
            return (
              <button
                key={item}
                ref={el => { buttonRefs.current[item] = el; }}
                onClick={() => handleNavClick(item)}
                style={{
                  background: 'transparent',
                  border: '1px solid transparent',
                  color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  fontWeight: active ? 700 : 400,
                  transition: 'color 0.2s, font-weight 0.2s',
                  whiteSpace: 'nowrap',
                  fontFamily: 'inherit',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {item}
              </button>
            );
          })}
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
          <div onClick={onCartClick} style={{ position: 'relative', padding: '0.4rem', cursor: 'pointer' }}>
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
              {isAdmin && (
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
              )}
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
