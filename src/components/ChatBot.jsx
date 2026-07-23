import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: '¡Hola! Soy el asistente de $NEAKERS NIK 👟 ¿En qué te puedo ayudar? Preguntame por modelos, talles, stock o precios.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages = [...messages, { role: 'user', text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: newMessages.slice(-10) }),
      });
      const data = await res.json();
      const reply = res.ok
        ? data.reply
        : 'Uy, tuve un problema para responder. Probá de nuevo en un rato o escribinos por WhatsApp.';
      setMessages((prev) => [...prev, { role: 'bot', text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: 'Uy, tuve un problema de conexión. Escribinos por WhatsApp mientras tanto.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((prev) => !prev)}
        title={open ? 'Cerrar chat' : 'Abrí el chat con nuestro asistente'}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '92px',
          zIndex: 9999,
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          background: 'var(--accent-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(255, 63, 63, 0.45)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 24px rgba(255, 63, 63, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(255, 63, 63, 0.45)';
        }}
      >
        {open ? <X size={26} color="#fff" /> : <MessageCircle size={26} color="#fff" />}
      </button>

      {open && (
        <div
          className="glass-panel"
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '24px',
            zIndex: 9999,
            width: '340px',
            maxWidth: 'calc(100vw - 32px)',
            height: '460px',
            maxHeight: 'calc(100vh - 140px)',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
          }}
        >
          <div
            style={{
              padding: '1rem',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}
          >
            <MessageCircle size={20} color="#fff" />
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>Asistente $NEAKERS NIK</div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.75rem' }}>Preguntame por modelos, talles y stock</div>
            </div>
          </div>

          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
              background: 'var(--bg-secondary)',
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  padding: '0.55rem 0.8rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  lineHeight: 1.4,
                  color: m.role === 'user' ? '#fff' : 'var(--text-primary)',
                  background: m.role === 'user' ? 'var(--accent-gradient)' : 'var(--glass-bg)',
                  border: m.role === 'user' ? 'none' : '1px solid var(--border-color)',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  padding: '0.55rem 0.8rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Loader2 size={16} color="var(--text-secondary)" style={{ animation: 'spin 1s linear infinite' }} />
              </div>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              padding: '0.75rem',
              borderTop: '1px solid var(--border-color)',
              background: 'var(--bg-tertiary)',
            }}
          >
            <input
              className="form-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribí tu consulta..."
              disabled={loading}
              style={{ flex: 1, fontSize: '0.85rem' }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              title="Enviar"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                opacity: loading || !input.trim() ? 0.5 : 1,
                background: 'var(--accent-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Send size={16} color="#fff" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
