import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useCVs() {
  const { user } = useAuth();
  const [cvs,     setCVs]     = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCVs = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('cvs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setCVs(data ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchCVs(); }, [fetchCVs]);

  const uploadCV = async (file, name) => {
    if (!user) return { error: new Error('Not authenticated') };

    const ext      = file.name.split('.').pop();
    const filePath = `${user.id}/${Date.now()}.${ext}`;

    const { error: storageErr } = await supabase.storage
      .from('cvs')
      .upload(filePath, file, { upsert: false });

    if (storageErr) return { error: storageErr };

    const { data, error: dbErr } = await supabase
      .from('cvs')
      .insert({
        user_id:   user.id,
        name:      name || file.name.replace(/\.[^/.]+$/, ''),
        file_path: filePath,
        file_size: file.size,
        file_type: file.type,
        ats_score: 0,
      })
      .select()
      .single();

    if (data) setCVs((prev) => [data, ...prev]);
    return { data, error: dbErr };
  };

  const getDownloadUrl = async (filePath) => {
    const { data } = await supabase.storage
      .from('cvs')
      .createSignedUrl(filePath, 3600);
    return data?.signedUrl ?? null;
  };

  const deleteCV = async (cvId, filePath) => {
    if (filePath) {
      await supabase.storage.from('cvs').remove([filePath]);
    }
    await supabase.from('cvs').delete().eq('id', cvId).eq('user_id', user.id);
    setCVs((prev) => prev.filter((cv) => cv.id !== cvId));
  };

  const setActiveCV = async (cvId) => {
    await supabase.from('cvs').update({ is_active: false }).eq('user_id', user.id);
    await supabase.from('cvs').update({ is_active: true, updated_at: new Date().toISOString() }).eq('id', cvId);
    setCVs((prev) => prev.map((cv) => ({ ...cv, is_active: cv.id === cvId })));
  };

  const renameCV = async (cvId, newName) => {
    const { data, error } = await supabase
      .from('cvs')
      .update({ name: newName, updated_at: new Date().toISOString() })
      .eq('id', cvId)
      .eq('user_id', user.id)
      .select()
      .single();
    if (data) setCVs((prev) => prev.map((cv) => (cv.id === cvId ? data : cv)));
    return { error };
  };

  const activeCV = cvs.find((cv) => cv.is_active) ?? cvs[0] ?? null;

  return { cvs, activeCV, loading, uploadCV, deleteCV, setActiveCV, renameCV, getDownloadUrl, refetch: fetchCVs };
}
