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
        return <Store />;
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
      />

      {/* Main Content Area */}
      <main className="main-content">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-color)',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
        background: 'rgba(7, 9, 14, 0.5)',
        backdropFilter: 'blur(8px)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
          <span>© {new Date().getFullYear()} KICKS LAB. Todos los derechos reservados.</span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#" style={{ hover: { color: '#fff' } }}>Términos</a>
            <a href="#">Privacidad</a>
            <a href="#">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
