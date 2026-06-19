import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, Info, Tag, ShoppingBag } from 'lucide-react';
import { supabase } from '../supabaseClient';

const MOCK_PRODUCTS = [
  {
    id: 'mock-1',
    name: 'Air Jordan 1 Retro High OG',
    brand: 'Jordan',
    price: 189.99,
    sizes: ['40', '41', '42', '43', '44', '45'],
    image_url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=800',
    description: 'El icono de la cultura urbana. Diseñado originalmente para las canchas de baloncesto, el Air Jordan 1 ofrece durabilidad y soporte premium con una parte superior de cuero y la legendaria unidad Air-Sole en el talón.'
  },
  {
    id: 'mock-2',
    name: 'Ultraboost Light 23',
    brand: 'Adidas',
    price: 199.99,
    sizes: ['39', '40', '41', '42', '43'],
    image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800',
    description: 'Experimenta una energía épica con las nuevas Ultraboost Light, las Ultraboost más ligeras jamás creadas. Su mediasuela Boost de última generación ofrece una amortiguación y reactividad sin precedentes.'
  },
  {
    id: 'mock-3',
    name: 'Air Max Plus "Tuned Air"',
    brand: 'Nike',
    price: 179.99,
    sizes: ['40', '41', '42', '43', '44'],
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
    description: 'Deja que tu actitud marque el ritmo con una experiencia Tuned Air que ofrece una estabilidad excelente y una amortiguación increíble. Con malla transpirable y las icónicas líneas de diseño onduladas.'
  },
  {
    id: 'mock-4',
    name: 'Classic Club C 85 Vintage',
    brand: 'Reebok',
    price: 94.99,
    sizes: ['38', '39', '40', '41', '42', '43', '44'],
    image_url: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&q=80&w=800',
    description: 'El minimalismo de los 80 en su máxima expresión. Esta silueta atemporal de cuero suave ofrece un estilo limpio e informal con un toque vintage ideal para combinar con cualquier prenda.'
  },
  {
    id: 'mock-5',
    name: 'RS-X Triple Black Edition',
    brand: 'Puma',
    price: 119.99,
    sizes: ['41', '42', '43', '44', '45'],
    image_url: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&q=80&w=800',
    description: 'Vuelve la silueta RS-X del futuro retro. Con un diseño disruptivo y detalles geométricos, esta zapatilla de running de calle destaca por su comodidad extrema y estética industrial.'
  },
  {
    id: 'mock-6',
    name: '550 Vintage White Green',
    brand: 'New Balance',
    price: 149.99,
    sizes: ['40', '41', '42', '43', '44'],
    image_url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=800',
    description: 'El calzado de baloncesto retro que conquistó la moda urbana. El New Balance 550 rinde homenaje al modelo original de 1989 con cuero premium de grano completo y sutiles acentos en verde deportivo.'
  }
];

