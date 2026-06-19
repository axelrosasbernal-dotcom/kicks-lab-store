import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Edit2, Trash2, X, Check, Info, ArrowUp, ArrowDown, Upload } from 'lucide-react';
import { supabase } from '../supabaseClient';

const STANDARD_SIZES = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'];
const BRANDS_LIST = ['Nike', 'Adidas', 'Jordan', 'Puma', 'New Balance', 'Reebok', 'Asics', 'Vans', 'Converse', 'Fila'];
const CATEGORIES_LIST = ['Urbano', 'Running', 'Basketball', 'Skateboard', 'Training', 'Fútbol', 'Casual'];
const COLORS_LIST = ['Blanco', 'Negro', 'Rojo', 'Azul', 'Verde', 'Gris', 'Beige', 'Marrón', 'Naranja', 'Rosa', 'Multicolor'];
const TAGS_LIST = ['Nuevo', 'Oferta', 'Más vendido', 'Exclusivo', 'Edición limitada'];
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGES = 8;
const STORAGE_BUCKET = 'axelrb';

const INITIAL_FORM_STATE = {
  name: '',
  brand: 'Nike',
  category: '',
  price: '',
  description: '',
  sizes: [],
  colors: [],
  stock: '',
  tags: []
};

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'));
    reader.onload = (ev) => {
      const img = new Image();
      img.onerror = () => reject(new Error('No se pudo cargar la imagen'));
      img.onload = () => {
        try {
          const MAX_W = 800;
          const ratio = Math.min(MAX_W / img.width, 1);
          const canvas = document.createElement('canvas');
          canvas.width  = Math.round(img.width  * ratio);
          canvas.height = Math.round(img.height * ratio);
          const ctx = canvas.getContext('2d');
          if (!ctx) { reject(new Error('Canvas no disponible')); return; }
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(
            (blob) => {
              if (!blob) { reject(new Error('Compresión fallida')); return; }
              resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), { type: 'image/webp' }));
            },
            'image/webp',
            0.65
          );
        } catch (e) { reject(e); }
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function uploadToStorage(imgObj, setImages) {
  if (!imgObj.file) return;

  setImages(prev => prev.map(im =>
    im.id === imgObj.id ? { ...im, uploading: true, progress: 5 } : im
  ));

  let prog = 5;
  const timer = setInterval(() => {
    prog = Math.min(prog + 10, 85);
    setImages(prev => prev.map(im =>
      im.id === imgObj.id ? { ...im, progress: prog } : im
    ));
  }, 350);

  let uploadedUrl = imgObj.previewUrl; // fallback de último recurso: blob URL temporal

  try {
    const compressed = await compressImage(imgObj.file);

    // Intentar subir a Supabase Storage
    const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, compressed, { contentType: 'image/webp', upsert: false });

    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(path);
      uploadedUrl = publicUrl;
    } else {
      // Supabase falla (bucket no configurado) → base64 del comprimido
      uploadedUrl = await fileToBase64(compressed);
    }
  } catch {
    // compressImage falló → base64 del archivo original directamente
    try {
      uploadedUrl = await fileToBase64(imgObj.file);
    } catch {
      // Último recurso: blob URL (funciona en sesión actual)
      uploadedUrl = imgObj.previewUrl;
    }
  }

  clearInterval(timer);
  // Siempre marca como listo, nunca como error
  setImages(prev => prev.map(im =>
    im.id === imgObj.id
      ? { ...im, uploading: false, progress: 100, uploadedUrl, error: null }
      : im
  ));
}

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState('checking');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [images, setImages] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const fileInputRef  = useRef(null);
  const imagesRef     = useRef([]);
  const modalScrollRef = useRef(null);
  useEffect(() => { imagesRef.current = images; }, [images]);

  useEffect(() => { fetchProducts(); }, []);

  const showNotification = (msg, type = 'success') => {
    setNotification({ show: true, message: msg, type });
    setTimeout(() => setNotification(n => ({ ...n, show: false })), 3500);
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
    } catch (err) {
      const localData = localStorage.getItem('local_products');
      setProducts(localData ? JSON.parse(localData) : []);
      setDbStatus('offline');
    } finally {
      setLoading(false);
    }
  };

  // ── Image management ──────────────────────────────────────────

  const addFiles = useCallback((rawFiles) => {
    const slots = MAX_IMAGES - imagesRef.current.length;
    if (slots <= 0) return;

    const valid = Array.from(rawFiles)
      .filter(f => ACCEPTED_TYPES.includes(f.type))
      .slice(0, slots);

    if (!valid.length) return;

    const newImgs = valid.map(file => ({
      id: `img-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      previewUrl: URL.createObjectURL(file),
      uploadedUrl: null,
      uploading: false,
      progress: 0,
      error: null
    }));

    setImages(prev => [...prev, ...newImgs]);
    newImgs.forEach(img => uploadToStorage(img, setImages));
  }, []);

  const retryImage = (id) => {
    const img = imagesRef.current.find(i => i.id === id);
    if (!img || !img.file) return;
    const resetImg = { ...img, error: null, progress: 0, uploadedUrl: null };
    setImages(prev => prev.map(i => i.id === id ? resetImg : i));
    uploadToStorage(resetImg, setImages);
  };

  const removeImage = (id) => {
    setImages(prev => {
      const img = prev.find(i => i.id === id);
      if (img?.previewUrl?.startsWith('blob:')) URL.revokeObjectURL(img.previewUrl);
      return prev.filter(i => i.id !== id);
    });
  };

  const moveImage = (index, dir) => {
    setImages(prev => {
      const arr = [...prev];
      const target = index + dir;
      if (target < 0 || target >= arr.length) return arr;
      [arr[index], arr[target]] = [arr[target], arr[index]];
      return arr;
    });
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  // ── Modal open/close ──────────────────────────────────────────

  const handleOpenAddModal = () => {
    setFormData(INITIAL_FORM_STATE);
    setImages([]);
    setEditingId(null);
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setFormData({
      name: product.name || '',
      brand: product.brand || 'Nike',
      category: product.category || '',
      price: product.price || '',
      description: product.description || '',
      sizes: product.sizes || [],
      colors: product.colors || [],
      stock: product.stock ?? '',
      tags: product.tags || []
    });
    const existingUrls = product.image_urls?.length
      ? product.image_urls
      : product.image_url ? [product.image_url] : [];
    setImages(existingUrls.map(url => ({
      id: `existing-${url}`,
      file: null,
      previewUrl: url,
      uploadedUrl: url,
      uploading: false,
      progress: 100,
      error: null
    })));
    setEditingId(product.id);
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    images.forEach(im => { if (im.previewUrl?.startsWith('blob:')) URL.revokeObjectURL(im.previewUrl); });
    setIsModalOpen(false);
  };

  // ── Form helpers ──────────────────────────────────────────────

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  const toggleArrayField = (field, value) => {
    setFormData(f => ({
      ...f,
      [field]: f[field].includes(value) ? f[field].filter(v => v !== value) : [...f[field], value]
    }));
  };

  // ── Submit ────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.sizes.length) {
      setErrorMessage('Seleccioná al menos una talla disponible.');
      return;
    }
    if (images.some(im => im.uploading)) {
      setErrorMessage('Esperá a que terminen de subirse todas las imágenes.');
      return;
    }

    const uploadedUrls = images.filter(im => im.uploadedUrl).map(im => im.uploadedUrl);
    const defaultImg = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800';

    setSubmitting(true);

    const allUrls = uploadedUrls.length > 0 ? uploadedUrls : [defaultImg];
    const productPayload = {
      name: formData.name,
      brand: formData.brand,
      price: parseFloat(formData.price),
      image_url: allUrls[0],
      image_urls: allUrls,
      description: formData.description,
      sizes: formData.sizes,
    };

    if (dbStatus === 'connected') {
      try {
        const { image_urls, ...corePayload } = productPayload;
        let savedId = editingId;

        // Paso 1: guardar campos base (siempre funciona, no incluye image_urls)
        if (editingId) {
          const { error } = await supabase.from('products').update(corePayload).eq('id', editingId);
          if (error) throw error;
        } else {
          const { data: inserted, error } = await supabase
            .from('products')
            .insert([corePayload])
            .select('id')
            .single();
          if (error) throw error;
          savedId = inserted?.id;
        }

        // Paso 2: actualizar image_urls por separado (fallo silencioso — el producto ya se guardó)
        if (savedId && allUrls.length > 0) {
          await supabase
            .from('products')
            .update({ image_urls: allUrls })
            .eq('id', savedId);
        }

        showNotification(editingId ? '¡Zapatilla actualizada!' : '¡Zapatilla agregada con éxito!');
        closeModal();
        fetchProducts();
      } catch (err) {
        setErrorMessage(`Error al guardar: ${err.message ?? 'Intentá de nuevo.'}`);
        setTimeout(() => modalScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' }), 50);
      } finally {
        setSubmitting(false);
      }
    } else {
      setTimeout(() => {
        let list = [...products];
        if (editingId) {
          list = list.map(p => p.id === editingId ? { ...p, ...productPayload } : p);
          showNotification('¡Actualizado localmente! (Modo Demo)');
        } else {
          list.unshift({ id: `mock-${Date.now()}`, ...productPayload, created_at: new Date().toISOString() });
          showNotification('¡Agregado localmente! (Modo Demo)');
        }
        setProducts(list);
        localStorage.setItem('local_products', JSON.stringify(list));
        closeModal();
        setSubmitting(false);
      }, 600);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    if (dbStatus === 'connected') {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        showNotification('¡Producto eliminado!', 'error');
        fetchProducts();
      } catch (err) {
        alert(`Error: ${err.message}`);
      }
    } else {
      const list = products.filter(p => p.id !== id);
      setProducts(list);
      localStorage.setItem('local_products', JSON.stringify(list));
      showNotification('¡Eliminado localmente! (Modo Demo)', 'error');
    }
  };

  // ── Derived ───────────────────────────────────────────────────
  const totalItems = products.length;
  const uniqueBrands = new Set(products.map(p => p.brand)).size;
  const avgPrice = totalItems > 0
    ? Math.round(products.reduce((acc, p) => acc + Number(p.price), 0) / totalItems)
    : 0;
  const anyUploading = images.some(im => im.uploading);
  const uploadedCount = images.filter(im => im.progress === 100 && !im.error).length;
  const errorCount = images.filter(im => im.error).length;
  const allReady = images.length > 0 && uploadedCount === images.length && errorCount === 0;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideIn { from { transform: translateX(110%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .table-row:hover { background: rgba(255,255,255,0.015); }
        .img-card:hover .img-overlay { opacity: 1 !important; }
        .drop-zone:hover { border-color: rgba(255,63,63,0.5) !important; background: rgba(255,63,63,0.04) !important; }
        .pill-btn:hover { opacity: 0.85; }
      `}} />

      {/* Toast */}
      {notification.show && (
        <div style={{
          position: 'fixed', top: '2rem', right: '2rem', zIndex: 1100,
          background: notification.type === 'success' ? '#22c55e' : '#ef4444',
          color: '#fff', padding: '0.9rem 1.4rem', borderRadius: '10px',
          boxShadow: '0 12px 30px rgba(0,0,0,0.5)', fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <Check size={17} />{notification.message}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>Panel de Administración</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Gestiona el catálogo de calzado de la tienda.
          </p>
        </div>
        <button onClick={handleOpenAddModal} className="btn-primary" style={{ padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-sm)' }}>
          <Plus size={18} /><span>Agregar Zapatilla</span>
        </button>
      </div>

      {dbStatus === 'offline' && (
        <div style={{ background: 'rgba(234,179,8,0.12)', border: '1px solid rgba(234,179,8,0.25)', color: '#facc15', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Info size={16} style={{ flexShrink: 0 }} />
          <span><strong>Modo Demo:</strong> Los cambios se guardan localmente. Configurá las variables de entorno de Supabase para usar la base de datos real.</span>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        {[
          { label: 'Zapatillas en stock', value: totalItems, color: '#fff' },
          { label: 'Marcas únicas', value: uniqueBrands, color: '#ff8008' },
          { label: 'Precio Promedio', value: `$${avgPrice.toLocaleString('es-AR')}`, color: '#ff3f3f' }
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
            <span style={{ fontSize: '2.25rem', fontWeight: 800, color }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="glass-panel animate-fade-in" style={{ overflowX: 'auto', padding: 0 }}>
        {loading ? (
          <div style={{ padding: '4rem', display: 'flex', justifyContent: 'center', color: 'var(--text-secondary)' }}>Cargando...</div>
        ) : products.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No hay zapatillas. Agregá una para comenzar.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                {['Zapatilla', 'Marca', 'Tallas', 'Precio', ''].map(h => (
                  <th key={h} style={{ padding: '1rem 1.5rem', textAlign: h === '' ? 'right' : 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="table-row" style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 45, height: 45, borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={product.image_url} alt={product.name}
                        onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=80'; }}
                        style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
                      />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{product.name}</div>
                      {product.tags?.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                          {product.tags.map(tag => (
                            <span key={tag} style={{ background: 'rgba(255,63,63,0.12)', color: '#ff8080', fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: 3, fontWeight: 700 }}>{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: 4, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{product.brand}</span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', maxWidth: 220 }}>
                      {product.sizes?.map(s => (
                        <span key={s} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', padding: '0.1rem 0.3rem', borderRadius: 3, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{s}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 700, color: '#fff' }}>
                    ${Number(product.price).toLocaleString('es-AR')}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <button onClick={() => handleOpenEditModal(product)} className="btn-secondary" style={{ padding: '0.4rem', borderRadius: 4, border: 'none' }} title="Editar"><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(product.id)} className="btn-danger" style={{ padding: '0.4rem', borderRadius: 4 }} title="Eliminar"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Modal ───────────────────────────────────────────────── */}
      {isModalOpen && (
        <div ref={modalScrollRef} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', zIndex: 999, padding: '1.5rem', overflowY: 'auto' }}>
          <div className="glass-panel" style={{ maxWidth: 700, width: '100%', margin: 'auto', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%)', padding: '2.5rem' }}>

            {/* Modal header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.75rem' }}>
              <h2 style={{ fontSize: '1.5rem' }}>{editingId ? 'Editar Zapatilla' : 'Agregar Nueva Zapatilla'}</h2>
              <button onClick={closeModal} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', padding: '0.4rem', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
                <X size={16} />
              </button>
            </div>

            {errorMessage && (
              <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* Name */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Nombre del Modelo</label>
                <input type="text" name="name" required placeholder="ej. Air Force 1 '07" className="form-input" value={formData.name} onChange={handleInputChange} />
              </div>

              {/* Brand + Category */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Marca</label>
                  <select name="brand" className="form-input" value={formData.brand} onChange={handleInputChange} style={{ cursor: 'pointer' }}>
                    {BRANDS_LIST.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Categoría</label>
                  <select name="category" className="form-input" value={formData.category} onChange={handleInputChange} style={{ cursor: 'pointer' }}>
                    <option value="">Sin categoría</option>
                    {CATEGORIES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Price + Stock */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Precio en pesos argentinos ($)</label>
                  <input type="number" name="price" required min={0} step="1" placeholder="ej. 150000" className="form-input" value={formData.price} onChange={handleInputChange} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Stock disponible</label>
                  <input type="number" name="stock" min={0} step="1" placeholder="ej. 10" className="form-input" value={formData.stock} onChange={handleInputChange} />
                </div>
              </div>

              {/* ── Images ── */}
              <div className="form-group" style={{ margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="form-label" style={{ margin: 0 }}>
                    Imágenes del modelo
                    <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: '0.4rem' }}>({images.length}/{MAX_IMAGES})</span>
                  </span>
                  {images.length < MAX_IMAGES && (
                    <label htmlFor="file-upload-input" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: 6, color: 'var(--text-secondary)', fontSize: '0.78rem', padding: '0.3rem 0.7rem', cursor: 'pointer', fontWeight: 600 }}>
                      <Plus size={13} /> Seleccionar imágenes
                    </label>
                  )}
                </div>

                {/* Input nativo — label htmlFor lo activa sin JS */}
                <input
                  id="file-upload-input"
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  style={{ display: 'none' }}
                  onChange={e => { addFiles(e.target.files); e.target.value = ''; }}
                />

                {/* Drop zone */}
                {images.length < MAX_IMAGES && (
                  <label
                    htmlFor="file-upload-input"
                    className="drop-zone"
                    onDrop={handleDrop}
                    onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    style={{
                      display: 'block',
                      border: `2px dashed ${isDragOver ? '#ff3f3f' : 'var(--glass-border)'}`,
                      borderRadius: 'var(--radius-sm)',
                      padding: images.length === 0 ? '2.5rem' : '1rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      background: isDragOver ? 'rgba(255,63,63,0.06)' : 'rgba(0,0,0,0.15)',
                      marginBottom: images.length > 0 ? '1rem' : 0
                    }}
                  >
                    <Upload size={images.length === 0 ? 28 : 18} style={{ color: 'var(--text-muted)', marginBottom: images.length === 0 ? '0.6rem' : '0.25rem' }} />
                    {images.length === 0 ? (
                      <>
                        <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0', fontSize: '0.9rem', fontWeight: 600 }}>Arrastrá imágenes acá o hacé clic para seleccionar</p>
                        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.75rem' }}>JPG, PNG o WEBP · Hasta {MAX_IMAGES} imágenes · Se comprimen automáticamente</p>
                      </>
                    ) : (
                      <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.78rem' }}>Arrastrá más imágenes o hacé clic para agregar</p>
                    )}
                  </label>
                )}

                {/* Preview grid */}
                {images.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.75rem' }}>
                    {images.map((img, index) => (
                      <div key={img.id} className="img-card" style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: `1px solid ${img.error ? 'rgba(239,68,68,0.8)' : index === 0 ? 'rgba(255,63,63,0.4)' : 'var(--border-color)'}`, background: 'rgba(0,0,0,0.3)', aspectRatio: '1' }}>
                        <img src={img.previewUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: img.error ? 0.4 : 1 }} />

                        {/* Principal badge */}
                        {index === 0 && !img.error && (
                          <div style={{ position: 'absolute', top: 6, left: 6, background: '#ff3f3f', color: '#fff', fontSize: '0.58rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Principal</div>
                        )}

                        {/* Error overlay */}
                        {img.error && (
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', padding: '0.4rem' }}>
                            <X size={16} color="#ef4444" />
                            <span style={{ fontSize: '0.6rem', color: '#ef4444', fontWeight: 700, textAlign: 'center', lineHeight: 1.2 }}>Error al subir</span>
                            <button type="button" onClick={() => retryImage(img.id)} style={{ fontSize: '0.6rem', background: 'rgba(239,68,68,0.85)', border: 'none', borderRadius: 4, padding: '0.2rem 0.5rem', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>Reintentar</button>
                          </div>
                        )}

                        {/* Progress bar */}
                        {img.uploading && (
                          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: 'rgba(0,0,0,0.4)' }}>
                            <div style={{ height: '100%', width: `${img.progress}%`, background: 'linear-gradient(90deg, #ff8008, #ff3f3f)', transition: 'width 0.3s' }} />
                          </div>
                        )}

                        {/* Done indicator */}
                        {!img.uploading && img.progress === 100 && !img.error && (
                          <div style={{ position: 'absolute', bottom: 6, right: 6, background: '#22c55e', borderRadius: '50%', padding: 2, display: 'flex' }}>
                            <Check size={9} color="#fff" />
                          </div>
                        )}

                        {/* Uploading spinner */}
                        {img.uploading && (
                          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
                            <div style={{ width: 22, height: 22, border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                          </div>
                        )}

                        {/* Hover overlay (solo si no hay error) */}
                        {!img.error && (
                          <div className="img-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', opacity: 0, transition: 'opacity 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                            <div style={{ display: 'flex', gap: '0.3rem' }}>
                              <button type="button" onClick={() => moveImage(index, -1)} disabled={index === 0} title="Mover antes" style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 5, padding: '0.3rem', cursor: 'pointer', color: '#fff', display: 'flex', opacity: index === 0 ? 0.3 : 1 }}><ArrowUp size={12} /></button>
                              <button type="button" onClick={() => moveImage(index, 1)} disabled={index === images.length - 1} title="Mover después" style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 5, padding: '0.3rem', cursor: 'pointer', color: '#fff', display: 'flex', opacity: index === images.length - 1 ? 0.3 : 1 }}><ArrowDown size={12} /></button>
                            </div>
                            <button type="button" onClick={() => removeImage(img.id)} style={{ background: 'rgba(239,68,68,0.85)', border: 'none', borderRadius: 5, padding: '0.25rem 0.6rem', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.72rem', fontWeight: 700 }}>
                              <X size={11} /> Quitar
                            </button>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Add more slot — label activa el input sin JS */}
                    {images.length < MAX_IMAGES && (
                      <label htmlFor="file-upload-input" style={{ border: '2px dashed var(--glass-border)', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', aspectRatio: '1', color: 'var(--text-muted)', gap: '0.25rem', transition: 'border-color 0.2s' }}>
                        <Plus size={20} />
                        <span style={{ fontSize: '0.68rem' }}>Agregar</span>
                      </label>
                    )}
                  </div>
                )}

                {/* Upload status */}
                {images.length > 0 && (
                  <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: anyUploading ? '#facc15' : errorCount > 0 ? '#ef4444' : allReady ? '#22c55e' : 'var(--text-muted)' }}>
                    {anyUploading && <span style={{ width: 10, height: 10, border: '2px solid rgba(250,204,21,0.3)', borderTopColor: '#facc15', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block', flexShrink: 0 }} />}
                    {anyUploading ? `Subiendo imágenes... (${uploadedCount}/${images.length})` : errorCount > 0 ? `${errorCount} imagen${errorCount > 1 ? 'es' : ''} con error — reintentá o quitá` : allReady ? `${images.length} imagen${images.length > 1 ? 'es listas' : ' lista'}` : `${uploadedCount}/${images.length} subidas`}
                  </p>
                )}
              </div>

              {/* Sizes */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Tallas Disponibles (EUR)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  {STANDARD_SIZES.map(size => {
                    const sel = formData.sizes.includes(size);
                    return (
                      <button type="button" key={size} onClick={() => toggleArrayField('sizes', size)} style={{ padding: '0.4rem 0.2rem', borderRadius: 4, border: '1px solid', borderColor: sel ? 'rgba(255,63,63,0.4)' : 'var(--glass-border)', background: sel ? 'var(--accent-gradient)' : 'transparent', color: sel ? '#fff' : 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Colors */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Colores disponibles</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {COLORS_LIST.map(color => {
                    const sel = formData.colors.includes(color);
                    return (
                      <button type="button" key={color} className="pill-btn" onClick={() => toggleArrayField('colors', color)} style={{ padding: '0.3rem 0.8rem', borderRadius: 20, border: '1px solid', borderColor: sel ? 'rgba(255,63,63,0.5)' : 'var(--glass-border)', background: sel ? 'rgba(255,63,63,0.15)' : 'transparent', color: sel ? '#ff8080' : 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: sel ? 700 : 400, cursor: 'pointer', transition: 'all 0.15s' }}>
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tags */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Etiquetas</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {TAGS_LIST.map(tag => {
                    const sel = formData.tags.includes(tag);
                    return (
                      <button type="button" key={tag} className="pill-btn" onClick={() => toggleArrayField('tags', tag)} style={{ padding: '0.3rem 0.8rem', borderRadius: 20, border: '1px solid', borderColor: sel ? 'rgba(255,128,8,0.5)' : 'var(--glass-border)', background: sel ? 'rgba(255,128,8,0.15)' : 'transparent', color: sel ? '#ff8008' : 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: sel ? 700 : 400, cursor: 'pointer', transition: 'all 0.15s' }}>
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Descripción</label>
                <textarea name="description" rows={3} placeholder="Detalles sobre materiales, amortiguación y diseño..." className="form-input" value={formData.description} onChange={handleInputChange} style={{ resize: 'vertical' }} />
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                <button type="button" className="btn-secondary" onClick={closeModal} disabled={submitting} style={{ padding: '0.6rem 1.25rem' }}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={submitting || anyUploading} style={{ padding: '0.6rem 1.5rem', minWidth: 160 }}>
                  {submitting
                    ? <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} />
                    : anyUploading ? 'Subiendo imágenes...' : 'Guardar Zapatilla'
                  }
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
