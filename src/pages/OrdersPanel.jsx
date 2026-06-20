import React, { useState, useEffect } from 'react';
import {
  Plus, Trash2, Edit2, X, Check, Info,
  Search, Package, Clock, CheckCircle, DollarSign
} from 'lucide-react';
import { getOrders, saveOrder, deleteOrder } from '../services/supabaseService';

const STATUS_OPTIONS = ['Pendiente', 'En proceso', 'Entregado', 'Cancelado'];

const STATUS_COLORS = {
  'Pendiente':  { bg: 'rgba(234,179,8,0.15)',  color: '#facc15', border: 'rgba(234,179,8,0.3)'  },
  'En proceso': { bg: 'rgba(96,165,250,0.15)',  color: '#60a5fa', border: 'rgba(96,165,250,0.3)' },
  'Entregado':  { bg: 'rgba(34,197,94,0.15)',   color: '#4ade80', border: 'rgba(34,197,94,0.3)'  },
  'Cancelado':  { bg: 'rgba(239,68,68,0.15)',   color: '#f87171', border: 'rgba(239,68,68,0.3)'  },
};

const INITIAL_FORM = {
  customer_name: '', customer_phone: '', product_name: '',
  brand: '', size: '', price: '', quantity: 1,
  total_price: '', status: 'Pendiente', notes: ''
};

const fmtMoney = (n) => {
  if (n === null || n === undefined || n === '') return '—';
  return '$' + Number(n).toLocaleString('es-AR');
};

const fmtDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' });
};

function StatusBadge({ status }) {
  const sc = STATUS_COLORS[status] || STATUS_COLORS['Pendiente'];
  return (
    <span style={{
      background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
      borderRadius: 20, padding: '0.2rem 0.65rem',
      fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0
    }}>
      {status}
    </span>
  );
}

