import React, { useState, useRef } from 'react';
import { Upload, X, FileSpreadsheet, Check, AlertCircle, Download, Loader } from 'lucide-react';
import { saveProduct, uploadProductImage } from '../services/supabaseService';
import { compressImage } from '../utils/imageCompressor';

const STORAGE_BUCKET = 'axelrb';
const DEFAULT_IMG = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800';

const TEMPLATE_HEADERS = ['nombre', 'marca', 'categoria', 'precio', 'descripcion', 'talles', 'colores', 'stock', 'tags', 'destacado', 'imagenes'];

const TEMPLATE_EXAMPLE_ROWS = [
  ['Air Force 1 \'07', 'Nike', 'Urbano', '150000', 'Clásica blanca de cuero', '38;39;40;41', 'Blanco', '10', 'Más vendido', 'si', 'af1_1.jpg;af1_2.jpg'],
  ['Ultraboost 22', 'Adidas', 'Running', '210000', 'Amortiguación Boost', '39;40;41;42', 'Negro;Gris', '5', '', 'no', 'ultraboost.jpg'],
];

function downloadTemplate() {
  const csv = [TEMPLATE_HEADERS.join(','), ...TEMPLATE_EXAMPLE_ROWS.map(r => r.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))].join('\r\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'planilla_zapatillas.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// Parser CSV simple compatible con comillas y comas dentro de campos
function parseCSV(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  const pushField = () => { row.push(field); field = ''; };
  const pushRow = () => { pushField(); rows.push(row); row = []; };
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else { inQuotes = false; }
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') pushField();
      else if (c === '\r') continue;
      else if (c === '\n') pushRow();
      else field += c;
    }
  }
  if (field.length > 0 || row.length > 0) pushRow();
  return rows.filter(r => r.some(c => c.trim() !== ''));
}

function rowsToProducts(csvRows) {
  const [header, ...dataRows] = csvRows;
  const idx = Object.fromEntries(TEMPLATE_HEADERS.map(h => [h, header.findIndex(c => c.trim().toLowerCase() === h)]));
  return dataRows.map((cols, i) => {
    const get = (key) => (idx[key] >= 0 ? (cols[idx[key]] || '').trim() : '');
    const splitList = (v) => v ? v.split(';').map(s => s.trim()).filter(Boolean) : [];
    return {
      rowNumber: i + 2,
      name: get('nombre'),
      brand: get('marca') || 'Nike',
      category: get('categoria') || null,
      price: get('precio'),
      description: get('descripcion'),
      sizes: splitList(get('talles')),
      colors: splitList(get('colores')),
      stock: get('stock'),
      tags: splitList(get('tags')),
      featured: /^s(i|í)$/i.test(get('destacado')),
      imageNames: splitList(get('imagenes')),
    };
  });
}

