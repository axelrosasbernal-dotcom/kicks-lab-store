import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const ADMIN_EMAIL = 'axelrosasbernal@gmail.com';

export function useUserRole(user) {
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRole(null);
      setRoleLoading(false);
      return;
    }

    async function fetchRole() {
      setRoleLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error || !data) {
          // Fallback: determinar rol por email
          setRole(user.email === ADMIN_EMAIL ? 'admin' : 'client');
        } else {
          setRole(data.role);
        }
      } catch {
        setRole(user.email === ADMIN_EMAIL ? 'admin' : 'client');
      } finally {
        setRoleLoading(false);
      }
    }

    fetchRole();
  }, [user]);

  return { role, roleLoading, isAdmin: role === 'admin' };
}