export default function OrdersPanel() {
  const [orders,       setOrders]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [isModalOpen,  setIsModalOpen]  = useState(false);
  const [editingId,    setEditingId]    = useState(null);
  const [formData,     setFormData]     = useState(INITIAL_FORM);
  const [submitting,   setSubmitting]   = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [errorMsg,     setErrorMsg]     = useState('');
  const [detailOrder,  setDetailOrder]  = useState(null);

  // Filters
  const [searchCustomer,  setSearchCustomer]  = useState('');
  const [searchProduct,   setSearchProduct]   = useState('');
  const [filterStatus,    setFilterStatus]    = useState('');
  const [filterDateFrom,  setFilterDateFrom]  = useState('');
  const [filterDateTo,    setFilterDateTo]    = useState('');

  useEffect(() => { fetchOrders(); }, []);

  // Auto-calc total when price or quantity changes
  useEffect(() => {
    if (formData.price && formData.quantity) {
      setFormData(f => ({
        ...f,
        total_price: (Number(f.price) * Number(f.quantity)).toString()
      }));
    }
  }, [formData.price, formData.quantity]);

  async function fetchOrders() {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data || []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  const showNotification = (msg, type = 'success') => {
    setNotification({ show: true, message: msg, type });
    setTimeout(() => setNotification(n => ({ ...n, show: false })), 3500);
  };

  // ── Stats ─────────────────────────────────────────────────────────────────────
  const totalOrders  = orders.length;
  const pending      = orders.filter(o => o.status === 'Pendiente').length;
  const delivered    = orders.filter(o => o.status === 'Entregado').length;
  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelado')
    .reduce((s, o) => s + (Number(o.total_price) || 0), 0);

  // ── Filtered list ─────────────────────────────────────────────────────────────
  const filtered = orders.filter(o => {
    if (searchCustomer && !o.customer_name?.toLowerCase().includes(searchCustomer.toLowerCase())) return false;
    if (searchProduct  && !o.product_name?.toLowerCase().includes(searchProduct.toLowerCase()))   return false;
    if (filterStatus   && o.status !== filterStatus) return false;
    if (filterDateFrom && o.created_at < filterDateFrom) return false;
    if (filterDateTo   && o.created_at > filterDateTo + 'T23:59:59') return false;
    return true;
  });

  const hasFilters = searchCustomer || searchProduct || filterStatus || filterDateFrom || filterDateTo;

  // ── Modal helpers ─────────────────────────────────────────────────────────────
  const openAdd = () => {
    setFormData(INITIAL_FORM);
    setEditingId(null);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openEdit = (order) => {
    setFormData({
      customer_name:  order.customer_name  || '',
      customer_phone: order.customer_phone || '',
      product_name:   order.product_name   || '',
      brand:          order.brand          || '',
      size:           order.size           || '',
      price:          order.price          || '',
      quantity:       order.quantity       || 1,
      total_price:    order.total_price    || '',
      status:         order.status         || 'Pendiente',
      notes:          order.notes          || '',
    });
    setEditingId(order.id);
    setErrorMsg('');
    setDetailOrder(null);
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setEditingId(null); };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  // ── Submit ────────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!formData.customer_name.trim()) { setErrorMsg('El nombre del cliente es requerido.'); return; }
    if (!formData.product_name.trim())  { setErrorMsg('El nombre del producto es requerido.'); return; }

    setSubmitting(true);
    const payload = {
      customer_name:  formData.customer_name.trim(),
      customer_phone: formData.customer_phone.trim(),
      product_name:   formData.product_name.trim(),
      brand:          formData.brand.trim(),
      size:           formData.size.trim(),
      price:          formData.price !== '' ? parseFloat(formData.price) : null,
      quantity:       parseInt(formData.quantity) || 1,
      total_price:    formData.total_price !== '' ? parseFloat(formData.total_price) : null,
      status:         formData.status,
      notes:          formData.notes.trim(),
    };

    try {
      await saveOrder(editingId, payload);
      showNotification(editingId ? 'Pedido actualizado.' : 'Pedido registrado.');
      closeModal();
      fetchOrders();
    } catch (err) {
      setErrorMsg(`Error: ${err.message ?? 'Intentá de nuevo.'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este pedido?')) return;
    try {
      await deleteOrder(id);
      showNotification('Pedido eliminado.', 'error');
      setDetailOrder(null);
      fetchOrders();
    } catch (err) { alert(`Error: ${err.message}`); }
  };

  const handleStatusChange = async (order, newStatus) => {
    try {
      await saveOrder(order.id, { ...order, status: newStatus });
      showNotification('Estado actualizado.');
      fetchOrders();
    } catch (err) { alert(`Error: ${err.message}`); }
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .orders-table-wrap    { display: none !important; }
          .orders-cards-mobile  { display: flex !important; }
          .orders-filter-grid   { grid-template-columns: 1fr 1fr !important; }
          .orders-modal-form-2  { grid-template-columns: 1fr !important; }
          .orders-modal-form-3  { grid-template-columns: 1fr 1fr !important; }
          .detail-grid-2        { grid-template-columns: 1fr !important; }
        }
      ` }} />

      {/* ── Toast ──────────────────────────────────────────────────────────────── */}
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

      {/* ── Header ─────────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Historial de Compras</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Registrá y gestioná todos los pedidos de la tienda.
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary" style={{ padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} /> Nuevo Pedido
        </button>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Total pedidos',   value: totalOrders,          color: '#fff',    Icon: Package     },
          { label: 'Pendientes',      value: pending,              color: '#facc15', Icon: Clock       },
          { label: 'Entregados',      value: delivered,            color: '#4ade80', Icon: CheckCircle },
          { label: 'Ingresos totales',value: fmtMoney(totalRevenue), color: '#ff8008', Icon: DollarSign },
        ].map(({ label, value, color, Icon }) => (
          <div key={label} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.73rem', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.3 }}>{label}</span>
              <Icon size={15} style={{ color, opacity: 0.55, flexShrink: 0 }} />
            </div>
            <span style={{ fontSize: label === 'Ingresos totales' ? '1.2rem' : '1.75rem', fontWeight: 800, color, lineHeight: 1 }}>{value}</span>
          </div>
        ))}
      </div>

      {/* ── Filters ────────────────────────────────────────────────────────────── */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem' }}>
        <div className="orders-filter-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem', alignItems: 'end' }}>

          {[
            { label: 'Cliente', value: searchCustomer, setter: setSearchCustomer, placeholder: 'Buscar cliente...' },
            { label: 'Producto', value: searchProduct, setter: setSearchProduct, placeholder: 'Buscar producto...' },
          ].map(({ label, value, setter, placeholder }) => (
            <div key={label}>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem', display: 'block' }}>{label}</label>
              <div style={{ position: 'relative' }}>
                <Search size={13} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input
                  type="text"
                  placeholder={placeholder}
                  value={value}
                  onChange={e => setter(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2rem', fontSize: '0.82rem' }}
                />
              </div>
            </div>
          ))}

          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem', display: 'block' }}>Estado</label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="form-input" style={{ fontSize: '0.82rem', cursor: 'pointer' }}>
              <option value="">Todos</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem', display: 'block' }}>Desde</label>
            <input type="date" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)} className="form-input" style={{ fontSize: '0.82rem' }} />
          </div>

          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem', display: 'block' }}>Hasta</label>
            <input type="date" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)} className="form-input" style={{ fontSize: '0.82rem' }} />
          </div>

          {hasFilters && (
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                onClick={() => { setSearchCustomer(''); setSearchProduct(''); setFilterStatus(''); setFilterDateFrom(''); setFilterDateTo(''); }}
                className="btn-secondary"
                style={{ width: '100%', fontSize: '0.8rem', padding: '0.55rem 0.75rem' }}
              >
                Limpiar
              </button>
            </div>
          )}
        </div>

        {hasFilters && (
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.65rem' }}>
            {filtered.length} de {orders.length} pedido{orders.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* ── Content ────────────────────────────────────────────────────────────── */}
      {loading ? (
        <div style={{ padding: '4rem', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 24, height: 24, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#ff3f3f', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
          <Package size={36} style={{ color: 'var(--text-muted)', opacity: 0.3, display: 'block', margin: '0 auto 0.75rem' }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {orders.length === 0 ? 'No hay pedidos registrados aún. Creá el primero.' : 'No hay pedidos con los filtros aplicados.'}
          </p>
        </div>
      ) : (
        <>
          {/* ── Desktop table ─────────────────────────────────────────────────── */}
          <div className="glass-panel orders-table-wrap" style={{ overflowX: 'auto', padding: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                  {[
                    { h: 'Fecha' }, { h: 'Cliente' }, { h: 'Teléfono' }, { h: 'Producto' },
                    { h: 'Marca' }, { h: 'Talle' }, { h: 'Cant.', r: true },
                    { h: 'Precio', r: true }, { h: 'Total', r: true }, { h: 'Estado' }, { h: '' }
                  ].map(({ h, r }, i) => (
                    <th key={i} style={{ padding: '0.9rem 1rem', textAlign: r ? 'right' : 'left', color: 'var(--text-secondary)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => {
                  const sc = STATUS_COLORS[order.status] || STATUS_COLORS['Pendiente'];
                  return (
                    <tr
                      key={order.id}
                      className="table-row"
                      style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer', transition: 'background 0.2s' }}
                      onClick={() => setDetailOrder(order)}
                    >
                      <td style={{ padding: '0.9rem 1rem', whiteSpace: 'nowrap', color: 'var(--text-muted)', fontSize: '0.78rem' }}>{fmtDate(order.created_at)}</td>
                      <td style={{ padding: '0.9rem 1rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap' }}>{order.customer_name || '—'}</td>
                      <td style={{ padding: '0.9rem 1rem', color: 'var(--text-secondary)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{order.customer_phone || '—'}</td>
                      <td style={{ padding: '0.9rem 1rem', color: 'var(--text-primary)', maxWidth: 180 }}>
                        <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.product_name || '—'}</span>
                      </td>
                      <td style={{ padding: '0.9rem 1rem' }}>
                        {order.brand
                          ? <span style={{ background: 'rgba(255,255,255,0.05)', padding: '0.15rem 0.45rem', borderRadius: 4, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{order.brand}</span>
                          : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                      </td>
                      <td style={{ padding: '0.9rem 1rem', color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{order.size || '—'}</td>
                      <td style={{ padding: '0.9rem 1rem', textAlign: 'right', color: 'var(--text-primary)', fontWeight: 600 }}>{order.quantity || 1}</td>
                      <td style={{ padding: '0.9rem 1rem', textAlign: 'right', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{fmtMoney(order.price)}</td>
                      <td style={{ padding: '0.9rem 1rem', textAlign: 'right', fontWeight: 800, color: '#fff' }}>{fmtMoney(order.total_price)}</td>
                      <td style={{ padding: '0.9rem 1rem' }} onClick={e => e.stopPropagation()}>
                        <select
                          value={order.status}
                          onChange={e => handleStatusChange(order, e.target.value)}
                          style={{
                            background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                            borderRadius: 6, padding: '0.25rem 0.5rem',
                            fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                            outline: 'none', fontFamily: 'inherit'
                          }}
                        >
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '0.9rem 1rem' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button onClick={() => openEdit(order)} className="btn-secondary" style={{ padding: '0.4rem', borderRadius: 4, border: 'none' }} title="Editar"><Edit2 size={13} /></button>
                          <button onClick={() => handleDelete(order.id)} className="btn-danger" style={{ padding: '0.4rem', borderRadius: 4 }} title="Eliminar"><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Mobile cards ──────────────────────────────────────────────────── */}
          <div className="orders-cards-mobile" style={{ display: 'none', flexDirection: 'column', gap: '0.75rem' }}>
            {filtered.map(order => {
              const sc = STATUS_COLORS[order.status] || STATUS_COLORS['Pendiente'];
              return (
                <div
                  key={order.id}
                  className="glass-panel"
                  style={{ padding: '1.1rem', borderRadius: '12px', cursor: 'pointer' }}
                  onClick={() => setDetailOrder(order)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                    <div>
                      <p style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem', marginBottom: '0.1rem' }}>{order.customer_name || '—'}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {order.customer_phone || '—'} · {fmtDate(order.created_at)}
                      </p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '0.6rem 0.8rem', marginBottom: '0.65rem' }}>
                    <div>
                      <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.88rem' }}>{order.product_name || '—'}</p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                        {[order.brand, order.size && `Talle ${order.size}`].filter(Boolean).join(' · ') || '—'}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: 800, color: '#fff', fontSize: '1rem' }}>{fmtMoney(order.total_price)}</p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>×{order.quantity || 1}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }} onClick={e => e.stopPropagation()}>
                    <select
                      value={order.status}
                      onChange={e => handleStatusChange(order, e.target.value)}
                      style={{ flex: 1, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, borderRadius: 7, padding: '0.45rem 0.6rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', outline: 'none', fontFamily: 'inherit' }}
                    >
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button onClick={() => openEdit(order)} className="btn-secondary" style={{ padding: '0.45rem 0.75rem', borderRadius: 7, border: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem' }}>
                      <Edit2 size={12} /> Editar
                    </button>
                    <button onClick={() => handleDelete(order.id)} className="btn-danger" style={{ padding: '0.45rem 0.65rem', borderRadius: 7, display: 'flex', alignItems: 'center' }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── Detail modal ───────────────────────────────────────────────────────── */}
      {detailOrder && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={e => { if (e.target === e.currentTarget) setDetailOrder(null); }}
        >
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '16px', width: '100%', maxWidth: 520, maxHeight: '90vh', overflow: 'auto' }}>
            {/* Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>{fmtDate(detailOrder.created_at)}</p>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>{detailOrder.customer_name}</h3>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button onClick={() => openEdit(detailOrder)} className="btn-secondary" style={{ padding: '0.4rem 0.85rem', borderRadius: 7, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Edit2 size={12} /> Editar
                </button>
                <button onClick={() => setDetailOrder(null)} style={{ background: 'var(--bg-tertiary)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>×</button>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Status */}
              {(() => {
                const sc = STATUS_COLORS[detailOrder.status] || STATUS_COLORS['Pendiente'];
                return (
                  <div style={{ background: sc.bg, border: `1px solid ${sc.border}`, borderRadius: 10, padding: '0.75rem 1rem' }}>
                    <span style={{ color: sc.color, fontWeight: 800, fontSize: '0.9rem' }}>{detailOrder.status}</span>
                  </div>
                );
              })()}

              {/* Client */}
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '1rem' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.65rem' }}>Cliente</p>
                <div className="detail-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                  <div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>Nombre</p>
                    <p style={{ color: '#fff', fontWeight: 600 }}>{detailOrder.customer_name || '—'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>Teléfono</p>
                    <p style={{ color: 'var(--text-primary)' }}>{detailOrder.customer_phone || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Product */}
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '1rem' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.65rem' }}>Producto</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>Nombre</p>
                    <p style={{ color: '#fff', fontWeight: 600 }}>{detailOrder.product_name || '—'}</p>
                  </div>
                  <div className="detail-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                    <div>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>Marca</p>
                      <p style={{ color: 'var(--text-primary)' }}>{detailOrder.brand || '—'}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>Talle</p>
                      <p style={{ color: 'var(--text-primary)' }}>{detailOrder.size || '—'}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>Precio unitario</p>
                      <p style={{ color: 'var(--text-primary)' }}>{fmtMoney(detailOrder.price)}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>Cantidad</p>
                      <p style={{ color: 'var(--text-primary)', fontWeight: 700 }}>×{detailOrder.quantity || 1}</p>
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.65rem' }}>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>Total</p>
                    <p style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{fmtMoney(detailOrder.total_price)}</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {detailOrder.notes && (
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '1rem' }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Notas</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>{detailOrder.notes}</p>
                </div>
              )}

              {/* Delete */}
              <button
                onClick={() => handleDelete(detailOrder.id)}
                className="btn-danger"
                style={{ width: '100%', padding: '0.75rem', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
              >
                <Trash2 size={14} /> Eliminar pedido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add / Edit modal ───────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', zIndex: 1050, padding: '1.5rem', overflowY: 'auto' }}
          onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="glass-panel" style={{ maxWidth: 600, width: '100%', margin: 'auto', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%)', padding: '2rem' }}>

            {/* Modal header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{editingId ? 'Editar Pedido' : 'Nuevo Pedido'}</h2>
              <button onClick={closeModal} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', padding: '0.4rem', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
                <X size={16} />
              </button>
            </div>

            {errorMsg && (
              <div style={{ background: 'rgba(239,68,68,0.13)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: 8, fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Info size={15} style={{ flexShrink: 0 }} />{errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              <p style={{ fontSize: '0.7rem', color: 'var(--accent-yellow)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Datos del cliente</p>

              <div className="orders-modal-form-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Nombre *</label>
                  <input name="customer_name" required value={formData.customer_name} onChange={handleInput} className="form-input" placeholder="Nombre del cliente" />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Teléfono</label>
                  <input name="customer_phone" value={formData.customer_phone} onChange={handleInput} className="form-input" placeholder="+54 11 ..." />
                </div>
              </div>

              <p style={{ fontSize: '0.7rem', color: 'var(--accent-yellow)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginTop: '0.25rem' }}>Producto</p>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Nombre del producto *</label>
                <input name="product_name" required value={formData.product_name} onChange={handleInput} className="form-input" placeholder="ej. Air Force 1 '07" />
              </div>

              <div className="orders-modal-form-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Marca</label>
                  <input name="brand" value={formData.brand} onChange={handleInput} className="form-input" placeholder="Nike, Adidas..." />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Talle</label>
                  <input name="size" value={formData.size} onChange={handleInput} className="form-input" placeholder="ej. 42" />
                </div>
              </div>

              <div className="orders-modal-form-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Precio unitario ($)</label>
                  <input type="number" name="price" min={0} value={formData.price} onChange={handleInput} className="form-input" placeholder="0" />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Cantidad</label>
                  <input type="number" name="quantity" min={1} value={formData.quantity} onChange={handleInput} className="form-input" placeholder="1" />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Total ($)</label>
                  <input type="number" name="total_price" min={0} value={formData.total_price} onChange={handleInput} className="form-input" placeholder="Auto" />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Estado</label>
                <select name="status" value={formData.status} onChange={handleInput} className="form-input" style={{ cursor: 'pointer' }}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Notas (opcional)</label>
                <textarea name="notes" value={formData.notes} onChange={handleInput} className="form-input" rows={2} style={{ resize: 'vertical' }} placeholder="Instrucciones de entrega, observaciones..." />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <button type="button" onClick={closeModal} className="btn-secondary" style={{ padding: '0.6rem 1.25rem' }}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={submitting} style={{ padding: '0.6rem 1.5rem', minWidth: 140 }}>
                  {submitting
                    ? <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} />
                    : editingId ? 'Guardar cambios' : 'Registrar pedido'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
