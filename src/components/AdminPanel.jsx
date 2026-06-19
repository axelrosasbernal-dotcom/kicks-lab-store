import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Plus, Edit2, Trash2, X, Check, Info, ArrowUp, ArrowDown,
  Upload, Star, Eye, Heart, TrendingUp, Package, Percent,
  DollarSign, ChevronUp, ChevronDown, Tag
} from 'lucide-react';
import { supabase } from '../supabaseClient';

const STANDARD_SIZES = ['35','36','37','38','39','40','41','42','43','44','45','46'];
const BRANDS_LIST    = ['Nike','Adidas','Jordan','Puma','New Balance','Reebok','Asics','Vans','Converse','Fila'];
const CATEGORIES_LIST= ['Urbano','Running','Basketball','Skateboard','Training','Fútbol','Casual'];
const COLORS_LIST    = ['Blanco','Negro','Rojo','Azul','Verde','Gris','Beige','Marrón','Naranja','Rosa','Multicolor'];
const TAGS_LIST      = ['Nuevo','Más vendido','Exclusivo','Edición limitada']; // 'Oferta' es automático
const ACCEPTED_TYPES = ['image/jpeg','image/png','image/webp'];
const MAX_IMAGES     = 8;
const STORAGE_BUCKET = 'axelrb';

// ── Helpers ────────────────────────────────────────────────────────────────────

function getStockStatus(stock) {
  const s = Number(stock);
  if (stock === '' || stock === null || stock === undefined || isNaN(s)) return null;
  if (s === 0)  return { label: 'Agotado',        color: '#ef4444', bg: 'rgba(239,68,68,0.13)' };
  if (s <= 3)   return { label: 'Pocas unidades', color: '#facc15', bg: 'rgba(250,204,21,0.13)' };
  return              { label: 'Disponible',       color: '#22c55e', bg: 'rgba(34,197,94,0.13)' };
}

function isDiscountActive(p) {
  if (!p.discount_enabled) return false;
  const now = new Date();
  if (p.discount_start && new Date(p.discount_start) > now) return false;
  if (p.discount_end   && new Date(p.discount_end)   < now) return false;
  return true;
}

// ── Image utilities ────────────────────────────────────────────────────────────

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'));
    reader.onload  = (ev) => {
      const img = new Image();
      img.onerror = () => reject(new Error('No se pudo cargar la imagen'));
      img.onload  = () => {
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
            'image/webp', 0.65
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
    reader.onload  = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function uploadToStorage(imgObj, setImages) {
  if (!imgObj.file) return;
  setImages(prev => prev.map(im => im.id === imgObj.id ? { ...im, uploading: true, progress: 5 } : im));

  let prog = 5;
  const timer = setInterval(() => {
    prog = Math.min(prog + 10, 85);
    setImages(prev => prev.map(im => im.id === imgObj.id ? { ...im, progress: prog } : im));
  }, 350);

  let uploadedUrl = imgObj.previewUrl;
  try {
    const compressed = await compressImage(imgObj.file);
    const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET).upload(path, compressed, { contentType: 'image/webp', upsert: false });
    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
      uploadedUrl = publicUrl;
    } else {
      uploadedUrl = await fileToBase64(compressed);
    }
  } catch {
    try { uploadedUrl = await fileToBase64(imgObj.file); } catch { uploadedUrl = imgObj.previewUrl; }
  }

  clearInterval(timer);
  setImages(prev => prev.map(im =>
    im.id === imgObj.id ? { ...im, uploading: false, progress: 100, uploadedUrl, error: null } : im
  ));
}

// ── Sub-component: Toggle Switch ───────────────────────────────────────────────

