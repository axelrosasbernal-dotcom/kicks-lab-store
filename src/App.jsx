import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Store from './components/Store';
import Auth from './components/Auth';
import AdminPanel from './components/AdminPanel';
import { supabase } from './supabaseClient';

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('store');
  const [authLoading, setAuthLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [cartOpenSignal, setCartOpenSignal] = useState(0);
  const [genderFilter, setGenderFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
      
      // Redirect on login or logout appropriately
      if (session?.user) {
        // Logged in
        if (activeTab === 'auth') {
          setActiveTab('store');
        }
      } else {
        // Logged out
        if (activeTab === 'admin') {
          setActiveTab('store');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [activeTab]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setActiveTab('store');
    } catch (error) {
      console.error('Error logging out:', error.message);
      // In offline/demo mode, just clear it locally
      setUser(null);
      setActiveTab('store');
    }
  };

  const renderContent = () => {
    if (authLoading) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
          color: 'var(--text-secondary)'
        }}>
          <div style={{
            width: '30px',
            height: '30px',
            border: '2px solid rgba(255, 63, 63, 0.1)',
            borderTopColor: '#ff3f3f',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      );
    }

    switch (activeTab) {
      case 'store':
        return <Store onAddToCart={() => setCartCount(c => c + 1)} cartOpenSignal={cartOpenSignal} genderFilter={genderFilter} />;
      case 'auth':
        return <Auth onAuthSuccess={(user) => {
          setUser(user);
          setActiveTab('admin'); // redirect to admin panel on login
        }} />;
      case 'admin':
        // Route guard: if not logged in, show auth
        if (!user) {
          return <Auth onAuthSuccess={(user) => {
            setUser(user);
            setActiveTab('admin');
          }} />;
        }
        return <AdminPanel />;
      default:
        return <Store />;
    }
  };

  return (
    <div className="app-container">
      {/* Header Navigation */}
      <Navbar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSignOut={handleSignOut}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(prev => !prev)}
        cartCount={cartCount}
        onCartClick={() => setCartOpenSignal(s => s + 1)}
        genderFilter={genderFilter}
        setGenderFilter={setGenderFilter}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {renderContent()}
      </main>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/542212267568"
        target="_blank"
        rel="noopener noreferrer"
        title="Consultanos por WhatsApp"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#25D366',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(37,211,102,0.45)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          textDecoration: 'none',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 24px rgba(37,211,102,0.6)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,211,102,0.45)';
        }}
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-color)',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
        background: 'var(--bg-secondary)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
          <span>© {new Date().getFullYear()} $NEAKERS NIK. Todos los derechos reservados.</span>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <a href="#" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>Términos</a>
            <a href="#" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>Privacidad</a>
            <a
              href="https://www.instagram.com/zapatillasnik/"
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram @zapatillasnik"
              style={{ color: 'var(--text-muted)', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              onMouseEnter={e => e.currentTarget.style.color = '#E1306C'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
              Instagram
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
