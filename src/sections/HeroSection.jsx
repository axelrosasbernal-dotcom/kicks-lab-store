import React, { useState, useEffect, useRef } from 'react';
import giratorioImg from '../assets/giratorio-cutout.png';

const WA_NUMBER = '541123862445';

const FEATURES = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
    text: 'Stock disponible',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
    text: 'Envíos gratis en La Plata',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    text: 'Compra segura',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    text: 'Atención personalizada',
  },
];

export default function HeroSection({ products = [] }) {
  const [loaded, setLoaded] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [rotY, setRotY] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const spinRef = useRef(null);
  const rightRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleMouseMove = (e) => {
    const rect = rightRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 22;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -22;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  };

  const scrollToCatalog = () => {
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    let angle = 0;
    const step = () => {
      angle += 4;
      setRotY(angle % 360);
      if (angle < 360) {
        spinRef.current = requestAnimationFrame(step);
      } else {
        setRotY(0);
        setSpinning(false);
      }
    };
    spinRef.current = requestAnimationFrame(step);
  };

  useEffect(() => () => { if (spinRef.current) cancelAnimationFrame(spinRef.current); }, []);

  const openWA = () => {
    window.open(
      `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('¡Hola! Quiero pedir por WhatsApp.')}`,
      '_blank'
    );
  };

  return (
    <>
      <style>{`
        @keyframes nik-float {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-20px); }
        }
        @keyframes nik-ring1 {
          from { transform: rotate(0deg)   scaleY(0.28); }
          to   { transform: rotate(360deg) scaleY(0.28); }
        }
        @keyframes nik-ring2 {
          from { transform: rotate(0deg)   scaleY(0.28); }
          to   { transform: rotate(-360deg) scaleY(0.28); }
        }
        @keyframes nik-fadeup {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes nik-glow {
          0%,100% { opacity: 0.35; }
          50%     { opacity: 0.75; }
        }
        @keyframes nik-badge {
          from { opacity: 0; transform: translateX(-16px); }
          to   { opacity: 1; transform: translateX(0);     }
        }
        .nik-hero-btn-primary:hover {
          background: #ffe033 !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 12px 32px rgba(255,215,0,0.35) !important;
        }
        .nik-hero-btn-secondary:hover {
          background: rgba(255,255,255,0.1) !important;
          border-color: rgba(255,255,255,0.3) !important;
          transform: translateY(-2px) !important;
        }
      `}</style>

      {/* ── WRAPPER CARD ── */}
      <div className="nik-hero-card" style={{
        position: 'relative',
        borderRadius: '24px',
        overflow: 'hidden',
        marginBottom: '1.5rem',
        background: 'linear-gradient(140deg, #020510 0%, #040c1e 40%, #070e24 70%, #030810 100%)',
        border: '1px solid rgba(99,131,255,0.18)',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.03), 0 40px 80px rgba(0,0,0,0.7)',
        minHeight: '560px',
        display: 'flex',
        alignItems: 'stretch',
      }}>

        {/* ── Background decorations ── */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden'
        }}>
          {/* Top-left blue glow */}
          <div style={{
            position: 'absolute', top: '-120px', left: '-80px',
            width: '500px', height: '500px',
            background: 'radial-gradient(ellipse, rgba(59,100,255,0.18) 0%, transparent 68%)',
            borderRadius: '50%'
          }} />
          {/* Bottom-right accent */}
          <div style={{
            position: 'absolute', bottom: '-100px', right: '10%',
            width: '420px', height: '420px',
            background: 'radial-gradient(ellipse, rgba(99,60,220,0.14) 0%, transparent 65%)',
            borderRadius: '50%'
          }} />
          {/* Subtle grid lines */}
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.04 }}>
            <defs>
              <pattern id="nik-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#nik-grid)"/>
          </svg>
        </div>

        {/* ── TWO-COLUMN INNER ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          width: '100%',
          alignItems: 'center',
          gap: 0,
          padding: '3rem 3.5rem 3rem 3.5rem',
          position: 'relative',
          zIndex: 2,
        }}
          className="nik-hero-inner"
        >


          {/* ── LEFT: Text block ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>

            {/* Label */}
            <p style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.22em',
              color: '#6385ff',
              textTransform: 'uppercase',
              opacity: loaded ? 1 : 0,
              animation: loaded ? 'nik-fadeup 0.55s ease forwards' : 'none',
              animationDelay: '0.05s',
            }}>
              SNEAKERS NIK
            </p>

            {/* Headline */}
            <h1 className="nik-hero-title" style={{
              fontSize: 'clamp(2rem, 3.8vw, 3.2rem)',
              fontWeight: 900,
              textTransform: 'uppercase',
              color: '#ffffff',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              fontFamily: 'var(--font-heading)',
              margin: 0,
              opacity: loaded ? 1 : 0,
              animation: loaded ? 'nik-fadeup 0.6s ease forwards' : 'none',
              animationDelay: '0.15s',
            }}>
              SI TE MIRAN,<br />
              <span style={{
                WebkitTextFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                backgroundImage: 'linear-gradient(90deg, #fff 0%, #c8d4ff 100%)',
              }}>
                QUE SEA POR LAS SNEAKERS.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="nik-hero-subtitle" style={{
              fontSize: '0.95rem',
              color: '#7a8aaa',
              lineHeight: 1.65,
              maxWidth: '380px',
              margin: 0,
              opacity: loaded ? 1 : 0,
              animation: loaded ? 'nik-fadeup 0.6s ease forwards' : 'none',
              animationDelay: '0.25s',
            }}>
              Zapatillas premium para running, entrenamiento y estilo urbano.
              Calidad que se siente, estilo que se ve.
              <br /><span style={{ color: '#4d73ff', fontWeight: 600 }}>Envíos gratis en La Plata y alrededores.</span>
            </p>

            {/* Buttons */}
            <div className="nik-hero-btns" style={{
              display: 'flex',
              gap: '0.85rem',
              flexWrap: 'wrap',
              opacity: loaded ? 1 : 0,
              animation: loaded ? 'nik-fadeup 0.6s ease forwards' : 'none',
              animationDelay: '0.35s',
            }}>
              <button
                className="nik-hero-btn-primary"
                onClick={scrollToCatalog}
                style={{
                  background: '#FFD700',
                  color: '#000',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.8rem 1.75rem',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  transition: 'all 0.22s ease',
                  boxShadow: '0 6px 24px rgba(255,215,0,0.22)',
                  whiteSpace: 'nowrap',
                }}
              >
                VER MODELOS →
              </button>

              <button
                className="nik-hero-btn-secondary"
                onClick={openWA}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.18)',
                  borderRadius: '12px',
                  padding: '0.8rem 1.55rem',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase',
                  transition: 'all 0.22s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  whiteSpace: 'nowrap',
                  backdropFilter: 'blur(6px)',
                }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                PEDIR POR WHATSAPP
              </button>
            </div>

            {/* Feature badges */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.6rem',
              opacity: loaded ? 1 : 0,
              animation: loaded ? 'nik-fadeup 0.6s ease forwards' : 'none',
              animationDelay: '0.45s',
            }}>
              {FEATURES.map(({ icon, text }, i) => (
                <div
                  key={text}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '999px',
                    padding: '0.3rem 0.75rem 0.3rem 0.5rem',
                    animation: loaded ? `nik-badge 0.5s ease forwards` : 'none',
                    animationDelay: `${0.5 + i * 0.08}s`,
                    opacity: loaded ? 1 : 0,
                  }}
                >
                  <span style={{ color: '#4d73ff', display: 'flex', alignItems: 'center' }}>{icon}</span>
                  <span style={{ fontSize: '0.72rem', color: '#8da0c0', fontWeight: 500, whiteSpace: 'nowrap' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Sneaker stage ── */}
          <div
            className="nik-hero-stage"
            ref={rightRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={() => setHovered(true)}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '420px',
              opacity: loaded ? 1 : 0,
              animation: loaded ? 'nik-fadeup 0.7s ease forwards' : 'none',
              animationDelay: '0.2s',
            }}
          >
            {/* Ambient blob */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '340px',
              height: '340px',
              background: 'radial-gradient(ellipse, rgba(77,115,255,0.22) 0%, transparent 68%)',
              borderRadius: '50%',
              animation: 'nik-glow 3.5s ease-in-out infinite',
              pointerEvents: 'none',
            }} />

            {/* Ring 1 — outer */}
            <div style={{
              position: 'absolute',
              bottom: '60px',
              left: '50%',
              transform: 'translateX(-50%) scaleY(0.28)',
              width: '320px',
              height: '320px',
              border: '1.5px solid rgba(77,115,255,0.35)',
              borderRadius: '50%',
              animation: 'nik-ring1 9s linear infinite',
              pointerEvents: 'none',
            }} />

            {/* Ring 2 — inner */}
            <div style={{
              position: 'absolute',
              bottom: '60px',
              left: '50%',
              transform: 'translateX(-50%) scaleY(0.28)',
              width: '220px',
              height: '220px',
              border: '1px solid rgba(255,215,0,0.3)',
              borderRadius: '50%',
              animation: 'nik-ring2 6s linear infinite',
              pointerEvents: 'none',
            }} />

            {/* Ground shadow */}
            <div style={{
              position: 'absolute',
              bottom: '48px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '220px',
              height: '24px',
              background: 'radial-gradient(ellipse, rgba(50,80,255,0.45) 0%, transparent 72%)',
              borderRadius: '50%',
              filter: 'blur(6px)',
              animation: 'nik-glow 3.5s ease-in-out infinite',
              pointerEvents: 'none',
            }} />

            {/* Sneaker SVG */}
            <div className="nik-hero-shoe" style={{
              position: 'relative',
              zIndex: 5,
              width: 'clamp(280px, 30vw, 430px)',
              animation: spinning ? 'none' : 'nik-float 4.5s ease-in-out infinite',
              transform: spinning
                ? `perspective(900px) rotateY(${rotY}deg)`
                : hovered
                  ? `perspective(900px) rotateY(${tilt.x * 0.8}deg) rotateX(${tilt.y * 0.5}deg) scale(1.07)`
                  : 'perspective(900px) rotateY(0deg) rotateX(0deg) scale(1)',
              transition: spinning ? 'none' : hovered ? 'transform 0.08s linear' : 'transform 0.6s ease',
              willChange: 'transform',
            }}>
              <img
                src={giratorioImg}
                alt="Sneaker"
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 28px 44px rgba(0,0,0,0.75))',
                  display: 'block',
                }}
              />
            </div>

            {/* GIRAR button */}
            <button
              onClick={handleSpin}
              style={{
                position: 'absolute',
                bottom: '18px',
                right: '18px',
                zIndex: 10,
                background: 'rgba(15,20,40,0.85)',
                border: '1px solid rgba(99,131,255,0.35)',
                borderRadius: '50%',
                width: '64px',
                height: '64px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                cursor: spinning ? 'default' : 'pointer',
                color: '#fff',
                backdropFilter: 'blur(8px)',
                transition: 'border-color 0.2s, transform 0.2s',
                boxShadow: '0 4px 18px rgba(0,0,0,0.5)',
              }}
              onMouseEnter={e => { if (!spinning) { e.currentTarget.style.borderColor = 'rgba(99,131,255,0.7)'; e.currentTarget.style.transform = 'scale(1.08)'; } }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(99,131,255,0.35)'; e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ animation: spinning ? 'nik-ring1 0.9s linear infinite' : 'none' }}
              >
                <path d="M23 4v6h-6"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
              <span style={{ fontSize: '0.52rem', fontWeight: 800, letterSpacing: '0.08em', opacity: 0.85 }}>GIRAR</span>
            </button>
          </div>
        </div>

        {/* ── Responsive style override ── */}
        <style>{`
          @media (max-width: 768px) {
            .nik-hero-card {
              min-height: auto !important;
              border-radius: 16px !important;
            }
            .nik-hero-inner {
              grid-template-columns: 1fr !important;
              padding: 2rem 1.25rem 1.5rem !important;
              gap: 0 !important;
            }
            .nik-hero-title {
              font-size: 1.65rem !important;
              letter-spacing: -0.01em !important;
            }
            .nik-hero-subtitle {
              max-width: 100% !important;
              font-size: 0.88rem !important;
            }
            .nik-hero-btns {
              flex-direction: column !important;
              gap: 0.65rem !important;
            }
            .nik-hero-btn-primary,
            .nik-hero-btn-secondary {
              width: 100% !important;
              justify-content: center !important;
            }
            .nik-hero-stage {
              min-height: 300px !important;
              margin-top: 0.5rem !important;
            }
            .nik-hero-shoe {
              width: clamp(200px, 72vw, 280px) !important;
            }
          }
        `}</style>
      </div>
    </>
  );
}