function Switch({ on, color = '#ff3f3f' }) {
  return (
    <div style={{ width: 38, height: 21, borderRadius: 11, background: on ? color : 'rgba(255,255,255,0.1)', position: 'relative', transition: 'background 0.2s', flexShrink: 0, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', top: 2.5, left: on ? 19 : 2.5, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
    </div>
  );
}

// ── Sub-component: Sortable column header ──────────────────────────────────────

function SortTh({ field, children, right, sortField, sortDir, onSort }) {
  const active = sortField === field;
  return (
    <th onClick={() => onSort(field)}
      style={{ padding: '0.9rem 1.2rem', textAlign: right ? 'right' : 'left', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: active ? '#fff' : 'var(--text-secondary)', fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: active ? 700 : 400 }}>
        {children}
        {active
          ? (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)
          : <ChevronDown size={12} style={{ opacity: 0.25 }} />}
      </span>
    </th>
  );
}

// ── Form initial state ─────────────────────────────────────────────────────────

const INITIAL_FORM = {
  name: '', brand: 'Nike', category: '', price: '', description: '',
  sizes: [], colors: [], stock: '', tags: [],
  featured: false,
  discount_enabled: false, discount_type: 'percentage',
  discount_value: '', sale_price: '', discount_start: '', discount_end: '',
};

// ══════════════════════════════════════════════════════════════════════════════
export default function AdminPanel() {
  const [products,     setProducts]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [dbStatus,     setDbStatus]     = useState('checking');
  const [isModalOpen,  setIsModalOpen]  = useState(false);
  const [formData,     setFormData]     = useState(INITIAL_FORM);
  const [images,       setImages]       = useState([]);
  const [isDragOver,   setIsDragOver]   = useState(false);
  const [editingId,    setEditingId]    = useState(null);
  const [submitting,   setSubmitting]   = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [activeTab,    setActiveTab]    = useState('products');
  const [favorites,    setFavorites]    = useState([]);
  const [favLoading,   setFavLoading]   = useState(false);
  const [sortField,    setSortField]    = useState('created_at');
  const [sortDir,      setSortDir]      = useState('desc');

  const fileInputRef   = useRef(null);
  const imagesRef      = useRef([]);
  const modalScrollRef = useRef(null);
  useEffect(() => { imagesRef.current = images; }, [images]);
  useEffect(() => { fetchProducts(); }, []);

  // ── Derived stats ────────────────────────────────────────────────────────────
  const totalItems      = products.length;
  const outOfStock      = products.filter(p => p.stock !== null && p.stock !== undefined && p.stock !== '' && Number(p.stock) === 0).length;
  const avgPrice        = totalItems > 0 ? Math.round(products.reduce((a, p) => a + Number(p.price), 0) / totalItems) : 0;
  const activeDiscounts = products.filter(p => isDiscountActive(p)).length;
  const featuredCount   = products.filter(p => p.featured).length;
  const topBrand        = (() => {
    const c = {};
    products.forEach(p => { if (p.brand) c[p.brand] = (c[p.brand] || 0) + 1; });
    return Object.entries(c).sort(([, a], [, b]) => b - a)[0]?.[0] ?? '—';
  })();

  const anyUploading  = images.some(im => im.uploading);
  const uploadedCount = images.filter(im => im.progress === 100 && !im.error).length;
  const errorCount    = images.filter(im => im.error).length;
  const allReady      = images.length > 0 && uploadedCount === images.length && errorCount === 0;

  // ── Computed discount preview in form ────────────────────────────────────────
  const formSalePrice = (() => {
    if (!formData.discount_enabled) return null;
    if (formData.discount_type === 'percentage' && formData.price && formData.discount_value)
      return Math.round(Number(formData.price) * (1 - Number(formData.discount_value) / 100));
    if (formData.discount_type === 'fixed' && formData.sale_price)
      return Number(formData.sale_price);
    return null;
  })();

  const formDiscountPct = (() => {
    if (!formData.discount_enabled) return null;
    if (formData.discount_type === 'percentage') return formData.discount_value ? Number(formData.discount_value) : null;
    if (formData.discount_type === 'fixed' && formData.price && formData.sale_price)
      return Math.round((1 - Number(formData.sale_price) / Number(formData.price)) * 100);
    return null;
  })();

  // ── Sorted products list ─────────────────────────────────────────────────────
  const sortedProducts = [...products].sort((a, b) => {
    let va = a[sortField], vb = b[sortField];
    if (['price', 'stock', 'view_count'].includes(sortField)) { va = Number(va) || 0; vb = Number(vb) || 0; }
    else { va = va ?? ''; vb = vb ?? ''; }
    if (va < vb) return sortDir === 'asc' ? -1 : 1;
    if (va > vb) return sortDir === 'asc' ?  1 : -1;
    return 0;
  });

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  // ── Notification ─────────────────────────────────────────────────────────────
  const showNotification = (msg, type = 'success') => {
    setNotification({ show: true, message: msg, type });
    setTimeout(() => setNotification(n => ({ ...n, show: false })), 3500);
  };

  // ── Fetch products ───────────────────────────────────────────────────────────
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setProducts(data || []);
      setDbStatus('connected');
    } catch {
      const local = localStorage.getItem('local_products');
      setProducts(local ? JSON.parse(local) : []);
      setDbStatus('offline');
    } finally { setLoading(false); }
  };

  // ── Fetch favorites ranking ──────────────────────────────────────────────────
  const fetchFavorites = useCallback(async () => {
    setFavLoading(true);
    try {
      const { data, error } = await supabase.from('favorites').select('product_id');
      if (error) throw error;
      const counts = {};
      data?.forEach(f => { counts[f.product_id] = (counts[f.product_id] || 0) + 1; });
      const ranking = Object.entries(counts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([pid, count]) => ({ product: products.find(p => p.id === pid), count }))
        .filter(r => r.product);
      setFavorites(ranking);
    } catch {
      setFavorites([]);
    } finally { setFavLoading(false); }
  }, [products]);

  useEffect(() => {
    if (activeTab === 'favorites' && products.length > 0) fetchFavorites();
  }, [activeTab, products, fetchFavorites]);

  // ── Image management ─────────────────────────────────────────────────────────
  const addFiles = useCallback((rawFiles) => {
    const slots = MAX_IMAGES - imagesRef.current.length;
    if (slots <= 0) return;
    const valid = Array.from(rawFiles).filter(f => ACCEPTED_TYPES.includes(f.type)).slice(0, slots);
    if (!valid.length) return;
    const newImgs = valid.map(file => ({
      id: `img-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file, previewUrl: URL.createObjectURL(file),
      uploadedUrl: null, uploading: false, progress: 0, error: null
    }));
    setImages(prev => [...prev, ...newImgs]);
    newImgs.forEach(img => uploadToStorage(img, setImages));
  }, []);

  const retryImage = (id) => {
    const img = imagesRef.current.find(i => i.id === id);
    if (!img || !img.file) return;
    const reset = { ...img, error: null, progress: 0, uploadedUrl: null };
    setImages(prev => prev.map(i => i.id === id ? reset : i));
    uploadToStorage(reset, setImages);
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

  // ── Modal open/close ─────────────────────────────────────────────────────────
  const handleOpenAddModal = () => {
    setFormData(INITIAL_FORM);
    setImages([]);
    setEditingId(null);
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setFormData({
      name:             product.name        || '',
      brand:            product.brand       || 'Nike',
      category:         product.category    || '',
      price:            product.price       || '',
      description:      product.description || '',
      sizes:            product.sizes       || [],
      colors:           product.colors      || [],
      stock:            product.stock       ?? '',
      tags:            (product.tags        || []).filter(t => t !== 'Oferta'),
      featured:         product.featured         || false,
      discount_enabled: product.discount_enabled || false,
      discount_type:    product.discount_type    || 'percentage',
      discount_value:   product.discount_value   || '',
      sale_price:       product.sale_price        || '',
      discount_start:   product.discount_start ? product.discount_start.slice(0, 16) : '',
      discount_end:     product.discount_end   ? product.discount_end.slice(0, 16)   : '',
    });
    const existingUrls = product.image_urls?.length
      ? product.image_urls
      : product.image_url ? [product.image_url] : [];
    setImages(existingUrls.map(url => ({
      id: `existing-${url}`, file: null, previewUrl: url, uploadedUrl: url,
      uploading: false, progress: 100, error: null
    })));
    setEditingId(product.id);
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    images.forEach(im => { if (im.previewUrl?.startsWith('blob:')) URL.revokeObjectURL(im.previewUrl); });
    setIsModalOpen(false);
  };

  // ── Form helpers ─────────────────────────────────────────────────────────────
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

  // ── Submit ───────────────────────────────────────────────────────────────────
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
    const defaultImg   = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800';
    const allUrls      = uploadedUrls.length > 0 ? uploadedUrls : [defaultImg];

    // Calcular precio de oferta final
    let finalSalePrice = null;
    if (formData.discount_enabled) {
      if (formData.discount_type === 'percentage' && formData.price && formData.discount_value)
        finalSalePrice = Math.round(Number(formData.price) * (1 - Number(formData.discount_value) / 100));
      else if (formData.discount_type === 'fixed' && formData.sale_price)
        finalSalePrice = Number(formData.sale_price);
    }

    // 'Oferta' se gestiona automáticamente
    const finalTags = formData.discount_enabled
      ? [...new Set([...formData.tags, 'Oferta'])]
      : formData.tags.filter(t => t !== 'Oferta');

    // Campos base — existen desde siempre en la tabla
    const corePayload = {
      name:        formData.name,
      brand:       formData.brand,
      price:       parseFloat(formData.price),
      image_url:   allUrls[0],
      description: formData.description,
      sizes:       formData.sizes,
    };

    // Campos extendidos — requieren haber corrido el ALTER TABLE en Supabase
    const extendedPayload = {
      category:         formData.category || null,
      colors:           formData.colors,
      stock:            formData.stock !== '' ? parseInt(formData.stock) : null,
      tags:             finalTags,
      featured:         formData.featured,
      discount_enabled: formData.discount_enabled,
      discount_type:    formData.discount_type,
      discount_value:   formData.discount_enabled && formData.discount_value ? Number(formData.discount_value) : null,
      sale_price:       finalSalePrice,
      discount_start:   formData.discount_enabled && formData.discount_start ? formData.discount_start : null,
      discount_end:     formData.discount_enabled && formData.discount_end   ? formData.discount_end   : null,
    };

    // payload local completo (para modo demo / localStorage)
    const productPayload = { ...corePayload, ...extendedPayload };

    setSubmitting(true);

    if (dbStatus === 'connected') {
      try {
        let savedId = editingId;

        // Paso 1: guardar campos base (siempre funciona)
        if (editingId) {
          const { error } = await supabase.from('products').update(corePayload).eq('id', editingId);
          if (error) throw error;
        } else {
          const newId = crypto.randomUUID();
          const { error } = await supabase.from('products').insert([{ ...corePayload, id: newId }]);
          if (error) throw error;
          savedId = newId;
        }

        // Paso 2: actualizar campos extendidos (silencioso si las columnas no existen aún)
        if (savedId) {
          await supabase.from('products').update(extendedPayload).eq('id', savedId);
        }

        // Paso 3: actualizar image_urls (silencioso)
        if (savedId && allUrls.length > 0) {
          await supabase.from('products').update({ image_urls: allUrls }).eq('id', savedId);
        }

        showNotification(editingId ? '¡Zapatilla actualizada!' : '¡Zapatilla agregada con éxito!');
        closeModal();
        fetchProducts();
      } catch (err) {
        setErrorMessage(`Error al guardar: ${err.message ?? 'Intentá de nuevo.'}`);
        setTimeout(() => modalScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' }), 50);
      } finally { setSubmitting(false); }
    } else {
      setTimeout(() => {
        let list = [...products];
        if (editingId) {
          list = list.map(p => p.id === editingId ? { ...p, ...productPayload, image_urls: allUrls } : p);
          showNotification('¡Actualizado localmente! (Modo Demo)');
        } else {
          list.unshift({ id: `mock-${Date.now()}`, ...productPayload, image_urls: allUrls, created_at: new Date().toISOString() });
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
      } catch (err) { alert(`Error: ${err.message}`); }
    } else {
      const list = products.filter(p => p.id !== id);
      setProducts(list);
      localStorage.setItem('local_products', JSON.stringify(list));
      showNotification('¡Eliminado localmente! (Modo Demo)', 'error');
    }
  };

  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideIn { from { transform: translateX(110%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes spin    { to   { transform: rotate(360deg); } }
        .table-row:hover      { background: rgba(255,255,255,0.016) !important; }
        .img-card:hover .img-overlay { opacity: 1 !important; }
        .drop-zone:hover      { border-color: rgba(255,63,63,0.5) !important; background: rgba(255,63,63,0.04) !important; }
        .pill-btn:hover       { opacity: 0.82; }
        .admin-tab            { background: transparent; border: none; cursor: pointer; padding: 0.6rem 1.25rem; font-size: 0.88rem; transition: all 0.15s; border-bottom: 2px solid transparent; }
        .admin-tab.active     { color: #fff; font-weight: 700; border-bottom-color: #ff3f3f; }
        .admin-tab:not(.active){ color: var(--text-secondary); font-weight: 400; }
        .admin-tab:hover:not(.active){ color: #fff; }
        .discount-box         { border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; }
        .discount-header      { padding: 0.9rem 1rem; display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.02); cursor: pointer; user-select: none; transition: background 0.15s; }
        .discount-header:hover{ background: rgba(255,255,255,0.035); }
        input[type="datetime-local"]::-webkit-calendar-picker-indicator { filter: invert(0.6); cursor: pointer; }
      ` }} />

      {/* ── Toast ──────────────────────────────────────────────────────────── */}
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

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>Panel de Administración</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Gestiona el catálogo, el stock y las métricas de la tienda.
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

      {/* ── Dashboard de métricas (siempre visible) ─────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Total productos',       value: totalItems,      color: '#fff',                                         Icon: Package  },
          { label: 'Agotados',              value: outOfStock,      color: outOfStock > 0      ? '#ef4444' : '#22c55e',    Icon: X        },
          { label: 'Precio promedio',        value: `$${avgPrice.toLocaleString('es-AR')}`, color: '#ff8008',              Icon: DollarSign },
          { label: 'Descuentos activos',    value: activeDiscounts, color: activeDiscounts > 0 ? '#4ade80' : 'var(--text-secondary)', Icon: Percent },
          { label: 'Destacados',            value: featuredCount,   color: featuredCount > 0   ? '#f59e0b' : 'var(--text-secondary)', Icon: Star },
          { label: 'Marca top',             value: topBrand,        color: '#a78bfa',                                      Icon: TrendingUp },
        ].map(({ label, value, color, Icon }) => (
          <div key={label} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.73rem', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.3 }}>{label}</span>
              <Icon size={15} style={{ color, opacity: 0.55, flexShrink: 0 }} />
            </div>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color, lineHeight: 1 }}>{value}</span>
          </div>
        ))}
      </div>

      {/* ── Tab navigation ──────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border-color)' }}>
        {[
          { id: 'products',  label: 'Lista de Productos' },
          { id: 'favorites', label: <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Heart size={13} />Favoritos</span> },
        ].map(tab => (
          <button key={tab.id} className={`admin-tab${activeTab === tab.id ? ' active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          TAB: Productos
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'products' && (
        <div className="glass-panel animate-fade-in" style={{ overflowX: 'auto', padding: 0 }}>
          {loading ? (
            <div style={{ padding: '4rem', display: 'flex', justifyContent: 'center', color: 'var(--text-secondary)' }}>Cargando...</div>
          ) : products.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No hay zapatillas. Agregá una para comenzar.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                  <SortTh field="name"       sortField={sortField} sortDir={sortDir} onSort={handleSort}>Zapatilla</SortTh>
                  <SortTh field="brand"      sortField={sortField} sortDir={sortDir} onSort={handleSort}>Marca</SortTh>
                  <th style={{ padding: '0.9rem 1.2rem', color: 'var(--text-secondary)', fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Tallas</th>
                  <SortTh field="price"      sortField={sortField} sortDir={sortDir} onSort={handleSort}>Precio</SortTh>
                  <SortTh field="stock"      sortField={sortField} sortDir={sortDir} onSort={handleSort}>Stock</SortTh>
                  <SortTh field="view_count" sortField={sortField} sortDir={sortDir} onSort={handleSort} right>Visitas</SortTh>
                  <th style={{ padding: '0.9rem 1.2rem', textAlign: 'right' }}></th>
                </tr>
              </thead>
              <tbody>
                {sortedProducts.map(product => {
                  const stockStatus = getStockStatus(product.stock);
                  const discountOn  = isDiscountActive(product);
                  return (
                    <tr key={product.id} className="table-row" style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}>

                      {/* Nombre */}
                      <td style={{ padding: '1rem 1.2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <div style={{ width: 44, height: 44, borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                            <img src={product.image_url} alt={product.name}
                              onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=80'; }}
                              style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} />
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              {product.featured && <Star size={12} style={{ color: '#f59e0b', flexShrink: 0 }} fill="#f59e0b" />}
                              <span style={{ fontWeight: 600, color: '#fff' }}>{product.name}</span>
                            </div>
                            {product.tags?.length > 0 && (
                              <div style={{ display: 'flex', gap: '0.2rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                                {product.tags.map(tag => (
                                  <span key={tag} style={{
                                    background: tag === 'Oferta' ? 'rgba(34,197,94,0.13)' : tag === 'Nuevo' ? 'rgba(96,165,250,0.13)' : 'rgba(255,63,63,0.12)',
                                    color:      tag === 'Oferta' ? '#4ade80'               : tag === 'Nuevo' ? '#60a5fa'              : '#ff8080',
                                    fontSize: '0.62rem', padding: '0.1rem 0.4rem', borderRadius: 3, fontWeight: 700
                                  }}>{tag}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Marca */}
                      <td style={{ padding: '1rem 1.2rem' }}>
                        <span style={{ background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: 4, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{product.brand}</span>
                      </td>

                      {/* Tallas */}
                      <td style={{ padding: '1rem 1.2rem' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem', maxWidth: 210 }}>
                          {product.sizes?.map(s => (
                            <span key={s} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.1rem 0.3rem', borderRadius: 3, fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{s}</span>
                          ))}
                        </div>
                      </td>

                      {/* Precio */}
                      <td style={{ padding: '1rem 1.2rem' }}>
                        {discountOn && product.sale_price ? (
                          <div>
                            <div style={{ fontSize: '0.71rem', color: 'var(--text-muted)', textDecoration: 'line-through', lineHeight: 1.2 }}>${Number(product.price).toLocaleString('es-AR')}</div>
                            <div style={{ fontWeight: 800, color: '#4ade80', fontSize: '0.95rem' }}>${Number(product.sale_price).toLocaleString('es-AR')}</div>
                            {product.discount_value && <div style={{ fontSize: '0.65rem', color: '#86efac' }}>{product.discount_value}% OFF</div>}
                          </div>
                        ) : (
                          <span style={{ fontWeight: 700, color: '#fff' }}>${Number(product.price).toLocaleString('es-AR')}</span>
                        )}
                      </td>

                      {/* Stock */}
                      <td style={{ padding: '1rem 1.2rem' }}>
                        {stockStatus ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <span style={{ background: stockStatus.bg, color: stockStatus.color, fontSize: '0.67rem', padding: '0.15rem 0.45rem', borderRadius: 4, fontWeight: 700, display: 'inline-block', whiteSpace: 'nowrap' }}>
                              {stockStatus.label}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{product.stock} un.</span>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>
                        )}
                      </td>

                      {/* Visitas */}
                      <td style={{ padding: '1rem 1.2rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.3rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                          <Eye size={13} />
                          <span>{(product.view_count || 0).toLocaleString('es-AR')}</span>
                        </div>
                      </td>

                      {/* Acciones */}
                      <td style={{ padding: '1rem 1.2rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button onClick={() => handleOpenEditModal(product)} className="btn-secondary" style={{ padding: '0.4rem', borderRadius: 4, border: 'none' }} title="Editar"><Edit2 size={14} /></button>
                          <button onClick={() => handleDelete(product.id)} className="btn-danger" style={{ padding: '0.4rem', borderRadius: 4 }} title="Eliminar"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB: Favoritos
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'favorites' && (
        <div className="glass-panel animate-fade-in" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.2rem' }}>Productos más guardados por los clientes</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Ranking en tiempo real basado en la tabla <code>favorites</code> de Supabase.</p>
            </div>
            <button onClick={fetchFavorites} className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', borderRadius: 6 }}>
              Actualizar
            </button>
          </div>

          {favLoading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
              <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#ff3f3f', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
              Cargando favoritos...
            </div>
          ) : favorites.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <Heart size={32} style={{ color: 'var(--text-muted)', opacity: 0.3, display: 'block', margin: '0 auto 0.75rem' }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Sin datos de favoritos aún.</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Creá la tabla <code>favorites</code> en Supabase y registrá los clicks de los clientes para ver el ranking aquí.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.73rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', width: 40 }}>#</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Producto</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Marca</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Guardados</th>
                </tr>
              </thead>
              <tbody>
                {favorites.map(({ product, count }, i) => (
                  <tr key={product.id} className="table-row" style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '0.8rem 1rem', color: i < 3 ? '#f59e0b' : 'var(--text-muted)', fontWeight: 800, fontSize: '0.85rem' }}>#{i + 1}</td>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border-color)', flexShrink: 0 }}>
                          <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                        <span style={{ fontWeight: 600, color: '#fff' }}>{product.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.8rem 1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{product.brand}</td>
                    <td style={{ padding: '0.8rem 1rem', textAlign: 'right' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(255,63,63,0.1)', color: '#ff8080', padding: '0.2rem 0.7rem', borderRadius: 20, fontWeight: 700, fontSize: '0.85rem' }}>
                        <Heart size={12} fill="#ff8080" />{count}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL: Agregar / Editar
      ══════════════════════════════════════════════════════════════════════ */}
      {isModalOpen && (
        <div ref={modalScrollRef}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', zIndex: 999, padding: '1.5rem', overflowY: 'auto' }}>
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

              {/* Nombre */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Nombre del Modelo</label>
                <input type="text" name="name" required placeholder="ej. Air Force 1 '07" className="form-input" value={formData.name} onChange={handleInputChange} />
              </div>

              {/* Marca + Categoría */}
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

              {/* Precio */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Precio en pesos argentinos ($)</label>
                <input type="number" name="price" required min={0} step="1" placeholder="ej. 150000" className="form-input" value={formData.price} onChange={handleInputChange} />
              </div>

              {/* ── DESCUENTO / OFERTA ──────────────────────────────────────── */}
              <div className="discount-box">
                <div className="discount-header"
                  onClick={() => setFormData(f => ({ ...f, discount_enabled: !f.discount_enabled }))}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Percent size={15} style={{ color: formData.discount_enabled ? '#4ade80' : 'var(--text-secondary)' }} />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: formData.discount_enabled ? '#fff' : 'var(--text-secondary)' }}>
                      Descuento / Oferta
                    </span>
                    {formData.discount_enabled && (
                      <span style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', fontSize: '0.65rem', padding: '0.1rem 0.45rem', borderRadius: 4, fontWeight: 700 }}>ACTIVO</span>
                    )}
                  </div>
                  <Switch on={formData.discount_enabled} color="#22c55e" />
                </div>

                {formData.discount_enabled && (
                  <div style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border-color)' }}>

                    {/* Tipo */}
                    <div>
                      <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Tipo de descuento</label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {[{ v: 'percentage', l: '% Porcentaje' }, { v: 'fixed', l: '$ Precio final de oferta' }].map(opt => (
                          <button type="button" key={opt.v}
                            onClick={() => setFormData(f => ({ ...f, discount_type: opt.v, discount_value: '', sale_price: '' }))}
                            style={{ flex: 1, padding: '0.45rem', borderRadius: 6, border: '1px solid', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, transition: 'all 0.15s',
                              borderColor: formData.discount_type === opt.v ? 'rgba(34,197,94,0.5)'  : 'var(--glass-border)',
                              background:  formData.discount_type === opt.v ? 'rgba(34,197,94,0.12)' : 'transparent',
                              color:       formData.discount_type === opt.v ? '#4ade80'              : 'var(--text-secondary)' }}>
                            {opt.l}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Valor + preview */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'flex-end' }}>
                      <div>
                        {formData.discount_type === 'percentage' ? (
                          <>
                            <label className="form-label">Porcentaje de descuento (%)</label>
                            <input type="number" min={1} max={99} step={1} placeholder="ej. 20" className="form-input"
                              value={formData.discount_value}
                              onChange={e => setFormData(f => ({ ...f, discount_value: e.target.value }))} />
                          </>
                        ) : (
                          <>
                            <label className="form-label">Precio de oferta ($)</label>
                            <input type="number" min={0} step={1} placeholder="ej. 99900" className="form-input"
                              value={formData.sale_price}
                              onChange={e => setFormData(f => ({ ...f, sale_price: e.target.value }))} />
                          </>
                        )}
                      </div>

                      {formSalePrice && formData.price && (
                        <div style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8, padding: '0.65rem 1rem' }}>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                            ${Number(formData.price).toLocaleString('es-AR')}
                          </div>
                          <div style={{ fontWeight: 800, color: '#4ade80', fontSize: '1.15rem' }}>
                            ${formSalePrice.toLocaleString('es-AR')}
                          </div>
                          {formDiscountPct && (
                            <div style={{ fontSize: '0.7rem', color: '#86efac', fontWeight: 700 }}>{formDiscountPct}% OFF</div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Fechas */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label className="form-label">Inicio de oferta (opcional)</label>
                        <input type="datetime-local" className="form-input" value={formData.discount_start}
                          onChange={e => setFormData(f => ({ ...f, discount_start: e.target.value }))} />
                      </div>
                      <div>
                        <label className="form-label">Fin de oferta (opcional)</label>
                        <input type="datetime-local" className="form-input" value={formData.discount_end}
                          onChange={e => setFormData(f => ({ ...f, discount_end: e.target.value }))} />
                      </div>
                    </div>
                    <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)', margin: 0 }}>
                      Si no ponés fechas, la oferta se activa de forma indefinida mientras el switch esté encendido.
                    </p>
                  </div>
                )}
              </div>

              {/* ── STOCK ───────────────────────────────────────────────────── */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'flex-end' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Stock disponible (unidades)</label>
                  <input type="number" name="stock" min={0} step={1} placeholder="ej. 10" className="form-input" value={formData.stock} onChange={handleInputChange} />
                </div>
                {getStockStatus(formData.stock) && (() => {
                  const s = getStockStatus(formData.stock);
                  return (
                    <div style={{ paddingBottom: '0.1rem' }}>
                      <div style={{ background: s.bg, color: s.color, padding: '0.55rem 1rem', borderRadius: 8, fontWeight: 700, fontSize: '0.88rem', textAlign: 'center', border: `1px solid ${s.color}33` }}>
                        {s.label}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* ── DESTACADO ───────────────────────────────────────────────── */}
              <div onClick={() => setFormData(f => ({ ...f, featured: !f.featured }))}
                style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.9rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid', cursor: 'pointer', userSelect: 'none', transition: 'all 0.2s',
                  borderColor: formData.featured ? 'rgba(245,158,11,0.4)' : 'var(--border-color)',
                  background:  formData.featured ? 'rgba(245,158,11,0.06)' : 'transparent' }}>
                <Switch on={formData.featured} color="#f59e0b" />
                <Star size={16} style={{ color: formData.featured ? '#f59e0b' : 'var(--text-secondary)', flexShrink: 0 }} fill={formData.featured ? '#f59e0b' : 'none'} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: formData.featured ? '#f59e0b' : 'var(--text-secondary)' }}>Producto Destacado</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 1 }}>Aparecerá primero en la sección principal de la tienda</div>
                </div>
              </div>

              {/* ── IMÁGENES ────────────────────────────────────────────────── */}
              <div className="form-group" style={{ margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="form-label" style={{ margin: 0 }}>
                    Imágenes del modelo
                    <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: '0.4rem' }}>({images.length}/{MAX_IMAGES})</span>
                  </span>
                  {images.length < MAX_IMAGES && (
                    <label htmlFor="file-upload-input" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: 6, color: 'var(--text-secondary)', fontSize: '0.78rem', padding: '0.3rem 0.7rem', cursor: 'pointer', fontWeight: 600 }}>
                      <Plus size={13} /> Seleccionar
                    </label>
                  )}
                </div>

                <input id="file-upload-input" ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple
                  style={{ display: 'none' }} onChange={e => { addFiles(e.target.files); e.target.value = ''; }} />

                {images.length < MAX_IMAGES && (
                  <label htmlFor="file-upload-input" className="drop-zone"
                    onDrop={handleDrop} onDragOver={e => { e.preventDefault(); setIsDragOver(true); }} onDragLeave={() => setIsDragOver(false)}
                    style={{ display: 'block', border: `2px dashed ${isDragOver ? '#ff3f3f' : 'var(--glass-border)'}`, borderRadius: 'var(--radius-sm)', padding: images.length === 0 ? '2.5rem' : '1rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', background: isDragOver ? 'rgba(255,63,63,0.06)' : 'rgba(0,0,0,0.15)', marginBottom: images.length > 0 ? '1rem' : 0 }}>
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

                {images.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.75rem' }}>
                    {images.map((img, index) => (
                      <div key={img.id} className="img-card" style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: `1px solid ${img.error ? 'rgba(239,68,68,0.8)' : index === 0 ? 'rgba(255,63,63,0.4)' : 'var(--border-color)'}`, background: 'rgba(0,0,0,0.3)', aspectRatio: '1' }}>
                        <img src={img.previewUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: img.error ? 0.4 : 1 }} />
                        {index === 0 && !img.error && (
                          <div style={{ position: 'absolute', top: 6, left: 6, background: '#ff3f3f', color: '#fff', fontSize: '0.58rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Principal</div>
                        )}
                        {img.error && (
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', padding: '0.4rem' }}>
                            <X size={16} color="#ef4444" />
                            <span style={{ fontSize: '0.6rem', color: '#ef4444', fontWeight: 700, textAlign: 'center', lineHeight: 1.2 }}>Error al subir</span>
                            <button type="button" onClick={() => retryImage(img.id)} style={{ fontSize: '0.6rem', background: 'rgba(239,68,68,0.85)', border: 'none', borderRadius: 4, padding: '0.2rem 0.5rem', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>Reintentar</button>
                          </div>
                        )}
                        {img.uploading && (
                          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: 'rgba(0,0,0,0.4)' }}>
                            <div style={{ height: '100%', width: `${img.progress}%`, background: 'linear-gradient(90deg, #ff8008, #ff3f3f)', transition: 'width 0.3s' }} />
                          </div>
                        )}
                        {!img.uploading && img.progress === 100 && !img.error && (
                          <div style={{ position: 'absolute', bottom: 6, right: 6, background: '#22c55e', borderRadius: '50%', padding: 2, display: 'flex' }}>
                            <Check size={9} color="#fff" />
                          </div>
                        )}
                        {img.uploading && (
                          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
                            <div style={{ width: 22, height: 22, border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                          </div>
                        )}
                        {!img.error && (
                          <div className="img-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', opacity: 0, transition: 'opacity 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                            <div style={{ display: 'flex', gap: '0.3rem' }}>
                              <button type="button" onClick={() => moveImage(index, -1)} disabled={index === 0} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 5, padding: '0.3rem', cursor: 'pointer', color: '#fff', display: 'flex', opacity: index === 0 ? 0.3 : 1 }}><ArrowUp size={12} /></button>
                              <button type="button" onClick={() => moveImage(index, 1)} disabled={index === images.length - 1} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 5, padding: '0.3rem', cursor: 'pointer', color: '#fff', display: 'flex', opacity: index === images.length - 1 ? 0.3 : 1 }}><ArrowDown size={12} /></button>
                            </div>
                            <button type="button" onClick={() => removeImage(img.id)} style={{ background: 'rgba(239,68,68,0.85)', border: 'none', borderRadius: 5, padding: '0.25rem 0.6rem', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.72rem', fontWeight: 700 }}>
                              <X size={11} /> Quitar
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    {images.length < MAX_IMAGES && (
                      <label htmlFor="file-upload-input" style={{ border: '2px dashed var(--glass-border)', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', aspectRatio: '1', color: 'var(--text-muted)', gap: '0.25rem' }}>
                        <Plus size={20} /><span style={{ fontSize: '0.68rem' }}>Agregar</span>
                      </label>
                    )}
                  </div>
                )}

                {images.length > 0 && (
                  <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: anyUploading ? '#facc15' : errorCount > 0 ? '#ef4444' : allReady ? '#22c55e' : 'var(--text-muted)' }}>
                    {anyUploading && <span style={{ width: 10, height: 10, border: '2px solid rgba(250,204,21,0.3)', borderTopColor: '#facc15', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block', flexShrink: 0 }} />}
                    {anyUploading ? `Subiendo... (${uploadedCount}/${images.length})` : errorCount > 0 ? `${errorCount} con error` : allReady ? `${images.length} imagen${images.length > 1 ? 'es listas' : ' lista'}` : `${uploadedCount}/${images.length} subidas`}
                  </p>
                )}
              </div>

              {/* ── TALLAS ──────────────────────────────────────────────────── */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Tallas Disponibles (EUR)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  {STANDARD_SIZES.map(size => {
                    const sel = formData.sizes.includes(size);
                    return (
                      <button type="button" key={size} onClick={() => toggleArrayField('sizes', size)}
                        style={{ padding: '0.4rem 0.2rem', borderRadius: 4, border: '1px solid', cursor: 'pointer', transition: 'all 0.15s', fontWeight: 700, fontSize: '0.8rem',
                          borderColor: sel ? 'rgba(255,63,63,0.4)' : 'var(--glass-border)',
                          background:  sel ? 'var(--accent-gradient)' : 'transparent',
                          color:       sel ? '#fff' : 'var(--text-secondary)' }}>
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── COLORES ─────────────────────────────────────────────────── */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Colores disponibles</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {COLORS_LIST.map(color => {
                    const sel = formData.colors.includes(color);
                    return (
                      <button type="button" key={color} className="pill-btn" onClick={() => toggleArrayField('colors', color)}
                        style={{ padding: '0.3rem 0.8rem', borderRadius: 20, border: '1px solid', cursor: 'pointer', transition: 'all 0.15s', fontSize: '0.8rem', fontWeight: sel ? 700 : 400,
                          borderColor: sel ? 'rgba(255,63,63,0.5)' : 'var(--glass-border)',
                          background:  sel ? 'rgba(255,63,63,0.15)' : 'transparent',
                          color:       sel ? '#ff8080' : 'var(--text-secondary)' }}>
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── ETIQUETAS ───────────────────────────────────────────────── */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span>Etiquetas</span>
                  {formData.discount_enabled && (
                    <span style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', fontSize: '0.65rem', padding: '0.1rem 0.45rem', borderRadius: 4, fontWeight: 700 }}>+ Oferta (automático)</span>
                  )}
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {TAGS_LIST.map(tag => {
                    const sel = formData.tags.includes(tag);
                    return (
                      <button type="button" key={tag} className="pill-btn" onClick={() => toggleArrayField('tags', tag)}
                        style={{ padding: '0.3rem 0.8rem', borderRadius: 20, border: '1px solid', cursor: 'pointer', transition: 'all 0.15s', fontSize: '0.8rem', fontWeight: sel ? 700 : 400,
                          borderColor: sel ? 'rgba(255,128,8,0.5)' : 'var(--glass-border)',
                          background:  sel ? 'rgba(255,128,8,0.15)' : 'transparent',
                          color:       sel ? '#ff8008' : 'var(--text-secondary)' }}>
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── DESCRIPCIÓN ─────────────────────────────────────────────── */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Descripción</label>
                <textarea name="description" rows={3} placeholder="Materiales, amortiguación, diseño..." className="form-input" value={formData.description} onChange={handleInputChange} style={{ resize: 'vertical' }} />
              </div>

              {/* ── Botones ─────────────────────────────────────────────────── */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                <button type="button" className="btn-secondary" onClick={closeModal} disabled={submitting} style={{ padding: '0.6rem 1.25rem' }}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={submitting || anyUploading} style={{ padding: '0.6rem 1.5rem', minWidth: 160 }}>
                  {submitting
                    ? <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} />
                    : anyUploading ? 'Subiendo imágenes...' : 'Guardar Zapatilla'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
