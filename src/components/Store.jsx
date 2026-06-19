import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Package, Users, Truck, Clock, Share2, Camera, Play } from 'lucide-react';
import { supabase } from '../supabaseClient';

const WHATSAPP_NUMBER = '541123862445';
const WHATSAPP_DISPLAY = '+54 11 2386-2445';

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
    description: 'El icono de la cultura urbana.',
    gender: 'hombre'
  },
  {
    id: 'mock-2',
    name: 'Ultraboost Light 23',
    brand: 'Adidas',
    price: 233000,
    sizes: ['39', '40', '41', '42', '43'],
    image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800',
    description: 'Experimenta una energía épica.',
    gender: 'hombre'
  },
  {
    id: 'mock-3',
    name: 'Air Max Plus Tuned Air',
    brand: 'Nike',
    price: 250000,
    sizes: ['40', '41', '42', '43', '44'],
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
    description: 'Deja que tu actitud marque el ritmo.',
    gender: 'hombre'
  },
  {
    id: 'mock-4',
    name: 'Classic Club C 85 Vintage',
    brand: 'Reebok',
    price: 275000,
    sizes: ['38', '39', '40', '41', '42', '43'],
    image_url: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&q=80&w=800',
    description: 'El minimalismo de los 80 en su máxima expresión.',
    gender: 'mujer'
  },
  {
    id: 'mock-5',
    name: 'RS-X Triple Black Edition',
    brand: 'Puma',
    price: 194000,
    sizes: ['41', '42', '43', '44', '45'],
    image_url: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&q=80&w=800',
    description: 'Vuelve la silueta RS-X del futuro retro.',
    gender: 'hombre'
  },
  {
    id: 'mock-6',
    name: '550 Vintage White Green',
    brand: 'New Balance',
    price: 199000,
    sizes: ['40', '41', '42', '43', '44'],
    image_url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=800',
    description: 'Baloncesto retro que conquistó la moda urbana.',
    gender: 'mujer'
  }
];

const SEED_REVIEWS = [
  { id: 1, name: 'Martina G.', rating: 5, comment: 'Increíble calidad, llegaron en perfecto estado y más rápido de lo esperado. Las Jordan son una joya, se las recomiendo a todo el mundo.', date: '12/06/2026' },
  { id: 2, name: 'Lucas F.', rating: 5, comment: 'Compré las New Balance y son exactamente como en la foto. Súper cómodas para el día a día. La atención fue excelente.', date: '08/06/2026' },
  { id: 3, name: 'Valentina R.', rating: 4, comment: 'Muy buena atención y entrega rápida en La Plata. Llegaron bien embaladas y en perfectas condiciones. Vuelvo a comprar.', date: '01/06/2026' },
];

const HERO_CONFIG = [
  { heightRatio: 0.58, rotate: -8, zIndex: 1, brightness: 0.65 },
  { heightRatio: 0.75, rotate: -4, zIndex: 2, brightness: 0.8  },
  { heightRatio: 1.00, rotate:  0, zIndex: 5, brightness: 1.0  },
  { heightRatio: 0.75, rotate:  4, zIndex: 2, brightness: 0.8  },
  { heightRatio: 0.58, rotate:  8, zIndex: 1, brightness: 0.65 },
];

const CARDS_PER_PAGE = 4;