export default function Store() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('Todos');
  const [sortBy, setSortBy] = useState('newest'); // newest, price-asc, price-desc
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dbStatus, setDbStatus] = useState('checking'); // checking, connected, offline

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setProducts(data);
        setDbStatus('connected');
      } else {
        // Connected but table empty -> show mocks but mark status
        setProducts(MOCK_PRODUCTS);
        setDbStatus('connected-empty');
      }
    } catch (error) {
      console.log('Using mock products (Supabase database offline or not configured). Details:', error.message);
      setProducts(MOCK_PRODUCTS);
      setDbStatus('offline');
    } finally {
      setLoading(false);
    }
  };

  // Get list of unique brands for filters
  const brands = ['Todos', ...new Set(products.map(p => p.brand))];

  // Filtering & Sorting logic
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) || 
                            product.brand.toLowerCase().includes(search.toLowerCase()) ||
                            (product.description && product.description.toLowerCase().includes(search.toLowerCase()));
      const matchesBrand = selectedBrand === 'Todos' || product.brand === selectedBrand;
      return matchesSearch && matchesBrand;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      // Default / newest
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* DB Connection Status Bar */}
      {dbStatus === 'offline' && (
        <div style={{
          background: 'rgba(234, 179, 8, 0.15)',
          border: '1px solid rgba(234, 179, 8, 0.3)',
          color: '#facc15',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          marginTop: '-1rem'
        }}>
          <span>⚠️ <strong>Modo Demo Local:</strong> Supabase no está conectado o la tabla `products` no existe. Se muestran zapatillas de muestra. Agrega tus credenciales en el archivo `.env`.</span>
        </div>
      )}

      {dbStatus === 'connected-empty' && (
        <div style={{
          background: 'rgba(59, 130, 246, 0.15)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          color: '#60a5fa',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          marginTop: '-1rem'
        }}>
          <span>⚡ Conectado a Supabase correctamente, pero la tabla `products` está vacía. Inicia sesión en el panel de administrador para subir productos, o revisa las zapatillas de muestra a continuación.</span>
        </div>
      )}

      {/* Hero Section */}
      <div className="glass-panel" style={{
        padding: '3rem 2.5rem',
        borderRadius: 'var(--radius-lg)',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(255, 63, 63, 0.15) 0%, rgba(12, 15, 23, 0.95) 60%)',
        border: '1px solid rgba(255, 63, 63, 0.15)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '2rem'
      }}>
        {/* Subtle grid background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.05,
          backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          pointerEvents: 'none'
        }} />

        <div style={{ flex: '1 1 450px', zIndex: 1 }}>
          <span style={{
            background: 'var(--accent-gradient)',
            padding: '0.35rem 0.75rem',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            boxShadow: '0 4px 10px rgba(255, 63, 63, 0.2)'
          }}>
            NUEVA COLECCIÓN 2026
          </span>
          <h1 style={{ fontSize: '3rem', marginTop: '1rem', lineHeight: 1.1, fontWeight: 800 }}>
            PASIÓN POR <br />
            <span style={{
              background: 'var(--accent-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              LAS ZAPATILLAS
            </span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', fontSize: '1.05rem', maxWidth: '450px' }}>
            Explora las mejores siluetas de la temporada. Modelos exclusivos de tus marcas preferidas diseñados para el estilo urbano y deportivo.
          </p>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <a href="#productos-grid" className="btn-primary">
              <ShoppingBag size={18} />
              Ver Catálogo
            </a>
          </div>
        </div>

        <div style={{
          flex: '1 1 350px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          height: '250px'
        }}>
          {/* Neon background light */}
          <div style={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: '#ff3f3f',
            filter: 'blur(90px)',
            opacity: 0.35,
            zIndex: 0
          }} />
          <img 
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800" 
            alt="Hero Sneaker" 
            style={{
              maxHeight: '260px',
              objectFit: 'contain',
              transform: 'rotate(-15deg) translateY(-10px)',
              filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.8))',
              animation: 'float 4s ease-in-out infinite',
              zIndex: 1
            }}
          />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: rotate(-15deg) translateY(0px); }
          50% { transform: rotate(-12deg) translateY(-15px); }
          100% { transform: rotate(-15deg) translateY(0px); }
        }
      `}} />

      {/* Main Showcase Section */}
      <div id="productos-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Search, Filter & Sort Controls */}
        <div className="glass-panel" style={{
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Search bar */}
          <div style={{ position: 'relative', flex: '1 1 300px' }}>
            <Search size={18} style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }} />
            <input 
              type="text" 
              placeholder="Buscar por modelo o marca..." 
              className="form-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.75rem' }}
            />
          </div>

          {/* Sort selection */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <ArrowUpDown size={16} />
              <span>Ordenar por:</span>
            </div>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input"
              style={{ width: 'auto', padding: '0.5rem 2rem 0.5rem 1rem', cursor: 'pointer' }}
            >
              <option value="newest">Más recientes</option>
              <option value="price-asc">Precio: Bajo a Alto</option>
              <option value="price-desc">Precio: Alto a Bajo</option>
            </select>
          </div>
        </div>

        {/* Brand Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {brands.map(brand => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '20px',
                border: '1px solid',
                borderColor: selectedBrand === brand ? 'rgba(255, 63, 63, 0.4)' : 'var(--glass-border)',
                background: selectedBrand === brand ? 'var(--accent-gradient)' : 'rgba(255, 255, 255, 0.03)',
                color: selectedBrand === brand ? '#fff' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              {brand}
            </button>
          ))}
        </div>

        {/* Sneaker Grid */}
        {loading ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '5rem 0',
            gap: '1rem',
            color: 'var(--text-secondary)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(255, 63, 63, 0.1)',
              borderTopColor: '#ff3f3f',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <span>Cargando colección...</span>
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}} />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="glass-panel" style={{
            padding: '5rem 2rem',
            textAlign: 'center',
            color: 'var(--text-secondary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.25rem'
          }}>
            <SlidersHorizontal size={40} style={{ color: 'var(--text-muted)' }} />
            <div>
              <h3>No se encontraron zapatillas</h3>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Prueba ajustando los filtros de búsqueda o marcas.</p>
            </div>
            <button 
              className="btn-secondary"
              onClick={() => { setSearch(''); setSelectedBrand('Todos'); }}
              style={{ fontSize: '0.875rem', padding: '0.5rem 1.25rem' }}
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="glass-card"
                style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                {/* Image Wrap */}
                <div style={{
                  position: 'relative',
                  paddingTop: '80%',
                  background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.03) 0%, rgba(0, 0, 0, 0.3) 100%)',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }} onClick={() => setSelectedProduct(product)}>
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800'; // fallback
                    }}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      maxWidth: '85%',
                      maxHeight: '75%',
                      objectFit: 'contain',
                      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.4))'
                    }}
                    className="sneaker-thumbnail"
                  />
                  <span style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(4px)',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    color: '#ff8008',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    {product.brand}
                  </span>
                </div>

                {/* Card Body */}
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.75rem' }}>
                  <h3 
                    onClick={() => setSelectedProduct(product)}
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      height: '2.8rem',
                      lineHeight: '1.4'
                    }}
                  >
                    {product.name}
                  </h3>
                  
                  {/* Sizes */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                    {product.sizes && product.sizes.slice(0, 4).map(size => (
                      <span key={size} style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid var(--border-color)',
                        padding: '0.15rem 0.4rem',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        color: 'var(--text-secondary)'
                      }}>
                        T{size}
                      </span>
                    ))}
                    {product.sizes && product.sizes.length > 4 && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', alignSelf: 'center', marginLeft: '0.25rem' }}>
                        +{product.sizes.length - 4} más
                      </span>
                    )}
                  </div>

                  {/* Price & Action */}
                  <div style={{
                    marginTop: 'auto',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Precio</span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                        ${Number(product.price).toLocaleString('es-CL')}
                      </span>
                    </div>
                    
                    <button 
                      onClick={() => setSelectedProduct(product)}
                      className="btn-secondary"
                      style={{
                        padding: '0.4rem',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: 'none',
                        background: 'rgba(255, 63, 63, 0.15)',
                        color: '#ff3f3f'
                      }}
                    >
                      <Info size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Styled card image zoom via css injected inline */}
      <style dangerouslySetInnerHTML={{__html: `
        .glass-card:hover .sneaker-thumbnail {
          transform: translate(-50%, -55%) rotate(-5deg) scale(1.1);
        }
      `}} />

      {/* Quick View Modal */}
      {selectedProduct && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999,
          padding: '1rem',
          animation: 'fadeIn 0.2s ease-out'
        }} onClick={() => setSelectedProduct(null)}>
          <div 
            className="glass-panel" 
            style={{
              maxWidth: '750px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              display: 'flex',
              flexWrap: 'wrap',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%)',
              padding: '0'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Section */}
            <div style={{
              flex: '1 1 300px',
              background: 'radial-gradient(circle at center, rgba(255, 63, 63, 0.08) 0%, rgba(0, 0, 0, 0.2) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              position: 'relative',
              minHeight: '300px'
            }}>
              <img 
                src={selectedProduct.image_url} 
                alt={selectedProduct.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800'; // fallback
                }}
                style={{
                  maxWidth: '90%',
                  maxHeight: '260px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.6))'
                }}
              />
            </div>

            {/* Modal details section */}
            <div style={{
              flex: '1 2 400px',
              padding: '2.5rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              position: 'relative'
            }}>
              {/* Close button */}
              <button 
                onClick={() => setSelectedProduct(null)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: 'none',
                  borderRadius: '50%',
                  padding: '0.4rem',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <span style={{ fontSize: '1.2rem', lineHeight: '1' }}>✕</span>
              </button>

              <div>
                <span style={{
                  color: '#ff8008',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {selectedProduct.brand}
                </span>
                <h2 style={{ fontSize: '1.75rem', marginTop: '0.25rem', lineHeight: '1.2' }}>{selectedProduct.name}</h2>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
                  ${Number(selectedProduct.price).toLocaleString('es-CL')}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#ff3f3f', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                  <Tag size={12} /> Envío gratis
                </span>
              </div>

              {selectedProduct.description && (
                <div>
                  <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Descripción
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                    {selectedProduct.description}
                  </p>
                </div>
              )}

              <div>
                <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Tallas Disponibles (EUR)
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {selectedProduct.sizes && selectedProduct.sizes.map(size => (
                    <button 
                      key={size}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-color)',
                        padding: '0.5rem 0.85rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onClick={() => alert(`Seleccionaste talla ${size}. ¡Excelente elección!`)}
                      className="size-pill"
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <style dangerouslySetInnerHTML={{__html: `
                  .size-pill:hover {
                    background: var(--accent-gradient) !important;
                    border-color: transparent !important;
                    color: #fff !important;
                  }
                `}} />
              </div>

              <button 
                onClick={() => alert('¡Funcionalidad de compra agregada como demo! Redirigiendo a pasarela...')}
                className="btn-primary" 
                style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', padding: '1rem' }}
              >
                Comprar Ahora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
