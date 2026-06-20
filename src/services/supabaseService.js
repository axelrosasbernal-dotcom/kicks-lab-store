import { supabase } from '../integrations/supabase/supabaseClient';

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getFavoritesRanking(products) {
  const { data, error } = await supabase
    .from('favorites')
    .select('product_id');
  if (error) throw error;
  
  const counts = {};
  data?.forEach(f => {
    counts[f.product_id] = (counts[f.product_id] || 0) + 1;
  });
  
  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([pid, count]) => ({
      product: products.find(p => p.id === pid),
      count
    }))
    .filter(r => r.product);
}

export async function toggleFavorite(productId, sessionId, isFav) {
  if (isFav) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('product_id', productId)
      .eq('session_id', sessionId);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('favorites')
      .insert([{ product_id: productId, session_id: sessionId }]);
    if (error) {
      // Fallback if session_id insertion fails due to schema restrictions
      const { error: fallbackError } = await supabase
        .from('favorites')
        .insert([{ product_id: productId }]);
      if (fallbackError) throw fallbackError;
    }
  }
}

export async function saveProduct(editingId, corePayload, extendedPayload, allUrls) {
  let savedId = editingId;

  // Step 1: Save base fields
  if (editingId) {
    const { error } = await supabase
      .from('products')
      .update(corePayload)
      .eq('id', editingId);
    if (error) throw error;
  } else {
    const newId = crypto.randomUUID();
    const { error } = await supabase
      .from('products')
      .insert([{ ...corePayload, id: newId }]);
    if (error) throw error;
    savedId = newId;
  }

  // Step 2: Update extended fields (silent warning if fields do not exist yet)
  if (savedId) {
    try {
      await supabase
        .from('products')
        .update(extendedPayload)
        .eq('id', savedId);
    } catch (err) {
      console.warn('Could not update extended payload:', err);
    }
  }

  // Step 3: Update image_urls (silent warning)
  if (savedId && allUrls.length > 0) {
    try {
      await supabase
        .from('products')
        .update({ image_urls: allUrls })
        .eq('id', savedId);
    } catch (err) {
      console.warn('Could not update image_urls:', err);
    }
  }

  return savedId;
}

export async function deleteProduct(id) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ── Orders ────────────────────────────────────────────────────────────────────

export async function getOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function saveOrder(id, payload) {
  if (id) {
    const { error } = await supabase.from('orders').update(payload).eq('id', id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('orders').insert([payload]);
    if (error) throw error;
  }
}

export async function deleteOrder(id) {
  const { error } = await supabase.from('orders').delete().eq('id', id);
  if (error) throw error;
}

// ── Storage ───────────────────────────────────────────────────────────────────

export async function uploadProductImage(bucket, path, file) {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { contentType: 'image/webp', upsert: false });
  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
    
  return publicUrl;
}