const StepHeader = ({ step, onClose }) => (
  <div style={{
    padding: '1rem 1.5rem',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  }}>
    {[{ n: 1, label: 'DATOS' }, { n: 2, label: 'PAGO' }, { n: 3, label: 'LISTO' }].map(({ n, label }, i) => (
      <React.Fragment key={n}>
        {i > 0 && (
          <div style={{ height: '1px', flex: 1, background: n <= step ? '#FFD700' : 'var(--border-color)' }} />
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{
            width: '26px', height: '26px', borderRadius: '50%',
            background: n <= step ? '#FFD700' : 'var(--bg-tertiary)',
            color: n <= step ? '#000' : 'var(--text-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.72rem', fontWeight: 900, flexShrink: 0
          }}>
            {n}
          </div>
          <span style={{
            fontSize: '0.72rem', fontWeight: 700,
            color: n <= step ? 'var(--text-primary)' : 'var(--text-muted)',
            letterSpacing: '0.05em'
          }}>
            {label}
          </span>
        </div>
      </React.Fragment>
    ))}
    <div style={{ flex: 1 }} />
    <button
      onClick={onClose}
      style={{
        background: 'var(--bg-tertiary)', border: 'none', borderRadius: '50%',
        width: '32px', height: '32px', cursor: 'pointer', color: 'var(--text-primary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.1rem', flexShrink: 0
      }}
    >×</button>
  </div>
);

export default function Store({ onAddToCart, cartOpenSignal, genderFilter = 'all' }) {
  const [products, setProducts]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [carouselIdx, setCarouselIdx]     = useState(0);
  const [addedId, setAddedId]             = useState(null);
  const [contactForm, setContactForm]     = useState({ name: '', price: '', email: '', message: '' });

  // Cart state
  const [cart, setCart]                   = useState([]);
  const [cartOpen, setCartOpen]           = useState(false);
  const [checkoutStep, setCheckoutStep]   = useState(0);
  const [customerData, setCustomerData]   = useState({ nombre: '', telefono: '', direccion: '' });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderId, setOrderId]             = useState('');
  const [sizePickerProduct, setSizePickerProduct] = useState(null);
  const [selectedSize, setSelectedSize]   = useState('');

  const [reviews, setReviews] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('kicks_reviews') || 'null');
      return stored ?? SEED_REVIEWS;
    } catch { return SEED_REVIEWS; }
  });
  const [reviewForm, setReviewForm]         = useState({ name: '', rating: 5, comment: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [hoverRating, setHoverRating]       = useState(0);

  useEffect(() => { fetchProducts(); }, []);

  useEffect(() => { setCarouselIdx(0); }, [genderFilter]);

  useEffect(() => {
    if (cartOpenSignal) setCartOpen(true);
  }, [cartOpenSignal]);

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
    `$${Number(price).toLocaleString('es-AR', { minimumFractionDigits: 0 })}`;

  const openWA = (msg = '¡Hola! Quiero consultar sobre sus productos.') =>
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');

  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0);

  const addToCart = (product, size) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.size === size);
      if (existing) return prev.map(i => i === existing ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product, size, qty: 1 }];
    });
    onAddToCart?.();
    setCartOpen(true);
  };

  const removeFromCart = (product, size) => {
    setCart(prev => prev.filter(i => !(i.product.id === product.id && i.size === size)));
  };

  const updateQty = (product, size, delta) => {
    setCart(prev =>
      prev.map(i =>
        i.product.id === product.id && i.size === size
          ? { ...i, qty: Math.max(1, i.qty + delta) }
          : i
      )
    );
  };

  const closeCart = () => {
    setCartOpen(false);
    setCheckoutStep(0);
  };

  const confirmOrder = () => {
    const num = 'NK-' + Math.floor(100000 + Math.random() * 900000);
    setOrderId(num);
    const lines = cart
      .map(i => `• ${i.product.name}${i.size ? ` (Talle ${i.size})` : ''} x${i.qty} = ${fmt(i.product.price * i.qty)}`)
      .join('\n');
    const msg =
      `¡Hola! Quiero confirmar mi pedido:\n\n${lines}\n\n` +
      `Total: ${fmt(totalPrice)}\n` +
      `Nombre: ${customerData.nombre}\n` +
      `Teléfono: ${customerData.telefono}\n` +
      `Dirección: ${customerData.direccion}\n` +
      `Pago: ${paymentMethod}\n` +
      `N° de orden: ${num}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    setCheckoutStep(3);
  };

  const handleAdd = (product) => {
    if (product.sizes && product.sizes.length > 0) {
      setSizePickerProduct(product);
      setSelectedSize(product.sizes[0]);
    } else {
      addToCart(product, '');
      setAddedId(product.id);
      setTimeout(() => setAddedId(null), 1600);
    }
  };

  const submitReview = () => {
    if (!reviewForm.name.trim() || !reviewForm.comment.trim()) return;
    const newReview = {
      id: Date.now(),
      name: reviewForm.name.trim(),
      rating: reviewForm.rating,
      comment: reviewForm.comment.trim(),
      date: new Date().toLocaleDateString('es-AR')
    };
    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem('kicks_reviews', JSON.stringify(updated));
    setReviewForm({ name: '', rating: 5, comment: '' });
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  const filteredProducts = genderFilter === 'all'
    ? products
    : products.filter(p => !p.gender || p.gender === genderFilter);

  const maxIdx       = Math.max(0, filteredProducts.length - CARDS_PER_PAGE);
  const visible      = filteredProducts.slice(carouselIdx, carouselIdx + CARDS_PER_PAGE);
  const heroItems    = filteredProducts.slice(0, 5);
  const sideFeatures = filteredProducts.slice(0, 3);

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
          <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.18em', color: '#FFD700', textTransform: 'uppercase', marginBottom: '0.55rem' }}>
            KICKS LAB — Premium Footwear
          </p>
          <h1 style={{
            fontSize: 'clamp(1.45rem, 2.6vw, 2.1rem)',
            fontWeight: 900,
            textTransform: 'uppercase',
            color: '#fff',
            lineHeight: 1.1,
            fontFamily: 'var(--font-heading)',
            marginBottom: '0.65rem',
            letterSpacing: '-0.01em'
          }}>
            EL PASO QUE<br />TODOS NOTAN.
          </h1>
          <p style={{ fontSize: '0.92rem', color: '#b0b8c8', fontWeight: 500, lineHeight: 1.55, marginBottom: '1.1rem' }}>
            Zapatillas premium con garantía de autenticidad.<br />
            Envío gratis en La Plata y alrededores.
          </p>
          <button
            onClick={() => openWA('¡Hola! Quiero conocer los modelos disponibles.')}
            style={{
              background: '#FFD700',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              padding: '0.6rem 1.3rem',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              fontFamily: 'inherit',
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}
          >
            Ver modelos →
          </button>
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
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
              {genderFilter === 'hombre' ? 'Colección Hombre' : genderFilter === 'mujer' ? 'Colección Mujer' : 'Destacados'}
            </h2>
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
          Consultas al MD o WhatsApp {WHATSAPP_DISPLAY}
        </span>
      </div>

      {/* ── SOBRE NOSOTROS ── */}
      <div id="sobre-nosotros" style={{ marginTop: '4rem', scrollMarginTop: '90px' }}>
        <div style={{
          background: 'linear-gradient(160deg, #080c14 0%, #0d1220 100%)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            borderBottom: '1px solid var(--border-color)',
            padding: '2rem 2.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              width: '4px', height: '2.5rem',
              background: 'linear-gradient(180deg, #FFD700, #ff8008)',
              borderRadius: '2px', flexShrink: 0
            }} />
            <div>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', color: '#FFD700', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Quiénes somos
              </p>
              <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.01em', color: 'var(--text-primary)', lineHeight: 1.1 }}>
                Sobre Nosotros
              </h2>
            </div>
          </div>

          <div style={{ padding: '2rem 2.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
            {/* Texto */}
            <div>
              <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                Somos KICKS LAB, una tienda especializada en zapatillas de alta calidad para quienes no negocian con su estilo.
              </p>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
                Nacimos con la convicción de que el calzado no es solo moda — es una declaración de identidad. Por eso ofrecemos modelos exclusivos de las marcas más reconocidas del mundo, con garantía de autenticidad y atención personalizada en cada pedido.
              </p>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Cada zapatilla pasa por un control de calidad estricto antes de llegar a tus manos. Hacemos envíos a toda La Plata y Gran Buenos Aires con seguimiento en tiempo real, porque sabemos que la experiencia de compra importa tanto como el producto.
              </p>
            </div>
            {/* Stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { num: '+500', label: 'Clientes satisfechos', icon: '👟' },
                { num: '100%', label: 'Originales garantizados', icon: '✅' },
                { num: '24hs', label: 'Entrega en La Plata', icon: '🚀' },
                { num: '5★', label: 'Calificación promedio', icon: '⭐' },
              ].map(({ num, label, icon }) => (
                <div key={label} style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px', padding: '0.85rem 1rem'
                }}>
                  <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{icon}</span>
                  <div>
                    <p style={{ fontSize: '1.3rem', fontWeight: 900, color: '#FFD700', lineHeight: 1 }}>{num}</p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Valores */}
          <div style={{
            borderTop: '1px solid var(--border-color)',
            padding: '1.5rem 2.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem'
          }}>
            {[
              { title: 'Calidad premium', desc: 'Solo vendemos modelos con certificado de autenticidad. Sin réplicas, sin compromisos.' },
              { title: 'Atención real', desc: 'Te respondemos por WhatsApp en minutos. Un asesor real para cada duda.' },
              { title: 'Devolución sin drama', desc: 'Si algo no está bien, lo resolvemos. Tu satisfacción es nuestra reputación.' },
            ].map(({ title, desc }) => (
              <div key={title} style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <p style={{ fontWeight: 800, fontSize: '0.88rem', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>{title}</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RESEÑAS ── */}
      <div style={{ marginTop: '3.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '4px', height: '2rem', background: 'linear-gradient(180deg, #FFD700, #ff8008)', borderRadius: '2px', flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', color: '#FFD700', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Opiniones</p>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-primary)' }}>Lo que dicen nuestros clientes</h2>
          </div>
        </div>

        {/* Grilla de reseñas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {reviews.map(review => (
            <div key={review.id} style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[1,2,3,4,5].map(s => (
                    <span key={s} style={{ fontSize: '1rem', color: s <= review.rating ? '#FFD700' : 'var(--border-color)' }}>★</span>
                  ))}
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{review.date}</span>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                "{review.comment}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'var(--bg-tertiary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 700, color: '#FFD700'
                }}>
                  {review.name.charAt(0)}
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>{review.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Formulario de reseña */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '14px',
          padding: '1.75rem',
          maxWidth: '600px'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
            Dejá tu reseña
          </h3>

          {reviewSubmitted ? (
            <div style={{
              background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
              borderRadius: '10px', padding: '1.25rem', textAlign: 'center',
              color: '#22c55e', fontWeight: 700
            }}>
              ✓ ¡Gracias por tu reseña! Ya está publicada.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <input
                type="text"
                placeholder="Tu nombre"
                value={reviewForm.name}
                onChange={e => setReviewForm(prev => ({ ...prev, name: e.target.value }))}
                style={{
                  background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
                  borderRadius: '8px', padding: '0.65rem 1rem', color: 'var(--text-primary)',
                  fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box'
                }}
              />
              <div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>Puntuación</p>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[1,2,3,4,5].map(s => (
                    <span
                      key={s}
                      onClick={() => setReviewForm(prev => ({ ...prev, rating: s }))}
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{
                        fontSize: '1.75rem', cursor: 'pointer',
                        color: s <= (hoverRating || reviewForm.rating) ? '#FFD700' : 'var(--border-color)',
                        transition: 'color 0.1s'
                      }}
                    >★</span>
                  ))}
                </div>
              </div>
              <textarea
                placeholder="Contanos tu experiencia con el producto y la entrega..."
                value={reviewForm.comment}
                onChange={e => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                style={{
                  background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
                  borderRadius: '8px', padding: '0.65rem 1rem', color: 'var(--text-primary)',
                  fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit',
                  width: '100%', minHeight: '90px', resize: 'vertical', boxSizing: 'border-box'
                }}
              />
              <button
                onClick={submitReview}
                disabled={!reviewForm.name.trim() || !reviewForm.comment.trim()}
                style={{
                  background: reviewForm.name.trim() && reviewForm.comment.trim() ? '#FFD700' : 'var(--bg-tertiary)',
                  color: reviewForm.name.trim() && reviewForm.comment.trim() ? '#000' : 'var(--text-muted)',
                  border: 'none', borderRadius: '8px', padding: '0.8rem',
                  fontWeight: 800, fontSize: '0.88rem', cursor: reviewForm.name.trim() && reviewForm.comment.trim() ? 'pointer' : 'not-allowed',
                  fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.05em',
                  transition: 'all 0.2s', width: '100%'
                }}
              >
                Publicar reseña
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── SIZE PICKER MODAL ── */}
      {sizePickerProduct && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
            zIndex: 10001, display: 'flex', alignItems: 'center',
            justifyContent: 'center', padding: '1rem'
          }}
          onClick={e => { if (e.target === e.currentTarget) setSizePickerProduct(null); }}
        >
          <div style={{
            background: 'var(--bg-secondary)', borderRadius: '16px',
            padding: '1.5rem', width: '100%', maxWidth: '380px'
          }}>
            <h3 style={{ fontWeight: 900, fontSize: '1.1rem', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              Seleccioná tu talle
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              {sizePickerProduct.name}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
              {sizePickerProduct.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    padding: '0.5rem 1.1rem', borderRadius: '8px',
                    border: `1.5px solid ${selectedSize === size ? '#FFD700' : 'var(--border-color)'}`,
                    background: selectedSize === size ? 'rgba(255,215,0,0.12)' : 'var(--bg-tertiary)',
                    color: selectedSize === size ? '#FFD700' : 'var(--text-primary)',
                    fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                    fontFamily: 'inherit', transition: 'all 0.15s'
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setSizePickerProduct(null)}
                style={{
                  flex: 1, background: 'var(--bg-tertiary)', color: 'var(--text-secondary)',
                  border: 'none', borderRadius: '10px', padding: '0.85rem',
                  fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  addToCart(sizePickerProduct, selectedSize);
                  setAddedId(sizePickerProduct.id);
                  setTimeout(() => setAddedId(null), 1600);
                  setSizePickerProduct(null);
                }}
                style={{
                  flex: 2, background: '#FFD700', color: '#000',
                  border: 'none', borderRadius: '10px', padding: '0.85rem',
                  fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit',
                  textTransform: 'uppercase', letterSpacing: '0.04em'
                }}
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CART / CHECKOUT MODAL ── */}
      {cartOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.78)',
            zIndex: 10000, display: 'flex', alignItems: 'center',
            justifyContent: 'center', padding: '1rem'
          }}
          onClick={e => { if (e.target === e.currentTarget) closeCart(); }}
        >
          <div style={{
            background: 'var(--bg-secondary)', borderRadius: '16px',
            width: '100%', maxWidth: '480px', maxHeight: '90vh',
            display: 'flex', flexDirection: 'column', overflow: 'hidden'
          }}>

            {/* ── STEP 0: carrito ── */}
            {checkoutStep === 0 && (<>
              <div style={{
                padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'
              }}>
                <div>
                  <h2 style={{ fontWeight: 900, fontSize: '1.3rem', textTransform: 'uppercase' }}>Tu Carrito</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                    {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
                  </p>
                </div>
                <button onClick={closeCart} style={{
                  background: 'var(--bg-tertiary)', border: 'none', borderRadius: '50%',
                  width: '34px', height: '34px', cursor: 'pointer', color: 'var(--text-primary)',
                  fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>×</button>
              </div>

              <div style={{ flex: 1, overflow: 'auto', padding: '1rem 1.5rem' }}>
                {cart.length === 0
                  ? <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2.5rem 0' }}>Tu carrito está vacío</p>
                  : <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {cart.map(({ product, size, qty }) => (
                        <div key={`${product.id}-${size}`} style={{
                          background: 'var(--bg-tertiary)', borderRadius: '12px',
                          padding: '0.85rem', display: 'flex', gap: '0.85rem',
                          alignItems: 'center', position: 'relative'
                        }}>
                          <img
                            src={product.image_url} alt={product.name}
                            style={{ width: '72px', height: '72px', objectFit: 'contain', borderRadius: '8px', flexShrink: 0 }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{product.name}</p>
                            {size && <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Talle {size}</p>}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <div style={{
                                display: 'flex', alignItems: 'center', gap: '0.6rem',
                                background: 'var(--bg-secondary)', borderRadius: '8px', padding: '0.3rem 0.6rem'
                              }}>
                                <button onClick={() => updateQty(product, size, -1)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700, lineHeight: 1, padding: 0 }}>−</button>
                                <span style={{ fontWeight: 700, fontSize: '0.9rem', minWidth: '18px', textAlign: 'center' }}>{qty}</span>
                                <button onClick={() => updateQty(product, size, 1)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700, lineHeight: 1, padding: 0 }}>+</button>
                              </div>
                              <span style={{ fontWeight: 800, fontSize: '1rem' }}>{fmt(product.price * qty)}</span>
                            </div>
                          </div>
                          <button onClick={() => removeFromCart(product, size)} style={{
                            position: 'absolute', top: '8px', right: '8px',
                            background: 'none', border: 'none', color: 'var(--text-muted)',
                            cursor: 'pointer', fontSize: '1rem', lineHeight: 1
                          }}>×</button>
                        </div>
                      ))}
                    </div>
                }
              </div>

              <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Subtotal</span>
                  <span style={{ fontSize: '0.9rem' }}>{fmt(totalPrice)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Envío</span>
                  <span style={{ color: '#22c55e', fontWeight: 700, fontSize: '0.9rem' }}>GRATIS</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                  <span style={{ fontWeight: 900, fontSize: '1.05rem' }}>Total</span>
                  <span style={{ fontWeight: 900, fontSize: '1.05rem' }}>{fmt(totalPrice)}</span>
                </div>
                <button
                  disabled={cart.length === 0}
                  onClick={() => setCheckoutStep(1)}
                  style={{
                    width: '100%', background: cart.length === 0 ? 'var(--bg-tertiary)' : '#FFD700',
                    color: '#000', border: 'none', borderRadius: '10px', padding: '1rem',
                    fontWeight: 900, fontSize: '0.95rem', textTransform: 'uppercase',
                    letterSpacing: '0.06em', cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit'
                  }}
                >
                  Finalizar Compra
                </button>
              </div>
            </>)}

            {/* ── STEP 1: datos ── */}
            {checkoutStep === 1 && (<>
              <StepHeader step={1} onClose={closeCart} />
              <div style={{ flex: 1, overflow: 'auto', padding: '1.5rem' }}>
                <h2 style={{ fontWeight: 900, fontSize: '1.4rem', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Tus Datos</h2>
                {[
                  { label: 'NOMBRE COMPLETO', key: 'nombre', placeholder: 'Tu nombre', type: 'text' },
                  { label: 'TELÉFONO', key: 'telefono', placeholder: '221 555 1234', type: 'tel' },
                  { label: 'DIRECCIÓN DE ENTREGA', key: 'direccion', placeholder: 'Calle, número, piso', type: 'text' },
                ].map(({ label, key, placeholder, type }) => (
                  <div key={key} style={{ marginBottom: '1.1rem' }}>
                    <label style={{
                      display: 'block', fontSize: '0.72rem', fontWeight: 700,
                      letterSpacing: '0.08em', color: 'var(--text-secondary)', marginBottom: '0.45rem'
                    }}>
                      {label}
                    </label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={customerData[key]}
                      onChange={e => setCustomerData(prev => ({ ...prev, [key]: e.target.value }))}
                      style={{
                        width: '100%', background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-color)', borderRadius: '8px',
                        padding: '0.85rem 1rem', color: 'var(--text-primary)',
                        fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                ))}
              </div>
              <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)' }}>
                <button
                  onClick={() => {
                    if (customerData.nombre && customerData.telefono && customerData.direccion) {
                      setCheckoutStep(2);
                    }
                  }}
                  style={{
                    width: '100%', background: 'var(--bg-tertiary)', color: 'var(--text-primary)',
                    border: 'none', borderRadius: '10px', padding: '1rem',
                    fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                    fontFamily: 'inherit', letterSpacing: '0.03em'
                  }}
                >
                  Continuar →
                </button>
              </div>
            </>)}

            {/* ── STEP 2: pago ── */}
            {checkoutStep === 2 && (<>
              <StepHeader step={2} onClose={closeCart} />
              <div style={{ flex: 1, overflow: 'auto', padding: '1.5rem' }}>
                <h2 style={{ fontWeight: 900, fontSize: '1.4rem', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Forma de Pago</h2>
                {[
                  { id: 'Efectivo',       icon: '💵', desc: 'Abonás al recibir' },
                  { id: 'Transferencia',  icon: '🏦', desc: 'Te enviamos el CBU' },
                  { id: 'Tarjeta',        icon: '💳', desc: 'Hasta 6 cuotas sin interés' },
                ].map(({ id, icon, desc }) => (
                  <div
                    key={id}
                    onClick={() => setPaymentMethod(id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      padding: '1rem', marginBottom: '0.75rem', borderRadius: '12px',
                      border: `1.5px solid ${paymentMethod === id ? '#FFD700' : 'var(--border-color)'}`,
                      background: paymentMethod === id ? 'rgba(255,215,0,0.06)' : 'var(--bg-tertiary)',
                      cursor: 'pointer', transition: 'all 0.15s'
                    }}
                  >
                    <span style={{ fontSize: '1.6rem' }}>{icon}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700 }}>{id}</p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{desc}</p>
                    </div>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%',
                      border: `2px solid ${paymentMethod === id ? '#FFD700' : 'var(--border-color)'}`,
                      background: paymentMethod === id ? '#FFD700' : 'transparent',
                      flexShrink: 0, transition: 'all 0.15s'
                    }} />
                  </div>
                ))}
                <div style={{
                  background: 'var(--bg-tertiary)', borderRadius: '10px',
                  padding: '1rem', marginTop: '0.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
                    </span>
                    <span style={{ fontSize: '0.9rem' }}>{fmt(totalPrice)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 900 }}>Total a pagar</span>
                    <span style={{ fontWeight: 900 }}>{fmt(totalPrice)}</span>
                  </div>
                </div>
              </div>
              <div style={{
                padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)',
                display: 'flex', gap: '0.75rem'
              }}>
                <button
                  onClick={() => setCheckoutStep(1)}
                  style={{
                    background: 'var(--bg-tertiary)', color: 'var(--text-secondary)',
                    border: 'none', borderRadius: '10px', padding: '1rem 1.25rem',
                    fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem'
                  }}
                >
                  ← Volver
                </button>
                <button
                  disabled={!paymentMethod}
                  onClick={confirmOrder}
                  style={{
                    flex: 1, background: paymentMethod ? '#FFD700' : 'var(--bg-tertiary)',
                    color: '#000', border: 'none', borderRadius: '10px', padding: '1rem',
                    fontWeight: 900, fontSize: '0.95rem', textTransform: 'uppercase',
                    letterSpacing: '0.05em', cursor: paymentMethod ? 'pointer' : 'not-allowed',
                    fontFamily: 'inherit'
                  }}
                >
                  Confirmar Pedido
                </button>
              </div>
            </>)}

            {/* ── STEP 3: confirmado ── */}
            {checkoutStep === 3 && (<>
              <StepHeader step={3} onClose={closeCart} />
              <div style={{
                flex: 1, overflow: 'auto', padding: '2rem 1.5rem',
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
              }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '50%',
                  background: '#FFD700', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', marginBottom: '1.25rem',
                  fontSize: '2rem', color: '#000', fontWeight: 900
                }}>✓</div>
                <h2 style={{ fontWeight: 900, fontSize: '1.5rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  ¡Pedido Confirmado!
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  Gracias {customerData.nombre}, te contactamos pronto al {customerData.telefono}
                </p>
                <div style={{ background: 'var(--bg-tertiary)', borderRadius: '12px', padding: '1rem', width: '100%', textAlign: 'left' }}>
                  {[
                    { label: 'N° de orden', value: orderId },
                    { label: 'Total',       value: fmt(totalPrice) },
                    { label: 'Entrega en', value: customerData.direccion },
                    { label: 'Pago',        value: paymentMethod },
                  ].map(({ label, value }, idx, arr) => (
                    <div key={label} style={{
                      display: 'flex', justifyContent: 'space-between',
                      padding: '0.55rem 0',
                      borderBottom: idx < arr.length - 1 ? '1px solid var(--border-color)' : 'none'
                    }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{label}</span>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)' }}>
                <button
                  onClick={() => {
                    closeCart();
                    setCart([]);
                    setCustomerData({ nombre: '', telefono: '', direccion: '' });
                    setPaymentMethod('');
                  }}
                  style={{
                    width: '100%', background: '#FFD700', color: '#000',
                    border: 'none', borderRadius: '10px', padding: '1rem',
                    fontWeight: 900, fontSize: '0.95rem', textTransform: 'uppercase',
                    letterSpacing: '0.05em', cursor: 'pointer', fontFamily: 'inherit'
                  }}
                >
                  Volver a la Tienda
                </button>
              </div>
            </>)}

          </div>
        </div>
      )}
    </div>
  );
}
