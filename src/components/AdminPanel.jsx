import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Check, Info } from 'lucide-react';
import { supabase } from '../supabaseClient';

const STANDARD_SIZES = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'];
const BRANDS_LIST = ['Nike', 'Adidas', 'Jordan', 'Puma', 'New Balance', 'Reebok', 'Asics', 'Vans'];

const INITIAL_FORM_STATE = {
  name: '',
  brand: 'Nike',
  price: '',
  image_urls: [''],
  description: '',
  sizes: []
};

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState('checking'); // connected, offline
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const showNotification = (msg, type = 'success') => {
    setNotification({ show: true, message: msg, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
      setDbStatus('connected');
    } catch (error) {
      console.log('AdminPanel: Supabase connection failed. Switching to local state simulation.', error.message);
      // Load mock items to let the user play with it instantly
      const localData = localStorage.getItem('local_products');
      if (localData) {
        setProducts(JSON.parse(localData));
      } else {
        const defaultMocks = [
          {
            id: 'mock-1',
            name: 'Air Jordan 1 Retro High OG',
            brand: 'Jordan',
            price: 189.99,
            sizes: ['40', '41', '42', '43', '44', '45'],
            image_url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=800',
            description: 'El icono de la cultura urbana.',
            created_at: new Date().toISOString()
          },
          {
            id: 'mock-2',
            name: 'Ultraboost Light 23',
            brand: 'Adidas',
            price: 199.99,
            sizes: ['39', '40', '41', '42', '43'],
            image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800',
            description: 'Las Ultraboost más ligeras jamás creadas.',
            created_at: new Date().toISOString()
          }
        ];
        setProducts(defaultMocks);
        localStorage.setItem('local_products', JSON.stringify(defaultMocks));
      }
      setDbStatus('offline');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setFormData(INITIAL_FORM_STATE);
    setEditingId(null);
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setFormData({
      name: product.name,
      brand: product.brand,
      price: product.price,
      image_urls: product.image_urls?.length ? product.image_urls : (product.image_url ? [product.image_url] : ['']),
      description: product.description || '',
      sizes: product.sizes || []
    });
    setEditingId(product.id);
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleSizeToggle = (size) => {
    const currentSizes = [...formData.sizes];
    if (currentSizes.includes(size)) {
      setFormData({
        ...formData,
        sizes: currentSizes.filter(s => s !== size)
      });
    } else {
      setFormData({
        ...formData,
        sizes: [...currentSizes, size]
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUrlChange = (index, value) => {
    const updated = [...formData.image_urls];
    updated[index] = value;
    setFormData({ ...formData, image_urls: updated });
  };

  const handleAddImageUrl = () => {
    setFormData({ ...formData, image_urls: [...formData.image_urls, ''] });
  };

  const handleRemoveImageUrl = (index) => {
    const updated = formData.image_urls.filter((_, i) => i !== index);
    setFormData({ ...formData, image_urls: updated.length ? updated : [''] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.sizes.length === 0) {
      setErrorMessage('Debes seleccionar al menos una talla disponible.');
      return;
    }

    setSubmitting(true);
    const validImageUrls = formData.image_urls.map(u => u.trim()).filter(Boolean);
    const productPayload = {
      name: formData.name,
      brand: formData.brand,
      price: parseFloat(formData.price),
      image_url: validImageUrls[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
      image_urls: validImageUrls.length ? validImageUrls : ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800'],
      description: formData.description,
      sizes: formData.sizes
    };

    if (dbStatus === 'connected') {
      try {
        if (editingId) {
          // Update
          const { error } = await supabase
            .from('products')
            .update(productPayload)
            .eq('id', editingId);

          if (error) throw error;
          showNotification('¡Zapatilla actualizada con éxito!');
        } else {
          // Insert
          const { error } = await supabase
            .from('products')
            .insert([productPayload]);

          if (error) throw error;
          showNotification('¡Nueva zapatilla agregada con éxito!');
        }
        setIsModalOpen(false);
        fetchProducts();
      } catch (error) {
        console.error(error);
        setErrorMessage(`Error al guardar en base de datos: ${error.message}`);
      } finally {
        setSubmitting(false);
      }
    } else {
      // Offline mode -> handle local storage simulation
      setTimeout(() => {
        let updatedList = [...products];
        if (editingId) {
          updatedList = updatedList.map(p => 
            p.id === editingId ? { ...p, ...productPayload, price: Number(productPayload.price) } : p
          );
          showNotification('¡Actualizado localmente! (Modo Demo)');
        } else {
          const newProduct = {
            id: 'mock-' + Date.now(),
            ...productPayload,
            price: Number(productPayload.price),
            created_at: new Date().toISOString()
          };
          updatedList.unshift(newProduct);
          showNotification('¡Agregado localmente! (Modo Demo)');
        }
        setProducts(updatedList);
        localStorage.setItem('local_products', JSON.stringify(updatedList));
        setIsModalOpen(false);
        setSubmitting(false);
      }, 600);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

    if (dbStatus === 'connected') {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);

        if (error) throw error;
        showNotification('¡Zapatilla eliminada de la base de datos!', 'error');
        fetchProducts();
      } catch (error) {
        alert(`Error al eliminar: ${error.message}`);
      }
    } else {
      // Offline mode -> simulated deletion
      const updatedList = products.filter(p => p.id !== id);
      setProducts(updatedList);
      localStorage.setItem('local_products', JSON.stringify(updatedList));
      showNotification('¡Eliminado localmente! (Modo Demo)', 'error');
    }
  };

  // Stats calculation
  const totalItems = products.length;
  const uniqueBrands = new Set(products.map(p => p.brand)).size;
  const avgPrice = totalItems > 0 
    ? Math.round(products.reduce((acc, p) => acc + Number(p.price), 0) / totalItems) 
    : 0;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Toast Notification */}
      {notification.show && (
        <div style={{
          position: 'fixed',
          top: '2rem',
          right: '2rem',
          background: notification.type === 'success' ? '#22c55e' : '#ef4444',
          color: '#fff',
          padding: '1rem 1.5rem',
          borderRadius: 'var(--radius-sm)',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          zIndex: 1000,
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <Check size={18} />
          <span>{notification.message}</span>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}} />

      {/* Admin Panel Header & Status */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>Panel de Administración</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Gestiona el catálogo de calzado disponible en la tienda en tiempo real.
          </p>
        </div>

        <button 
          onClick={handleOpenAddModal} 
          className="btn-primary"
          style={{ padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-sm)' }}
        >
          <Plus size={18} />
          <span>Agregar Zapatilla</span>
        </button>
      </div>

      {dbStatus === 'offline' && (
        <div style={{
          background: 'rgba(234, 179, 8, 0.12)',
          border: '1px solid rgba(234, 179, 8, 0.25)',
          color: '#facc15',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Info size={16} style={{ flexShrink: 0 }} />
          <span><strong>Panel en Modo Demo:</strong> Los cambios se están guardando localmente en tu navegador. Si deseas usar Supabase, completa las claves de tu proyecto en el archivo `.env` de la carpeta del proyecto.</span>
        </div>
      )}

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem'
      }}>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Zapatillas en stock</span>
          <span style={{ fontSize: '2.25rem', fontWeight: 800, color: '#fff' }}>{totalItems}</span>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Marcas únicas</span>
          <span style={{ fontSize: '2.25rem', fontWeight: 800, color: '#ff8008' }}>{uniqueBrands}</span>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Precio Promedio</span>
          <span style={{ fontSize: '2.25rem', fontWeight: 800, color: '#ff3f3f' }}>${avgPrice.toLocaleString('es-AR')}</span>
        </div>
      </div>

      {/* Product List Table */}
      <div className="glass-panel animate-fade-in" style={{ overflowX: 'auto', padding: '0' }}>
        {loading ? (
          <div style={{ padding: '4rem', textCenter: 'center', display: 'flex', justifyContent: 'center', color: 'var(--text-secondary)' }}>
            <span>Cargando tabla...</span>
          </div>
        ) : products.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <p>No hay zapatillas en el catálogo. Agrega una nueva zapatilla para comenzar.</p>
          </div>
        ) : (
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '0.9rem'
          }}>
            <thead>
              <tr style={{
                background: 'rgba(255,255,255,0.02)',
                borderBottom: '1px solid var(--border-color)',
                color: 'var(--text-secondary)'
              }}>
                <th style={{ padding: '1rem 1.5rem' }}>Zapatilla</th>
                <th style={{ padding: '1rem 1.5rem' }}>Marca</th>
                <th style={{ padding: '1rem 1.5rem' }}>Tallas Disponibles</th>
                <th style={{ padding: '1rem 1.5rem' }}>Precio</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr 
                  key={product.id} 
                  style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}
                  className="table-row"
                >
                  <td style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '45px',
                      height: '45px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      flexShrink: 0
                    }}>
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=80';
                        }}
                        style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
                      />
                    </div>
                    <span style={{ fontWeight: 600, color: '#fff' }}>{product.name}</span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{
                      background: 'rgba(255,255,255,0.05)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)'
                    }}>
                      {product.brand}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', maxWidth: '300px' }}>
                      {product.sizes && product.sizes.map(size => (
                        <span key={size} style={{
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid rgba(255,255,255,0.04)',
                          padding: '0.1rem 0.3rem',
                          borderRadius: '3px',
                          fontSize: '0.75rem',
                          color: 'var(--text-secondary)'
                        }}>
                          {size}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 'bold', color: '#fff' }}>
                    ${Number(product.price).toLocaleString('es-AR')}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => handleOpenEditModal(product)} 
                        className="btn-secondary" 
                        style={{ padding: '0.4rem', borderRadius: '4px', border: 'none' }}
                        title="Editar"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)} 
                        className="btn-danger" 
                        style={{ padding: '0.4rem', borderRadius: '4px' }}
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .table-row:hover {
          background: rgba(255, 255, 255, 0.015);
        }
      `}} />

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999,
          padding: '1rem'
        }}>
          <div 
            className="glass-panel" 
            style={{
              maxWidth: '550px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%)',
              padding: '2.5rem'
            }}
          >
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'between',
              alignItems: 'center',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '1rem',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{ fontSize: '1.5rem' }}>
                {editingId ? 'Editar Zapatilla' : 'Agregar Nueva Zapatilla'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: 'none',
                  borderRadius: '50%',
                  padding: '0.4rem',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 'auto'
                }}
              >
                <X size={16} />
              </button>
            </div>

            {errorMessage && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                marginBottom: '1.25rem'
              }}>
                {errorMessage}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div className="form-group" style={{ margin: '0' }}>
                <label className="form-label" htmlFor="prod-name">Nombre del Modelo</label>
                <input 
                  id="prod-name"
                  type="text" 
                  name="name"
                  required
                  placeholder="ej. Air Force 1 '07"
                  className="form-input"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem'
              }}>
                <div className="form-group" style={{ margin: '0' }}>
                  <label className="form-label" htmlFor="prod-brand">Marca</label>
                  <select 
                    id="prod-brand"
                    name="brand"
                    className="form-input"
                    value={formData.brand}
                    onChange={handleInputChange}
                    style={{ cursor: 'pointer' }}
                  >
                    {BRANDS_LIST.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ margin: '0' }}>
                  <label className="form-label" htmlFor="prod-price">Precio en pesos argentinos ($)</label>
                  <input
                    id="prod-price"
                    type="number"
                    name="price"
                    required
                    min={0}
                    step="1"
                    placeholder="ej. 150000"
                    className="form-input"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group" style={{ margin: '0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>Imágenes del modelo</label>
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '6px',
                      color: 'var(--text-secondary)',
                      fontSize: '0.78rem',
                      padding: '0.3rem 0.65rem',
                      cursor: 'pointer',
                      fontWeight: 600,
                      transition: 'background 0.15s'
                    }}
                  >
                    <Plus size={13} /> Agregar imagen
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {formData.image_urls.map((url, index) => (
                    <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <div style={{ position: 'relative', flex: 1 }}>
                        <ImageIcon size={15} style={{
                          position: 'absolute',
                          left: '0.85rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'var(--text-muted)',
                          pointerEvents: 'none'
                        }} />
                        <input
                          type="url"
                          placeholder={index === 0 ? 'URL imagen principal' : `URL imagen ${index + 1}`}
                          className="form-input"
                          value={url}
                          onChange={e => handleImageUrlChange(index, e.target.value)}
                          style={{ paddingLeft: '2.25rem' }}
                        />
                      </div>
                      {url.trim() && (
                        <img
                          src={url}
                          alt={`preview-${index}`}
                          onError={e => { e.target.style.display = 'none'; }}
                          style={{ width: '38px', height: '38px', objectFit: 'contain', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)', flexShrink: 0 }}
                        />
                      )}
                      {formData.image_urls.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveImageUrl(index)}
                          title="Quitar imagen"
                          style={{
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.25)',
                            borderRadius: '6px',
                            color: '#f87171',
                            padding: '0.4rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            flexShrink: 0
                          }}
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.4rem' }}>
                  La primera imagen es la principal. Podés agregar hasta las que quieras.
                </p>
              </div>

              <div className="form-group" style={{ margin: '0' }}>
                <label className="form-label">Tallas Disponibles (EUR)</label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6, 1fr)',
                  gap: '0.5rem',
                  background: 'rgba(0,0,0,0.2)',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)'
                }}>
                  {STANDARD_SIZES.map(size => {
                    const isSelected = formData.sizes.includes(size);
                    return (
                      <button
                        type="button"
                        key={size}
                        onClick={() => handleSizeToggle(size)}
                        style={{
                          padding: '0.4rem 0.2rem',
                          borderRadius: '4px',
                          border: '1px solid',
                          borderColor: isSelected ? 'rgba(255, 63, 63, 0.4)' : 'var(--glass-border)',
                          background: isSelected ? 'var(--accent-gradient)' : 'transparent',
                          color: isSelected ? '#fff' : 'var(--text-secondary)',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="form-group" style={{ margin: '0' }}>
                <label className="form-label" htmlFor="prod-desc">Descripción / Ficha Técnica</label>
                <textarea 
                  id="prod-desc"
                  name="description"
                  rows={3}
                  placeholder="Detalles sobre los materiales, amortiguación y diseño..."
                  className="form-input"
                  value={formData.description}
                  onChange={handleInputChange}
                  style={{ resize: 'vertical' }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end',
                marginTop: '1rem',
                borderTop: '1px solid var(--border-color)',
                paddingTop: '1.25rem'
              }}>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  style={{ padding: '0.6rem 1.25rem' }}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={submitting}
                  style={{ padding: '0.6rem 1.5rem' }}
                >
                  {submitting ? (
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
                    <span>Guardar Zapatilla</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
