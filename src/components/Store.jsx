import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../supabaseClient';
import HeroSection from './HeroSection';

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

  const [detailProduct, setDetailProduct] = useState(null);
  const [detailQty, setDetailQty]         = useState(1);
  const [detailSize, setDetailSize]       = useState('');
  const [detailThumb, setDetailThumb]     = useState(0);
  const [cardThumbs, setCardThumbs]       = useState({});

  const [reviews, setReviews] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('kicks_reviews') || 'null');
      return stored ?? SEED_REVIEWS;
    } catch { return SEED_REVIEWS; }
  });
  const [reviewForm, setReviewForm]         = useState({ name: '', rating: 5, comment: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [hoverRating, setHoverRating]       = useState(0);
  const [contactOpen, setContactOpen]       = useState(false);
  const [nosotrosTab, setNosotrosTab]       = useState(0);
  const [selectedSizes, setSelectedSizes]   = useState([]);
  const [sortOrder, setSortOrder]           = useState('asc');
  const [searchQuery, setSearchQuery]       = useState('');

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

  const isDiscountActive = (p) => {
    if (!p?.discount_enabled) return false;
    const now = new Date();
    if (p.discount_start && new Date(p.discount_start) > now) return false;
    if (p.discount_end   && new Date(p.discount_end)   < now) return false;
    return true;
  };

  const effectivePrice = (p) =>
    isDiscountActive(p) && p.sale_price ? Number(p.sale_price) : Number(p.price);

  const cleanSize = (s) => String(s).replace(/\s*(euros?|EUR|Euro)\s*/gi, '').trim();

  const openWA = (msg = '¡Hola! Quiero consultar sobre sus productos.') =>
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');

  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = cart.reduce((sum, i) => sum + effectivePrice(i.product) * i.qty, 0);

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
      .map(i => `• ${i.product.name}${i.size ? ` (Talle ${i.size})` : ''} x${i.qty} = ${fmt(effectivePrice(i.product) * i.qty)}`)
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

  const openDetail = (product) => {
    setDetailProduct(product);
    setDetailQty(1);
    setDetailSize(product.sizes?.[0] || '');
    setDetailThumb(0);
  };

  const handleAdd = (product) => {
    if (product.sizes && product.sizes.length > 0) {
      openDetail(product);
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

  const q = searchQuery.trim().toLowerCase();
  const searchFiltered = q === ''
    ? filteredProducts
    : filteredProducts.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q))
      );

  const sizeFiltered = selectedSizes.length === 0
    ? searchFiltered
    : searchFiltered.filter(p => p.sizes?.some(s => selectedSizes.includes(s)));

  const sortedProducts = [...sizeFiltered].sort((a, b) =>
    sortOrder === 'asc' ? a.price - b.price : b.price - a.price
  );

  const allSizes = searchFiltered.reduce((acc, p) => {
    (p.sizes || []).forEach(s => { acc[s] = (acc[s] || 0) + 1; });
    return acc;
  }, {});
  const sizeOptions = Object.entries(allSizes).sort((a, b) => Number(a[0]) - Number(b[0]));

  const maxIdx  = Math.max(0, sortedProducts.length - CARDS_PER_PAGE);
  const visible = sortedProducts.slice(carouselIdx, carouselIdx + CARDS_PER_PAGE);
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

      {/* ── HERO SECTION ── */}
      <HeroSection products={filteredProducts} />

      {/* ── TWO-COLUMN LAYOUT ── */}
      <div id="catalogo" className="store-grid">

        {/* LEFT: Product Carousel */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
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

          {/* Search bar */}
          <div style={{ position: 'relative', marginBottom: '0.65rem' }}>
            <svg
              width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            >
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder='Buscar zapatilla... ej: "Jordan", "Puma", "Bad Bunny"'
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCarouselIdx(0); }}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '9px',
                padding: '0.62rem 2.2rem 0.62rem 2.4rem',
                color: 'var(--text-primary)',
                fontSize: '0.82rem',
                outline: 'none',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s'
              }}
              onFocus={e => { e.target.style.borderColor = 'rgba(255,215,0,0.5)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--border-color)'; }}
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setCarouselIdx(0); }}
                style={{
                  position: 'absolute', right: '0.65rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1, padding: 0
                }}
              >×</button>
            )}
          </div>
          {searchQuery && (
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              {sortedProducts.length === 0
                ? `Sin resultados para "${searchQuery}"`
                : `${sortedProducts.length} ${sortedProducts.length === 1 ? 'resultado' : 'resultados'} para "${searchQuery}"`}
            </p>
          )}

          <style dangerouslySetInnerHTML={{__html: `
            .product-card { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 16px; overflow: hidden; transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s; }
            .product-card:hover { border-color: rgba(255,63,63,0.35); transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.45); }
            .product-card-img-wrap { position: relative; overflow: hidden; border-radius: 12px 12px 0 0; cursor: pointer; }
            .product-card-img-inner { display: flex; align-items: center; justify-content: center; padding: 1.5rem 1.5rem 1rem; height: 320px; background: linear-gradient(160deg, #0d1220 0%, #111827 60%, #0a0e18 100%); transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1); }
            .product-card-img-wrap:hover .product-card-img-inner { transform: scale(1.05); }
            .product-card-img { max-width: 100%; max-height: 260px; width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 16px 32px rgba(0,0,0,0.7)); transition: filter 0.3s; }
            .product-card-img-wrap:hover .product-card-img { filter: drop-shadow(0 20px 40px rgba(0,0,0,0.85)); }
            .product-card-thumbs { display: flex; gap: 6px; padding: 0.65rem 0.85rem 0; }
            .product-card-thumb { flex: 1; aspect-ratio: 1; border-radius: 8px; overflow: hidden; cursor: pointer; border: 2px solid transparent; background: #0d1220; padding: 4px; transition: border-color 0.15s, transform 0.15s; }
            .product-card-thumb:hover { transform: scale(1.08); }
            .product-card-thumb.active { border-color: var(--accent-yellow); }
            .product-card-thumb img { width: 100%; height: 100%; object-fit: contain; }
          `}} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            {visible.map(product => {
              const thumbIdx = cardThumbs[product.id] ?? 0;
              const thumbViews = [
                { style: {} },
                { style: { transform: 'scaleX(-1)' } },
                { style: { opacity: 0.75 } },
              ];
              const activeStyle = product.image_urls?.length > 1
                ? {}
                : (thumbViews[thumbIdx]?.style ?? {});
              return (
                <div key={product.id} className="product-card">
                  {/* Image area */}
                  <div className="product-card-img-wrap" onClick={() => openDetail(product)}>
                    <div className="product-card-img-inner">
                      <img
                        src={
                          product.image_urls?.length > 1
                            ? (product.image_urls[thumbIdx] ?? product.image_url)
                            : product.image_url
                        }
                        alt={product.name}
                        className="product-card-img"
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400'; }}
                        style={activeStyle}
                      />
                    </div>
                    {/* Badge de marca */}
                    {product.brand && (
                      <div style={{
                        position: 'absolute', top: '10px', left: '10px',
                        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '6px', padding: '2px 8px',
                        fontSize: '0.62rem', fontWeight: 800, color: 'rgba(255,255,255,0.85)',
                        letterSpacing: '0.1em', textTransform: 'uppercase'
                      }}>
                        {product.brand}
                      </div>
                    )}
                  </div>

                  {/* Miniaturas */}
                  <div className="product-card-thumbs">
                    {(() => {
                      const urls = product.image_urls?.length > 1
                        ? product.image_urls.slice(0, 3)
                        : [product.image_url, product.image_url, product.image_url];
                      return urls.map((url, ti) => (
                        <div
                          key={ti}
                          className={`product-card-thumb${thumbIdx === ti ? ' active' : ''}`}
                          onClick={e => { e.stopPropagation(); setCardThumbs(prev => ({ ...prev, [product.id]: ti })); }}
                        >
                          <img
                            src={url}
                            alt=""
                            style={product.image_urls?.length > 1 ? {} : thumbViews[ti]?.style ?? {}}
                          />
                        </div>
                      ));
                    })()}
                  </div>

                  {/* Card body */}
                  <div style={{ padding: '0.85rem 0.85rem 0.9rem' }}>
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
                    {isDiscountActive(product) && product.sale_price ? (
                      <div style={{ marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textDecoration: 'line-through', display: 'block', lineHeight: 1.4 }}>
                          {fmt(product.price)}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '1rem', fontWeight: 800, color: '#4ade80' }}>{fmt(product.sale_price)}</span>
                          {product.discount_value && (
                            <span style={{ fontSize: '0.65rem', background: 'rgba(34,197,94,0.15)', color: '#4ade80', padding: '0.1rem 0.35rem', borderRadius: 4, fontWeight: 700 }}>
                              {product.discount_value}% OFF
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                        {fmt(product.price)}
                      </p>
                    )}
                    <button
                      onClick={e => { e.stopPropagation(); handleAdd(product); }}
                      style={{
                        width: '100%',
                        background: addedId === product.id ? '#22c55e' : '#fff',
                        color: addedId === product.id ? '#fff' : '#000',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.62rem',
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
              );
            })}
          </div>
        </div>

        {/* RIGHT: Utility Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Ordenar por */}
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '1rem'
          }}>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.75rem' }}>Ordenar por</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {[
                { label: 'Precio: Menor a Mayor', value: 'asc' },
                { label: 'Precio: Mayor a Menor', value: 'desc' },
              ].map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => { setSortOrder(value); setCarouselIdx(0); }}
                  style={{
                    background: sortOrder === value ? 'rgba(255,215,0,0.1)' : 'var(--bg-tertiary)',
                    border: `1px solid ${sortOrder === value ? 'var(--accent-yellow)' : 'var(--border-color)'}`,
                    borderRadius: '8px',
                    padding: '0.55rem 0.75rem',
                    color: sortOrder === value ? 'var(--accent-yellow)' : 'var(--text-secondary)',
                    fontWeight: sortOrder === value ? 700 : 400,
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                    transition: 'all 0.15s'
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Filtrar por talle */}
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '1rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h4 style={{ fontSize: '0.82rem', fontWeight: 700 }}>Filtrar por talle</h4>
              {selectedSizes.length > 0 && (
                <button
                  onClick={() => { setSelectedSizes([]); setCarouselIdx(0); }}
                  style={{ fontSize: '0.68rem', color: '#ff3f3f', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}
                >
                  Limpiar
                </button>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.05rem', maxHeight: '230px', overflowY: 'auto' }}>
              {sizeOptions.map(([size, count]) => {
                const checked = selectedSizes.includes(size);
                return (
                  <label
                    key={size}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', padding: '0.38rem 0.3rem', borderRadius: '6px', transition: 'background 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-tertiary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        setSelectedSizes(prev =>
                          prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
                        );
                        setCarouselIdx(0);
                      }}
                      style={{ accentColor: '#FFD700', width: '14px', height: '14px', cursor: 'pointer', flexShrink: 0 }}
                    />
                    <span style={{ fontSize: '0.78rem', color: checked ? 'var(--text-primary)' : 'var(--text-secondary)', flex: 1, fontWeight: checked ? 600 : 400 }}>
                      {cleanSize(size)} EUR
                    </span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', background: 'var(--bg-tertiary)', borderRadius: '4px', padding: '0.1rem 0.4rem', flexShrink: 0 }}>
                      {count}
                    </span>
                  </label>
                );
              })}
            </div>
            {selectedSizes.length > 0 && (
              <div style={{ marginTop: '0.6rem', paddingTop: '0.6rem', borderTop: '1px solid var(--border-color)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {sortedProducts.length} {sortedProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}
              </div>
            )}
          </div>

          {/* Métodos de pago */}
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '1rem'
          }}>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.8rem', color: 'var(--text-primary)' }}>
              Métodos de pago
            </h4>
            {[
              { icon: '💵', label: 'Efectivo' },
              { icon: '💳', label: 'Tarjeta débito / crédito' },
              { icon: '🏦', label: 'Transferencia bancaria' },
            ].map(({ icon, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.95rem', flexShrink: 0 }}>{icon}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{label}</span>
              </div>
            ))}
            <div style={{
              marginTop: '0.65rem',
              paddingTop: '0.65rem',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <span style={{ color: '#22c55e', fontSize: '0.72rem', fontWeight: 700 }}>✓</span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Siempre abonás al recibir el producto</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── SOBRE NOSOTROS ── */}
      <div id="sobre-nosotros" style={{ marginTop: '4rem', scrollMarginTop: '90px' }}>
        <div style={{
          background: 'var(--nosotros-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{ borderBottom: '1px solid var(--border-color)', padding: '2rem 2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '4px', height: '2.5rem', background: 'linear-gradient(180deg, #FFD700, #ff8008)', borderRadius: '2px', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--accent-yellow)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Quiénes somos
              </p>
              <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.01em', color: 'var(--text-primary)', lineHeight: 1.1 }}>
                Sobre Nosotros
              </h2>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', paddingLeft: '1.5rem' }}>
            {['Historia', 'Valores', 'Números'].map((tab, i) => (
              <button
                key={tab}
                onClick={() => setNosotrosTab(i)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: `2px solid ${nosotrosTab === i ? 'var(--accent-yellow)' : 'transparent'}`,
                  padding: '1rem 1.25rem',
                  color: nosotrosTab === i ? 'var(--accent-yellow)' : 'var(--text-muted)',
                  fontWeight: nosotrosTab === i ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                  marginBottom: '-1px',
                  letterSpacing: '0.02em'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div style={{ padding: '2rem 2.5rem' }}>
            {nosotrosTab === 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
                <div>
                  <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                    Somos $NEAKERS NIK, tu tienda de zapatillas deportivas urbanas en La Plata. Estilo sin compromisos.
                  </p>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
                    Nacimos con la convicción de que el calzado no es solo moda — es una declaración de identidad. Ofrecemos modelos exclusivos de las marcas más icónicas, con garantía de autenticidad y atención personalizada en cada pedido.
                  </p>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    Cada zapatilla pasa por un control de calidad estricto antes de llegar a tus manos. Envíos a toda La Plata y Gran Buenos Aires con seguimiento en tiempo real.
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { num: '+500', label: 'Clientes satisfechos', icon: '👟' },
                    { num: '100%', label: 'Originales garantizados', icon: '✅' },
                    { num: '24hs', label: 'Entrega en La Plata', icon: '🚀' },
                    { num: '5★', label: 'Calificación promedio', icon: '⭐' },
                  ].map(({ num, label, icon }) => (
                    <div
                      key={label}
                      style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '0.85rem 1rem', transition: 'all 0.2s', cursor: 'default' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,215,0,0.3)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                    >
                      <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{icon}</span>
                      <div>
                        <p style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--accent-yellow)', lineHeight: 1 }}>{num}</p>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {nosotrosTab === 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {[
                  { title: 'Calidad premium', desc: 'Solo vendemos modelos con certificado de autenticidad. Sin réplicas, sin compromisos.', icon: '🏆', color: '#FFD700' },
                  { title: 'Atención real', desc: 'Te respondemos por WhatsApp en minutos. Un asesor de carne y hueso para cada duda.', icon: '💬', color: '#25D366' },
                  { title: 'Devolución sin drama', desc: 'Si algo no está bien, lo resolvemos. Tu satisfacción es nuestra reputación.', icon: '🔄', color: '#60a5fa' },
                  { title: 'Envío express', desc: 'Entrega en 24hs en La Plata. A todo el país con seguimiento en tiempo real.', icon: '📦', color: '#f59e0b' },
                  { title: 'Pagos flexibles', desc: 'Efectivo, transferencia o tarjeta. Siempre abonás al recibir el producto.', icon: '💳', color: '#a78bfa' },
                  { title: 'Stock permanente', desc: 'Actualizamos colecciones constantemente para que siempre encuentres tu modelo.', icon: '👟', color: '#fb7185' },
                ].map(({ title, desc, icon, color }) => (
                  <div
                    key={title}
                    style={{ padding: '1.25rem', background: 'var(--bg-tertiary)', borderRadius: '12px', border: `1px solid ${color}22`, transition: 'all 0.25s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = color + '55'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = color + '22'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'var(--bg-tertiary)'; }}
                  >
                    <div style={{ fontSize: '1.75rem', marginBottom: '0.65rem' }}>{icon}</div>
                    <p style={{ fontWeight: 800, fontSize: '0.88rem', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>{title}</p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
                  </div>
                ))}
              </div>
            )}

            {nosotrosTab === 2 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                {[
                  { num: '+500', label: 'Clientes satisfechos', detail: 'En La Plata y Gran Buenos Aires', icon: '👟', color: 'var(--accent-yellow)' },
                  { num: '100%', label: 'Zapatillas originales', detail: 'Certificado de autenticidad en cada par', icon: '✅', color: '#22c55e' },
                  { num: '24hs', label: 'Tiempo de entrega', detail: 'En La Plata capital, sin demoras', icon: '🚀', color: '#60a5fa' },
                  { num: '5★', label: 'Calificación promedio', detail: 'Basada en reseñas reales de clientes', icon: '⭐', color: '#f59e0b' },
                ].map(({ num, label, detail, icon, color }) => (
                  <div
                    key={label}
                    style={{ background: 'var(--bg-tertiary)', border: `1px solid ${color}22`, borderRadius: '14px', padding: '1.75rem', transition: 'all 0.25s', cursor: 'default' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = color + '55'; e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = `0 8px 30px ${color}15`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = color + '22'; e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem' }}>
                      <span style={{ fontSize: '2rem' }}>{icon}</span>
                      <p style={{ fontSize: '2.5rem', fontWeight: 900, color, lineHeight: 1 }}>{num}</p>
                    </div>
                    <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{label}</p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{detail}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── RESEÑAS ── */}
      <div id="testimonios" style={{ marginTop: '3.5rem', marginBottom: '2rem', scrollMarginTop: '90px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '4px', height: '2rem', background: 'linear-gradient(180deg, #FFD700, #ff8008)', borderRadius: '2px', flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--accent-yellow)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Opiniones</p>
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
                    <span key={s} style={{ fontSize: '1rem', color: s <= review.rating ? 'var(--accent-yellow)' : 'var(--star-empty)' }}>★</span>
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
                  fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-yellow)'
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
                        color: s <= (hoverRating || reviewForm.rating) ? 'var(--accent-yellow)' : 'var(--star-empty)',
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

      {/* ── CONTACTO ── */}
      <div id="contacto" style={{ marginTop: '4rem', scrollMarginTop: '90px', marginBottom: '4rem' }}>
        <div style={{ position: 'relative', background: 'linear-gradient(160deg, #080c14 0%, #0d1220 100%)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', overflow: 'hidden' }}>
          {/* Instagram gradient top bar */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #833AB4, #E1306C, #F77737, #FCAF45)' }} />

          {/* Header */}
          <div style={{ padding: '2.5rem 2.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', color: '#E1306C', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Hablemos
              </p>
              <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 900, textTransform: 'uppercase', color: '#fff', lineHeight: 1.1, marginBottom: '0.5rem' }}>
                Contacto
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '380px', lineHeight: 1.6 }}>
                Respondemos en minutos. Consultá talles, disponibilidad y envíos sin compromiso.
              </p>
            </div>
            <button
              onClick={() => setContactOpen(v => !v)}
              style={{
                background: contactOpen ? 'rgba(255,255,255,0.07)' : 'linear-gradient(135deg, #833AB4, #E1306C, #F77737)',
                border: contactOpen ? '1px solid rgba(255,255,255,0.15)' : 'none',
                borderRadius: '12px',
                padding: '0.85rem 1.75rem',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s',
                flexShrink: 0
              }}
            >
              {contactOpen ? '✕ Cerrar formulario' : '✉ Escribinos'}
            </button>
          </div>

          {/* Contact method cards */}
          <div style={{ padding: '0 2.5rem 2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))', gap: '1rem' }}>
            {[
              {
                icon: <WhatsAppIcon size={26} color="#25D366" />,
                label: 'WhatsApp',
                value: WHATSAPP_DISPLAY,
                cta: 'Chatear →',
                action: () => openWA(),
                borderColor: '#25D366'
              },
              {
                icon: (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#E1306C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                ),
                label: 'Instagram',
                value: '@zapatillasnik',
                cta: 'Ver perfil →',
                action: () => window.open('https://www.instagram.com/zapatillasnik/', '_blank'),
                borderColor: '#E1306C'
              },
              {
                icon: <span style={{ fontSize: '1.6rem' }}>📍</span>,
                label: 'La Plata, BA',
                value: 'Envíos a todo el país',
                cta: 'Ver en mapa →',
                action: () => window.open('https://maps.app.goo.gl/j6rdPnXscngJXasj8', '_blank'),
                borderColor: '#FFD700'
              },
              {
                icon: <span style={{ fontSize: '1.6rem' }}>⏰</span>,
                label: 'Horarios',
                value: 'Lun–Sáb 9 a 20hs',
                cta: null,
                action: null,
                borderColor: '#a78bfa'
              },
            ].map((card, i) => (
              <div
                key={i}
                onClick={card.action || undefined}
                style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${card.borderColor}22`, borderRadius: '14px', padding: '1.25rem', cursor: card.action ? 'pointer' : 'default', transition: 'all 0.2s' }}
                onMouseEnter={e => { if (card.action) { e.currentTarget.style.background = 'rgba(255,255,255,0.055)'; e.currentTarget.style.borderColor = card.borderColor + '55'; e.currentTarget.style.transform = 'translateY(-3px)'; } }}
                onMouseLeave={e => { if (card.action) { e.currentTarget.style.background = 'rgba(255,255,255,0.025)'; e.currentTarget.style.borderColor = card.borderColor + '22'; e.currentTarget.style.transform = 'translateY(0)'; } }}
              >
                <div style={{ marginBottom: '0.85rem' }}>{card.icon}</div>
                <p style={{ fontWeight: 800, fontSize: '0.9rem', color: '#fff', marginBottom: '0.25rem' }}>{card.label}</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{card.value}</p>
                {card.cta && <p style={{ fontSize: '0.72rem', color: card.borderColor, marginTop: '0.5rem', fontWeight: 600 }}>{card.cta}</p>}
              </div>
            ))}
          </div>

          {/* Collapsible form */}
          {contactOpen && (
            <div style={{ borderTop: '1px solid var(--border-color)', padding: '2rem 2.5rem 2.5rem', animation: 'fadeIn 0.35s ease' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem', color: '#fff' }}>
                Mandanos un mensaje
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={contactForm.name}
                  onChange={e => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' }}
                />
                <input
                  type="email"
                  placeholder="Tu email"
                  value={contactForm.email}
                  onChange={e => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' }}
                />
              </div>
              <textarea
                placeholder="¿En qué te podemos ayudar? Consultá talles, modelos, envíos..."
                value={contactForm.message}
                onChange={e => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', width: '100%', minHeight: '100px', resize: 'vertical', boxSizing: 'border-box', marginBottom: '0.75rem' }}
              />
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => openWA(`${contactForm.name ? contactForm.name + ': ' : ''}${contactForm.message || 'Consulta desde la web'}`)}
                  style={{ flex: 1, minWidth: '200px', background: '#25D366', border: 'none', borderRadius: '10px', padding: '0.9rem 1.5rem', color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <WhatsAppIcon size={18} color="#fff" /> Enviar por WhatsApp
                </button>
                <a
                  href="https://www.instagram.com/zapatillasnik/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ flex: 1, minWidth: '200px', background: 'linear-gradient(135deg, #833AB4, #E1306C, #F77737)', border: 'none', borderRadius: '10px', padding: '0.9rem 1.5rem', color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textDecoration: 'none', boxSizing: 'border-box' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                  DM en Instagram
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── PRODUCT DETAIL MODAL ── */}
      {detailProduct && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
            zIndex: 10002, display: 'flex', alignItems: 'center',
            justifyContent: 'center', padding: '1rem',
            backdropFilter: 'blur(4px)'
          }}
          onClick={e => { if (e.target === e.currentTarget) setDetailProduct(null); }}
        >
          <div style={{
            background: 'var(--bg-secondary)',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '860px',
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid var(--border-color)'
          }}>
            {/* Header con breadcrumb y botón cerrar */}
            <div style={{
              padding: '1rem 1.5rem',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Inicio &nbsp;/&nbsp; Ver todas las zapatillas &nbsp;/&nbsp;
                <span style={{ color: 'var(--text-primary)' }}>{detailProduct.name}</span>
              </p>
              <button
                onClick={() => setDetailProduct(null)}
                style={{
                  background: 'var(--bg-tertiary)', border: 'none', borderRadius: '50%',
                  width: '34px', height: '34px', cursor: 'pointer',
                  color: 'var(--text-primary)', fontSize: '1.2rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}
              >×</button>
            </div>

            {/* Cuerpo: dos columnas */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 0,
              flex: 1,
              overflow: 'auto'
            }}>
              {/* ── Columna izquierda: imagen grande + miniaturas ── */}
              <div style={{
                padding: '1.5rem',
                borderRight: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                background: 'var(--bg-primary)'
              }}>
                {/* Imagen principal */}
                <div style={{
                  flex: 1,
                  minHeight: '280px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--bg-secondary)',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  padding: '1.5rem'
                }}>
                  <img
                    src={
                      detailProduct.image_urls?.length > 1
                        ? detailProduct.image_urls[detailThumb] ?? detailProduct.image_url
                        : detailProduct.image_url
                    }
                    alt={detailProduct.name}
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800'; }}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '300px',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.6))',
                      transition: 'all 0.25s',
                      ...(detailProduct.image_urls?.length > 1 ? {} : {
                        transform: detailThumb === 1 ? 'scaleX(-1)' : detailThumb === 3 ? 'rotate(-8deg) scale(0.9)' : 'none',
                        opacity: detailThumb === 2 ? 0.7 : 1
                      })
                    }}
                  />
                </div>

                {/* Fila de miniaturas */}
                {(() => {
                  const thumbUrls = detailProduct.image_urls?.length > 1
                    ? detailProduct.image_urls
                    : [
                        detailProduct.image_url,
                        detailProduct.image_url,
                        detailProduct.image_url,
                        detailProduct.image_url,
                      ];
                  const thumbStyles = [
                    {},
                    { transform: 'scaleX(-1)' },
                    { opacity: 0.7 },
                    { transform: 'rotate(-8deg) scale(0.9)', opacity: 0.6 },
                  ];
                  return (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {thumbUrls.slice(0, 4).map((url, ti) => (
                        <div
                          key={ti}
                          onClick={e => { e.stopPropagation(); setDetailThumb(ti); }}
                          style={{
                            flex: 1,
                            aspectRatio: '1',
                            background: 'var(--bg-secondary)',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            border: `2px solid ${detailThumb === ti ? 'var(--accent-yellow)' : 'var(--border-color)'}`,
                            cursor: 'pointer',
                            transition: 'border-color 0.15s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '0.4rem'
                          }}
                        >
                          <img
                            src={url}
                            alt=""
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              ...(detailProduct.image_urls?.length > 1 ? {} : thumbStyles[ti])
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* ── Columna derecha: detalles ── */}
              <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto' }}>
                {/* Nombre y precio */}
                <div>
                  {detailProduct.brand && (
                    <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                      {detailProduct.brand}
                    </p>
                  )}
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: '0.65rem' }}>
                    {detailProduct.name}
                  </h2>
                  {isDiscountActive(detailProduct) && detailProduct.sale_price ? (
                    <div>
                      <span style={{ fontSize: '1rem', color: 'var(--text-muted)', textDecoration: 'line-through', display: 'block', marginBottom: '0.2rem' }}>
                        {fmt(detailProduct.price)}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#4ade80' }}>
                          {fmt(detailProduct.sale_price)}
                        </span>
                        {detailProduct.discount_value && (
                          <span style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', padding: '0.25rem 0.65rem', borderRadius: 6, fontWeight: 800, fontSize: '0.88rem' }}>
                            {detailProduct.discount_value}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                      {fmt(detailProduct.price)}
                    </p>
                  )}
                </div>

                {/* Descripción */}
                {detailProduct.description && (
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                    {detailProduct.description}
                  </p>
                )}

                {/* Selector de talle */}
                {detailProduct.sizes && detailProduct.sizes.length > 0 && (
                  <div>
                    <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.6rem', letterSpacing: '0.05em' }}>
                      TALLE: <span style={{ color: 'var(--text-primary)' }}>{cleanSize(detailSize)}</span>
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                      {detailProduct.sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setDetailSize(size)}
                          style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '9px',
                            border: `1.5px solid ${detailSize === size ? 'var(--accent-yellow)' : 'var(--border-color)'}`,
                            background: detailSize === size ? 'rgba(255,215,0,0.12)' : 'var(--bg-tertiary)',
                            color: detailSize === size ? 'var(--accent-yellow)' : 'var(--text-primary)',
                            fontWeight: 700,
                            fontSize: '0.88rem',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            transition: 'all 0.15s'
                          }}
                        >
                          {cleanSize(size)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selector de cantidad */}
                <div>
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.6rem', letterSpacing: '0.05em' }}>
                    CANTIDAD
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 0, width: 'fit-content' }}>
                    <button
                      onClick={() => setDetailQty(q => Math.max(1, q - 1))}
                      style={{
                        width: '40px', height: '40px',
                        background: 'var(--bg-tertiary)',
                        border: '1.5px solid var(--border-color)',
                        borderRadius: '9px 0 0 9px',
                        color: 'var(--text-primary)',
                        fontSize: '1.25rem',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'inherit', fontWeight: 700
                      }}
                    >−</button>
                    <div style={{
                      width: '52px', height: '40px',
                      background: 'var(--bg-secondary)',
                      border: '1.5px solid var(--border-color)',
                      borderLeft: 'none', borderRight: 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)'
                    }}>
                      {detailQty}
                    </div>
                    <button
                      onClick={() => setDetailQty(q => q + 1)}
                      style={{
                        width: '40px', height: '40px',
                        background: 'var(--bg-tertiary)',
                        border: '1.5px solid var(--border-color)',
                        borderRadius: '0 9px 9px 0',
                        color: 'var(--text-primary)',
                        fontSize: '1.25rem',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'inherit', fontWeight: 700
                      }}
                    >+</button>
                  </div>
                </div>

                {/* Botón agregar al carrito */}
                <button
                  onClick={() => {
                    for (let i = 0; i < detailQty; i++) {
                      addToCart(detailProduct, detailSize);
                    }
                    setDetailProduct(null);
                  }}
                  style={{
                    width: '100%',
                    background: '#fff',
                    color: '#000',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.95rem',
                    fontWeight: 900,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#FFD700'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
                >
                  Agregar al Carrito
                </button>

                {/* Badges de confianza */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '0.25rem' }}>
                  {[
                    { icon: '✅', text: 'Producto 100% original garantizado' },
                    { icon: '🚚', text: 'Envío gratis en La Plata y alrededores' },
                    { icon: '💳', text: 'Pagás al recibir el producto' },
                  ].map(({ icon, text }) => (
                    <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                      <span style={{ fontSize: '0.85rem' }}>{icon}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                    border: `1.5px solid ${selectedSize === size ? 'var(--accent-yellow)' : 'var(--border-color)'}`,
                    background: selectedSize === size ? 'rgba(255,215,0,0.12)' : 'var(--bg-tertiary)',
                    color: selectedSize === size ? 'var(--accent-yellow)' : 'var(--text-primary)',
                    fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                    fontFamily: 'inherit', transition: 'all 0.15s'
                  }}
                >
                  {cleanSize(size)}
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
                            {size && <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Talle {cleanSize(size)}</p>}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <div style={{
                                display: 'flex', alignItems: 'center', gap: '0.6rem',
                                background: 'var(--bg-secondary)', borderRadius: '8px', padding: '0.3rem 0.6rem'
                              }}>
                                <button onClick={() => updateQty(product, size, -1)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700, lineHeight: 1, padding: 0 }}>−</button>
                                <span style={{ fontWeight: 700, fontSize: '0.9rem', minWidth: '18px', textAlign: 'center' }}>{qty}</span>
                                <button onClick={() => updateQty(product, size, 1)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700, lineHeight: 1, padding: 0 }}>+</button>
                              </div>
                              <span style={{ fontWeight: 800, fontSize: '1rem' }}>{fmt(effectivePrice(product) * qty)}</span>
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