export default function BulkImportModal({ dbStatus, onClose, onImported }) {
  const [csvRows, setCsvRows]   = useState(null);
  const [products, setProducts] = useState([]);
  const [imageFiles, setImageFiles] = useState({}); // name(lowercase) -> File
  const [statuses, setStatuses] = useState([]); // { state: 'pending'|'uploading'|'ok'|'error', message }
  const [running, setRunning]   = useState(false);
  const [done, setDone]         = useState(false);
  const csvInputRef = useRef(null);
  const imgInputRef  = useRef(null);

  const handleCsvSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const rows = parseCSV(text);
    const parsed = rowsToProducts(rows);
    setCsvRows(rows);
    setProducts(parsed);
    setStatuses(parsed.map(() => ({ state: 'pending', message: '' })));
    setDone(false);
  };

  const handleImagesSelect = (e) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(prev => {
      const next = { ...prev };
      files.forEach(f => { next[f.name.toLowerCase()] = f; });
      return next;
    });
  };

  const updateStatus = (i, patch) => setStatuses(prev => prev.map((s, idx) => idx === i ? { ...s, ...patch } : s));

  const runImport = async () => {
    if (dbStatus !== 'connected') return;
    setRunning(true);
    setDone(false);

    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      updateStatus(i, { state: 'uploading', message: '' });

      if (!p.name) {
        updateStatus(i, { state: 'error', message: 'Falta el nombre.' });
        continue;
      }

      try {
        const urls = [];
        for (const imgName of p.imageNames) {
          const file = imageFiles[imgName.toLowerCase()];
          if (!file) continue;
          const compressed = await compressImage(file);
          const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
          const url = await uploadProductImage(STORAGE_BUCKET, path, compressed);
          urls.push(url);
        }
        const allUrls = urls.length > 0 ? urls : [DEFAULT_IMG];

        const corePayload = {
          name: p.name,
          brand: p.brand,
          price: p.price ? parseFloat(p.price) : 0,
          image_url: allUrls[0],
          description: p.description,
          sizes: p.sizes,
        };
        const extendedPayload = {
          category: p.category,
          colors: p.colors,
          stock: p.stock !== '' ? parseInt(p.stock) : null,
          tags: p.tags,
          featured: p.featured,
          discount_enabled: false,
          discount_type: 'percentage',
          discount_value: null,
          sale_price: null,
          discount_start: null,
          discount_end: null,
        };

        await saveProduct(null, corePayload, extendedPayload, allUrls);
        updateStatus(i, { state: 'ok', message: p.imageNames.length > urls.length ? 'Guardado (alguna imagen no se encontró)' : 'Guardado' });
      } catch (err) {
        updateStatus(i, { state: 'error', message: err.message ?? 'Error desconocido' });
      }
    }

    setRunning(false);
    setDone(true);
    onImported?.();
  };

  const okCount    = statuses.filter(s => s.state === 'ok').length;
  const errorCount = statuses.filter(s => s.state === 'error').length;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', zIndex: 999, padding: '1.5rem', overflowY: 'auto' }}>
      <div className="glass-panel" style={{ maxWidth: 820, width: '100%', margin: 'auto', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%)', padding: '2.5rem' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: '1.5rem' }}>Importación masiva de zapatillas</h2>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', padding: '0.4rem', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
            <X size={16} />
          </button>
        </div>

        {dbStatus !== 'connected' && (
          <div style={{ background: 'rgba(234,179,8,0.12)', border: '1px solid rgba(234,179,8,0.25)', color: '#facc15', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>La importación masiva requiere conexión a Supabase (no funciona en Modo Demo).</span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Paso 1: planilla */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <label className="form-label" style={{ margin: 0 }}>1. Planilla (.csv) con los datos de cada par</label>
              <button type="button" onClick={downloadTemplate} className="btn-secondary" style={{ padding: '0.35rem 0.8rem', fontSize: '0.78rem', borderRadius: 6, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Download size={13} /> Descargar planilla de ejemplo
              </button>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
              Columnas: nombre, marca, categoria, precio, descripcion, talles (separados por ;), colores (;), stock, tags (;), destacado (si/no), imagenes (nombres de archivo separados por ;).
            </p>
            <label htmlFor="csv-input" className="drop-zone" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', border: '1.5px dashed var(--glass-border)', borderRadius: 10, padding: '1rem', cursor: 'pointer' }}>
              <FileSpreadsheet size={20} style={{ color: 'var(--text-secondary)' }} />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {csvRows ? `${products.length} fila(s) detectada(s)` : 'Seleccionar archivo .csv'}
              </span>
            </label>
            <input id="csv-input" ref={csvInputRef} type="file" accept=".csv,text/csv" onChange={handleCsvSelect} style={{ display: 'none' }} />
          </div>

          {/* Paso 2: imágenes */}
          <div>
            <label className="form-label" style={{ marginBottom: '0.6rem', display: 'block' }}>2. Fotos (todas juntas — se vinculan por nombre de archivo con la columna "imagenes")</label>
            <label htmlFor="imgs-input" className="drop-zone" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', border: '1.5px dashed var(--glass-border)', borderRadius: 10, padding: '1rem', cursor: 'pointer' }}>
              <Upload size={20} style={{ color: 'var(--text-secondary)' }} />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {Object.keys(imageFiles).length > 0 ? `${Object.keys(imageFiles).length} imagen(es) cargada(s)` : 'Seleccionar imágenes'}
              </span>
            </label>
            <input id="imgs-input" ref={imgInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleImagesSelect} style={{ display: 'none' }} />
          </div>

          {/* Preview / resultados */}
          {products.length > 0 && (
            <div style={{ border: '1px solid var(--border-color)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.03)', position: 'sticky', top: 0 }}>
                      <th style={{ padding: '0.6rem 0.9rem', textAlign: 'left' }}>Foto</th>
                      <th style={{ padding: '0.6rem 0.9rem', textAlign: 'left' }}>Fila</th>
                      <th style={{ padding: '0.6rem 0.9rem', textAlign: 'left' }}>Nombre</th>
                      <th style={{ padding: '0.6rem 0.9rem', textAlign: 'left' }}>Precio</th>
                      <th style={{ padding: '0.6rem 0.9rem', textAlign: 'left' }}>Talles</th>
                      <th style={{ padding: '0.6rem 0.9rem', textAlign: 'left' }}>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p, i) => {
                      const firstImg = p.imageNames.map(n => imageFiles[n.toLowerCase()]).find(Boolean);
                      return (
                      <tr key={i} style={{ borderTop: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.55rem 0.9rem' }}>
                          <div style={{ width: 42, height: 42, borderRadius: 6, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                            {firstImg
                              ? <img src={URL.createObjectURL(firstImg)} alt={p.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                              : <AlertCircle size={16} style={{ color: p.imageNames.length ? '#ef4444' : 'var(--text-muted)' }} />}
                          </div>
                        </td>
                        <td style={{ padding: '0.55rem 0.9rem', color: 'var(--text-muted)' }}>{p.rowNumber}</td>
                        <td style={{ padding: '0.55rem 0.9rem' }}>{p.name || <em style={{ color: '#ef4444' }}>sin nombre</em>}</td>
                        <td style={{ padding: '0.55rem 0.9rem' }}>{p.price ? `$${Number(p.price).toLocaleString('es-AR')}` : '—'}</td>
                        <td style={{ padding: '0.55rem 0.9rem' }}>{p.sizes.join(', ') || '—'}</td>
                        <td style={{ padding: '0.55rem 0.9rem' }}>
                          {statuses[i]?.state === 'pending' && <span style={{ color: 'var(--text-muted)' }}>Pendiente</span>}
                          {statuses[i]?.state === 'uploading' && <span style={{ color: '#facc15', display: 'flex', alignItems: 'center', gap: 4 }}><Loader size={12} className="spin" /> Subiendo...</span>}
                          {statuses[i]?.state === 'ok' && <span style={{ color: '#4ade80', display: 'flex', alignItems: 'center', gap: 4 }}><Check size={13} /> {statuses[i].message}</span>}
                          {statuses[i]?.state === 'error' && <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: 4 }}><AlertCircle size={13} /> {statuses[i].message}</span>}
                        </td>
                      </tr>
                    );})}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {done && (
            <div style={{ background: errorCount > 0 ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)', border: `1px solid ${errorCount > 0 ? 'rgba(239,68,68,0.25)' : 'rgba(34,197,94,0.25)'}`, borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
              {okCount} de {products.length} zapatillas importadas correctamente{errorCount > 0 ? `, ${errorCount} con errores.` : '.'}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ padding: '0.7rem 1.3rem', borderRadius: 8 }}>
              {done ? 'Cerrar' : 'Cancelar'}
            </button>
            {!done && (
              <button
                type="button"
                onClick={runImport}
                disabled={!products.length || running || dbStatus !== 'connected'}
                className="btn-primary"
                style={{ padding: '0.7rem 1.5rem', borderRadius: 8, opacity: (!products.length || running || dbStatus !== 'connected') ? 0.5 : 1 }}>
                {running ? 'Importando...' : `Importar ${products.length || ''} zapatilla(s)`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
