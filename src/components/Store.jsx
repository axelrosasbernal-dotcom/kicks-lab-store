import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Package, Users, Truck, Clock, Share2, Camera, Play } from 'lucide-react';
import { supabase } from '../supabaseClient';

const WHATSAPP_NUMBER = '542212267568';

const WhatsAppIcon = ({ size = 22, color = '#25D366' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const MOCK_PRODUCTS = [
  {
    id: 'mock-1',
    name: 'Air Jordan 1 Retro High OG',
    brand: 'Jordan',
    price: 250000,
    sizes: ['40', '41', '42', '43', '44', '45'],
    image_url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=800',
    description: 'El icono de la cultura urbana.'
  },
  {
    id: 'mock-2',
    name: 'Ultraboost Light 23',
    brand: 'Adidas',
    price: 233000,
    sizes: ['39', '40', '41', '42', '43'],
    image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800',
    description: 'Experimenta una energía épica.'
  },
  {
    id: 'mock-3',
    name: 'Air Max Plus Tuned Air',
    brand: 'Nike',
    price: 250000,
    sizes: ['40', '41', '42', '43', '44'],
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
    description: 'Deja que tu actitud marque el ritmo.'
  },
  {
    id: 'mock-4',
    name: 'Classic Club C 85 Vintage',
    brand: 'Reebok',
    price: 275000,
    sizes: ['38', '39', '40', '41', '42', '43'],
    image_url: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&q=80&w=800',
    description: 'El minimalismo de los 80 en su máxima expresión.'
  },
  {
    id: 'mock-5',
    name: 'RS-X Triple Black Edition',
    brand: 'Puma',
    price: 194000,
    sizes: ['41', '42', '43', '44', '45'],
    image_url: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&q=80&w=800',
    description: 'Vuelve la silueta RS-X del futuro retro.'
  },
  {
    id: 'mock-6',
    name: '550 Vintage White Green',
    brand: 'New Balance',
    price: 199000,
    sizes: ['40', '41', '42', '43', '44'],
    image_url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=800',
    description: 'Baloncesto retro que conquistó la moda urbana.'
  }
];

const HERO_CONFIG = [
  { heightRatio: 0.58, rotate: -8, zIndex: 1, brightness: 0.65 },
  { heightRatio: 0.75, rotate: -4, zIndex: 2, brightness: 0.8  },
  { heightRatio: 1.00, rotate:  0, zIndex: 5, brightness: 1.0  },
  { heightRatio: 0.75, rotate:  4, zIndex: 2, brightness: 0.8  },
  { heightRatio: 0.58, rotate:  8, zIndex: 1, brightness: 0.65 },
];

const CARDS_PER_PAGE = 4;

export default function Store({ onAddToCart }) {
  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [addedId, setAddedId]         = useState(null);
  const [contactForm, setContactForm] = useState({ name: '', price: '', email: '', message: '' });

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setProducts(data && data.length > 0 ? data : MOCK_PRODUCTS);
    } catch {
      setProducts(MOCK_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  const fmt = (price) =>
    `ARS ${Number(price).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;

  const openWA = (msg = '¡Hola! Quiero consultar sobre sus productos.') =>
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');

  const handleAdd = (product) => {
    onAddToCart?.();
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1600);
  };

  const maxIdx       = Math.max(0, products.length - CARDS_PER_PAGE);
  const visible      = products.slice(carouselIdx, carouselIdx + CARDS_PER_PAGE);
  const heroItems    = products.slice(0, 5);
  const sideFeatures = products.slice(0, 3);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <style dangerouslySetInnerHTML={{__html: `@keyframes _spin { to { transform: rotate(360deg); } }`}} />
        <div style={{
          width: '38px', height: '38px',
          border: '3px solid rgba(255,63,63,0.15)',
          borderTopColor: '#ff3f3f',
          borderRadius: '50%',
          animation: '_spin 1s linear infinite'
        }} />
      </div>
    );
  }

  return (
    <div style={{ color: 'var(--text-primary)' }}>

      {/* ── HERO BANNER ── */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(160deg, #080c14 0%, #111825 100%)',
        borderRadius: '14px',
        overflow: 'hidden',
        marginBottom: '1.5rem',
        height: '290px',
        border: '1px solid #1a1f2e'
      }}>
        {/* Central glow */}
        <div style={{
          position: 'absolute',
          left: '55%',
          top: '40%',
          transform: 'translate(-50%, -50%)',
          width: '460px',
          height: '220px',
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.07) 0%, transparent 68%)',
          pointerEvents: 'none'
        }} />

        {/* Podium ellipse */}
        <div style={{
          position: 'absolute',
          bottom: '-18px',
          left: '50%',
          transform: 'translateX(-30%)',
          width: '580px',
          height: '55px',
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.09) 0%, transparent 72%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        {/* Sneakers */}
        <div style={{
          position: 'absolute',
          right: '-20px',
          bottom: '0',
          width: '58%',
          height: '100%',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          paddingBottom: '0'
        }}>
          {heroItems.map((p, i) => {
            const cfg = HERO_CONFIG[i] ?? HERO_CONFIG[2];
            const BASE_H = 200;
            return (
              <img
                key={p.id}
                src={p.image_url}
                alt={p.name}
                onError={e => { e.target.style.display = 'none'; }}
                style={{
                  height: `${Math.round(BASE_H * cfg.heightRatio)}px`,
                  objectFit: 'contain',
                  filter: `brightness(${cfg.brightness}) drop-shadow(0 10px 24px rgba(0,0,0,0.85))`,
                  transform: `rotate(${cfg.rotate}deg)`,
                  zIndex: cfg.zIndex,
                  position: 'relative',
                  marginBottom: `${(1 - cfg.heightRatio) * 40}px`,
                  marginLeft: i > 0 ? '-12px' : '0'
                }}
              />
            );
          })}
        </div>

        {/* Text */}
        <div style={{ position: 'relative', zIndex: 10, padding: '2rem 2.5rem', maxWidth: '420px' }}>
          <h1 style={{
            fontSize: 'clamp(1.25rem, 2.2vw, 1.85rem)',
            fontWeight: 900,
            textTransform: 'uppercase',
            color: '#fff',
            lineHeight: 1.15,
            fontFamily: 'var(--font-heading)',
            marginBottom: '0.5rem'
          }}>
            MODELOS EXCLUSIVOS -
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#b0b8c8', fontWeight: 500, lineHeight: 1.45 }}>
            Envío Gratis en La Plata y Alrededores
          </p>
        </div>

        {/* WhatsApp contact bar */}
        <button
          onClick={() => openWA()}
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            background: 'rgba(0,0,0,0.78)',
            backdropFilter: 'blur(12px)',
            border: 'none',
            borderTopLeftRadius: '12px',
            padding: '0.65rem 1.2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <WhatsAppIcon size={20} />
          <span style={{ color: '#fff', fontSize: '0.82rem', fontWeight: 600 }}>
            Consultas al MD o WhatsApp {WHATSAPP_NUMBER}
          </span>
        </button>
      </div>

      {/* ── TWO-COLUMN LAYOUT ── */}
      <div className="store-grid">

        {/* LEFT: Product Carousel */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Destacados</h2>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {[
                { icon: <ChevronLeft size={16} />, action: () => setCarouselIdx(Math.max(0, carouselIdx - CARDS_PER_PAGE)), disabled: carouselIdx === 0 },
                { icon: <ChevronRight size={16} />, action: () => setCarouselIdx(Math.min(maxIdx, carouselIdx + CARDS_PER_PAGE)), disabled: carouselIdx >= maxIdx },
              ].map(({ icon, action, disabled }, i) => (
                <button key={i} onClick={action} disabled={disabled} style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '50%',
                  width: '34px', height: '34px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  color: disabled ? 'var(--text-muted)' : 'var(--text-primary)',
                  transition: 'all 0.2s'
                }}>
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            {visible.map(product => (
              <div key={product.id} style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'border-color 0.2s, transform 0.2s'
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,63,63,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {/* Image + thumbnails */}
                <div style={{
                  display: 'flex',
                  height: '165px',
                  background: 'var(--bg-primary)',
                  borderBottom: '1px solid var(--border-color)'
                }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.85rem' }}>
                    <img
                      src={product.image_url}
                      alt={product.name}
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400'; }}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '135px',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 5px 14px rgba(0,0,0,0.55))'
                      }}
                    />
                  </div>
                  {/* Thumbnail column */}
                  <div style={{ width: '56px', display: 'flex', flexDirection: 'column', gap: '4px', padding: '8px 8px 8px 0' }}>
                    {[1, 0.55].map((op, ti) => (
                      <div key={ti} style={{
                        flex: 1,
                        background: 'var(--bg-tertiary)',
                        borderRadius: '6px',
                        overflow: 'hidden'
                      }}>
                        <img
                          src={product.image_url}
                          alt=""
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            opacity: op,
                            transform: ti === 1 ? 'scaleX(-1)' : 'none'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card body */}
                <div style={{ padding: '0.85rem' }}>
                  <p style={{
                    fontSize: '0.76rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '0.2rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {product.name}
                  </p>
                  <p style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                    {fmt(product.price)}
                  </p>
                  <button
                    onClick={() => handleAdd(product)}
                    style={{
                      width: '100%',
                      background: addedId === product.id ? '#22c55e' : '#fff',
                      color: addedId === product.id ? '#fff' : '#000',
                      border: 'none',
                      borderRadius: '7px',
                      padding: '0.58rem',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      transition: 'all 0.25s',
                      fontFamily: 'inherit'
                    }}
                  >
                    {addedId === product.id ? '✓ Agregado' : 'Añadir al Carrito'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Utility Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Mini Featured Products */}
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '1rem'
          }}>
            <h3 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.7rem' }}>Destacados</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {sideFeatures.map(p => (
                <div key={p.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '8px',
                  padding: '0.5rem',
                  border: '1px solid var(--border-color)'
                }}>
                  <img src={p.image_url} alt={p.name} style={{ width: '54px', height: '44px', objectFit: 'contain', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.66rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.name}
                    </p>
                    <p style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.1rem' }}>
                      {fmt(p.price)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleAdd(p)}
                    style={{
                      background: '#fff',
                      color: '#000',
                      border: 'none',
                      borderRadius: '5px',
                      padding: '0.28rem 0.45rem',
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      fontFamily: 'inherit',
                      transition: 'opacity 0.2s'
                    }}
                  >
                    Añadir al Carrito
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Service Icons */}
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '0.85rem 0.6rem'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.3rem' }}>
              {[
                { Icon: Package, label: 'Stock 🟢'    },
                { Icon: Users,   label: 'Ustedes 🟢'  },
                { Icon: Truck,   label: 'Envíos 🟢'   },
                { Icon: Clock,   label: 'Horarios 🟢' },
              ].map(({ Icon, label }) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                  <div style={{
                    width: '44px', height: '44px',
                    borderRadius: '50%',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-secondary)'
                  }}>
                    <Icon size={17} />
                  </div>
                  <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.3 }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment + Shipping Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {[
              {
                title: 'Métodos de pago',
                items: ['Abonas Al Recibir 💵', 'Abonas Al Recibir 💳', 'Abonas Al Recibir 📱', 'Abonas Al Recibir 🏦']
              },
              {
                title: 'Seguimiento al envío',
                items: ['Seguimiento de envío', 'Consultas de envío', 'Estado de envíos']
              }
            ].map(({ title, items }) => (
              <div key={title} style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '0.75rem'
              }}>
                <h4 style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.45rem' }}>{title}</h4>
                {items.map(item => (
                  <div key={item} style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '0.2rem', display: 'flex', gap: '0.2rem', alignItems: 'flex-start' }}>
                    <span style={{ color: '#ff3f3f', flexShrink: 0, lineHeight: 1.4 }}>→</span>
                    <span style={{ lineHeight: 1.4 }}>{item}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '1rem'
          }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.7rem' }}>Contacto al cliente</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {[
                { key: 'name',  placeholder: 'Name',   type: 'text'  },
                { key: 'price', placeholder: 'Precio', type: 'text'  },
                { key: 'email', placeholder: 'Email',  type: 'email' },
              ].map(({ key, placeholder, type }) => (
                <input
                  key={key}
                  type={type}
                  placeholder={placeholder}
                  value={contactForm[key]}
                  onChange={e => setContactForm(prev => ({ ...prev, [key]: e.target.value }))}
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    padding: '0.48rem 0.75rem',
                    color: 'var(--text-primary)',
                    fontSize: '0.76rem',
                    outline: 'none',
                    width: '100%',
                    fontFamily: 'inherit'
                  }}
                />
              ))}
              <textarea
                placeholder="Pontaja tu mensaje"
                value={contactForm.message}
                onChange={e => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '0.48rem 0.75rem',
                  color: 'var(--text-primary)',
                  fontSize: '0.76rem',
                  outline: 'none',
                  width: '100%',
                  minHeight: '62px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
              <button
                onClick={() => openWA(`${contactForm.name ? contactForm.name + ': ' : ''}${contactForm.message || 'Consulta desde la web'}`)}
                style={{
                  background: '#fff',
                  color: '#000',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.58rem',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  width: '100%',
                  fontFamily: 'inherit',
                  transition: 'opacity 0.2s'
                }}
              >
                Contact
              </button>
            </div>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', justifyContent: 'center' }}>
              <Share2 size={17} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
              <Camera size={17} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
              <Play   size={17} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
            </div>
          </div>

          {/* WhatsApp CTA button */}
          <button
            onClick={() => openWA()}
            style={{
              background: '#25D366',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '0.8rem 1.25rem',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
              width: '100%',
              fontFamily: 'inherit',
              transition: 'opacity 0.2s',
              boxShadow: '0 4px 16px rgba(37,211,102,0.3)'
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            <WhatsAppIcon size={20} color="#fff" />
            Consultas al WhatsApp
          </button>
        </div>
      </div>

      {/* ── BOTTOM WHATSAPP BAR ── */}
      <div
        onClick={() => openWA()}
        style={{
          marginTop: '1.5rem',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          padding: '0.8rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.7rem',
          cursor: 'pointer'
        }}
      >
        <WhatsAppIcon size={19} />
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', fontWeight: 600 }}>
          Consultas al MD o WhatsApp {WHATSAPP_NUMBER}
        </span>
      </div>
    </div>
  );
}
